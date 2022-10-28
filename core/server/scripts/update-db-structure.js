"use strict";
require("../general/models");
require("../bl-brighter-view/models");
require("../bl-data-sense/models");

var mongoose = require("mongoose"),
  //ObjectId = require("mongoose").Schema.ObjectId,
  ObjectId = mongoose.Types.ObjectId,
  //ObjectId = mongoose.Schema.Types.ObjectId,
  config = require("../../config/environment"),
  consts = require("../libs/consts"),
  argv = require("minimist")(process.argv.slice(2)),
  userDAO = require("../general/core/dao/user-dao"),
  presentationDAO = require("../bl-brighter-view/core/dao/presentation-dao"),
  dashboardDAO = require("../bl-data-sense/core/dao/dashboard-dao"),
  dataloggerDAO = require("../general/core/dao/data-logger-dao"),
  sensorDAO = require("../general/core/dao/sensor-dao"),
  metricDAO = require("../general/core/dao/metric-dao"),
  DataSource = mongoose.model("datasource"),
  log = require("../libs/log")(module),
  async = require("async"),
  utils = require("../libs/utils"),
  insertTagRules = require("./insert-tag-rules");

mongoose.connect(config.get("db:connection"), config.get("db:options"), function(mongooseErr) {

  if(!argv.email) {
    log.error("Please add key --email='someEmail'");
    process.exit();
  }

  /*
   * Not running update-schema-tagging fully for now
   *

  if(!argv.updateTagging) {
    log.info("No --updateTagging="bool" argument supplied, assuming value "false"");
  } else {
    if (!argv.updateTagging.localeCompare("true")) {
      hasUpdateSchemaTaggingFlag = true;
    }
  }
  */

  var usersCollection = mongoose.connection.db.collection("users"),
    presentationsCollection = mongoose.connection.db.collection("bv_presentations"),
    dashboardsCollection = mongoose.connection.db.collection("ds_dashboards"),
    dataSourcesCollection = mongoose.connection.db.collection("datasources");

  var facilitiesArray = [];
  var _currentUser = [];

function find (collectionName, query, callback) {
    mongoose.connection.db.collection(collectionName, function (err, collection) {
      collection.find(query).toArray(callback);
    });
}

function populateChildrenArray (dataSource, users, presentations, dashboards) {
  var childrenArray = dataSource.children;

  users.forEach(
    function(user){
        childrenArray.push({"tag": "User", "id": new ObjectId(user._id.toString())});
    }
  );
  presentations.forEach(
    function(presentation) {
        childrenArray.push({"tag": "Presentation", "id": new ObjectId(presentation._id.toString())});
    }
  );
  dashboards.forEach(
    function(dashboard) {
        childrenArray.push({"tag": "Dashboard", "id": new ObjectId(dashboard._id.toString())});
    }
  );

  return childrenArray;
}

function processDocument(collectionName, callback) {

  var collection = mongoose.connection.db.collection(collectionName);

  collection.update({},
    {
      $set: {
        children: [],
        parents: []
      }},
    { multi: true },
    callback
  );
}

  async.waterfall([
    function (callback) {
      userDAO.getUserByEmail(argv.email, callback);
    },
    function (currentUser, callback) {
      if (currentUser.role !== consts.USER_ROLES.BP) {
        var error = new Error("User role must be BP");
        error.status = 422;
        callback(error);
      } else {
        callback(null, currentUser);
      }
    },
    function (currentUser, callback) {
      insertTagRules.insertTagRules(argv.email);
      callback(null, currentUser);
    },
    function (currentUser, callback) {

      async.parallel([
        function (callback) {
          processDocument("bv_presentations", callback);
        },
        function (callback) {
          processDocument("users", callback);
        },
        function (callback) {
          processDocument("ds_dashboards", callback);
        }
      ], function (err, result) {
        callback(null, currentUser);
      });
    },
    function (currentUser, callback) {

      if (currentUser) {
        _currentUser = currentUser;
      }

      find("facilities", {}, callback);
    },
    function (documents, callback) {

      facilitiesArray = documents;

      async.eachSeries(facilitiesArray, function (facility, facilityCallback) {

        // ******** Going through the current Facility ********

        console.log("\n[DEBUG] : FACILITY");

        var userChildrenArray = [],
          presentationChildrenArray = [],
          dashboardChildrenArray = [];

        async.waterfall([
          function (callback) {
            userDAO.getUsersByParams({sourceFacilities: {$in: [facility._id]}}, function (err, users) {
              userChildrenArray = users;
              callback();
            });
          },
          function (callback) {
            presentationDAO.getPresentationsByParams({sourceFacilities: {$in: [facility._id]}}, 
              function (err, presentations) {
                presentationChildrenArray = presentations;
                callback();
              }
            );
          },
          function (callback) {
            dashboardDAO.getDashboardsByParams({sourceFacilities: {$in: [facility._id]}}, 
              function (err, dashboards) {
                dashboardChildrenArray = dashboards;
                callback();
              }
            );
          },
          function (callback) {

            var newFacilityDataSource = new DataSource({
              "dataSourceType": consts.DATA_SOURCE_TYPE.Facility,
              "name": facility.name,
              "creatorRole": facility.creatorRole,
              "creator": _currentUser._id,
              "utilityAccounts": facility.utilityAccounts,
              "utilityProvider": facility.utilityProvider,
              "nonProfit": facility.nonProfit,
              "taxID": facility.taxID,
              "street": facility.street,
              "state": facility.state,
              "postalCode": facility.postalCode,
              "country": facility.country,
              "city": facility.city,
              "children": [],
              "parents": []
            });

            newFacilityDataSource.children = populateChildrenArray(newFacilityDataSource, userChildrenArray, 
                              presentationChildrenArray, dashboardChildrenArray);

            async.waterfall([
              function (callback) {
                newFacilityDataSource.save(function (facilitySaveError, savedFacility) {
                  if (facilitySaveError) {
                    var correctErr = utils.convertError(facilitySaveError);
                    log.error(correctErr);
                    callback(null, null);
                  } else {
                    log.info("Facility Saved!");
                    callback(null, savedFacility, facility);
                  }
                });
              },
              function (newFacilityDataSource, origFacility, callback) {
                if (!newFacilityDataSource) {
                  log.error("New Facility retrieval error");
                  callback(null, null);
                }

                var parentTag = {"tag": "Facility", "id": newFacilityDataSource._id};

                async.parallel([
                  function (callback) {
                    async.each(userChildrenArray, function (userObj, userCallback) {
                      usersCollection.update({_id: userObj._id},
                        {$push: { "parents": parentTag }},
                        function (userUpdateError, updatedUser) {
                          if (userUpdateError) {
                            var correctErr = utils.convertError(userUpdateError);
                            log.error(correctErr);
                            //userCallback(null, null);
                            userCallback(null);
                          } else {
                            //log.info("User\"s parents array updated!");
                            //userCallback(null, savedDataLogger, dataLoggerObject);
                            userCallback(null, "User\"s parents array updated!");
                          }
                        }
                      );
                    }, function (updateErr, updateResult) {
                      if (updateErr) {
                        callback(updateErr, null);
                      } else {
                        callback(null, updateResult);
                      }
                    });
                  },
                  function (callback) {
                    async.each(presentationChildrenArray, 
                      function (presentationObj, presentationCallback) {
                        presentationsCollection.update({_id: presentationObj._id},
                          {$push: { "parents": parentTag }},
                          function (presentationUpdateError, updatedPresentation) {
                            if (presentationUpdateError) {
                              var correctErr = utils.convertError(presentationUpdateError);
                              log.error(correctErr);
                              presentationCallback(correctErr, null);
                            } else {
                              presentationCallback(null, "Presentation\"s parents array updated!");
                            }
                          }
                        );
                      }, function (updateErr, updateResult) {
                        if (updateErr) {
                          callback(updateErr, null);
                        } else {
                          callback(null, updateResult);
                        }
                      }
                    );
                  },
                  function (callback) {
                    async.each(dashboardChildrenArray, function (dashboardObj, dashboardCallback) {
                      dashboardsCollection.update({_id: dashboardObj._id},
                        {$push: { "parents": parentTag }},
                        function (dashboardUpdateError, updatedDashboard) {
                          if (dashboardUpdateError) {
                            var correctErr = utils.convertError(dashboardUpdateError);
                            log.error(correctErr);
                            dashboardCallback(null, correctErr);
                          } else {
                            dashboardCallback(null, "Dashboard\"s parents array updated!");
                          }
                        }
                      );
                    }, function (updateErr, updateResult) {
                      if (updateErr) {
                        callback(updateErr, null);
                      } else {
                        callback(null, updateResult);
                      }
                    });
                  }
                ], function (e, res) {
                  if (e) {
                    callback(e, null);
                  } else {
                    callback(null, res);
                  }
                });
              }
            ], function (err, result) {
              if (err) {
                var correctErr = utils.convertError(err);
                log.error(correctErr);
                callback(err, null);
              } else {
                log.info(result);
                callback(null, newFacilityDataSource, facility);
              }
            });
          },
          function (newFacilityDataSource, origFacility, callback) {

            if (!newFacilityDataSource) {
              log.error("New Facility retrieval error");
              callback();
            }

            // ******** Going through the current Facility"s DataLogger ********

            async.eachSeries(origFacility.dataLoggers, function (dataLogger, dataLoggerCallback) {

              console.log("\n[DEBUG] : DATALOGGER");

              var dataloggerUserChildrenArray = [],
                dataloggerPresentationChildrenArray = [],
                dataloggerDashboardChildrenArray = [];

              var dataLoggerObject = null;

              async.waterfall([
                function (callback) {
                  dataloggerDAO.getDataLoggerById(dataLogger, function (err, result) {
                    dataLoggerObject = result;
                    callback();
                  });
                },
                function (callback) {
                  userDAO.getUsersByParams({sourceDataLoggers: {$in: [dataLogger]}}, 
                    function (err, users) {
                      dataloggerUserChildrenArray = users;
                      callback();
                    }
                  );
                },
                function (callback) {
                  presentationDAO.getPresentationsByParams({sourceDataLoggers: {$in: [dataLogger]}}, 
                    function (err, presentations) {
                        dataloggerPresentationChildrenArray = presentations;
                        callback();
                    }
                  );
                },
                function (callback) {
                  dashboardDAO.getDashboardsByParams({sourceDataLoggers: {$in: [dataLogger]}},
                    function (err, dashboards) {
                        dataloggerDashboardChildrenArray = dashboards;
                        callback();
                    }
                  );
                },
                function (callback) {

                  var newDataLoggerDataSource = new DataSource({
                    "dataSourceType": consts.DATA_SOURCE_TYPE.DataLogger,
                    "name": dataLoggerObject.name,
                    "manufacturer": dataLoggerObject.manufacturer,
                    "device": dataLoggerObject.device,
                    "deviceID": dataLoggerObject.deviceID,
                    "accessMethod": dataLoggerObject.accessMethod,
                    "interval": dataLoggerObject.interval,
                    "latitude": dataLoggerObject.latitude,
                    "longitude": dataLoggerObject.longitude,
                    "weatherStation": dataLoggerObject.weatherStation,
                    "creatorRole": dataLoggerObject.creatorRole,
                    "creator": _currentUser._id,
                    "enphaseUserId": dataLoggerObject.enphaseUserId,
                    "endDate": dataLoggerObject.endDate,
                    "webAddress": dataLoggerObject.webAddress,
                    "destination": dataLoggerObject.destination,
                    "children": [],
                    "parents": [
                      {"tag": "Facility", "id": newFacilityDataSource._id}
                    ]
                  });

                  newDataLoggerDataSource.children = populateChildrenArray(newDataLoggerDataSource, 
                    dataloggerUserChildrenArray, dataloggerPresentationChildrenArray, dataloggerDashboardChildrenArray);

                  async.waterfall([
                    function (callback) {
                      newDataLoggerDataSource.save(function (dataLoggerSaveError, savedDataLogger) {
                        if (dataLoggerSaveError) {
                          var correctErr = utils.convertError(dataLoggerSaveError);
                          log.error(correctErr);
                          callback(null, null);
                        } else {
                          log.info("Facility\"s DataLogger Saved!");
                          callback(null, savedDataLogger);
                        }
                      });
                    },
                    function (savedDataLogger, callback) {
                      var childTag = {"tag": "DataLogger", "id": savedDataLogger._id};

                      dataSourcesCollection.update({_id: newFacilityDataSource._id},
                        {$push: { "children": childTag }},
                        function (facilityUpdateError, updatedFacility) {
                          if (facilityUpdateError) {
                            var correctErr = utils.convertError(facilityUpdateError);
                            log.error(correctErr);
                            callback(null, null);
                          } else {
                            log.info("Facility\"s children array updated!");
                            callback(null, savedDataLogger, dataLoggerObject);
                          }
                        }
                      );
                    },
                    function (newDataLoggerDataSource, origDataLogger, callback) {
                      if (!newDataLoggerDataSource) {
                        log.error("New DataLogger retrieval error");
                        callback(null, null);
                      }

                      var parentTag = {"tag": "DataLogger", "id": newDataLoggerDataSource._id};

                      async.parallel([
                        function (callback) {
                          async.each(dataloggerUserChildrenArray, function (userObj, userCallback) {
                            usersCollection.update({_id: userObj._id},
                              {$push: { "parents": parentTag }},
                              function (userUpdateError, updatedUser) {
                                if (userUpdateError) {
                                  var correctErr = utils.convertError(userUpdateError);
                                  log.error(correctErr);
                                  //userCallback(null, null);
                                  userCallback(null);
                                } else {
                                  //log.info("User\"s parents array updated!");
                                  //userCallback(null, savedDataLogger, dataLoggerObject);
                                  userCallback(null, "User\"s parents array updated!");
                                }
                              }
                            );
                          }, function (updateErr, updateResult) {
                            if (updateErr) {
                              callback(updateErr, null);
                            } else {
                              callback(null, updateResult);
                            }
                          });
                        },
                        function (callback) {
                          async.each(dataloggerPresentationChildrenArray, 
                            function (presentationObj, presentationCallback) {
                                presentationsCollection.update({_id: presentationObj._id},
                                  {$push: { "parents": parentTag }},
                                  function (presentationUpdateError, updatedPresentation) {
                                    if (presentationUpdateError) {
                                      var correctErr = utils.convertError(presentationUpdateError);
                                      log.error(correctErr);
                                      presentationCallback(correctErr, null);
                                    } else {
                                      presentationCallback(null, "Presentation\"s parents array updated!");
                                    }
                                  }
                                );
                              }, function (updateErr, updateResult) {
                                if (updateErr) {
                                  callback(updateErr, null);
                                } else {
                                  callback(null, updateResult);
                                }
                              }
                            );
                        },
                        function (callback) {
                          async.each(dataloggerDashboardChildrenArray, function (dashboardObj, dashboardCallback) {
                            dashboardsCollection.update({_id: dashboardObj._id},
                              {$push: { "parents": parentTag }},
                              function (dashboardUpdateError, updatedDashboard) {
                                if (dashboardUpdateError) {
                                  var correctErr = utils.convertError(dashboardUpdateError);
                                  log.error(correctErr);
                                  dashboardCallback(null, correctErr);
                                } else {
                                  dashboardCallback(null, "Dashboard\"s parents array updated!");
                                }
                              }
                            );
                          }, function (updateErr, updateResult) {
                            if (updateErr) {
                              callback(updateErr, null);
                            } else {
                              callback(null, updateResult);
                            }
                          });
                        }
                      ], function (e, res) {
                        if (e) {
                          callback(e, null);
                        } else {
                          callback(null, res);
                        }
                      });
                    }
                  ], function (err, result) {
                    if (err) {
                      var correctErr = utils.convertError(err);
                      log.error(correctErr);
                      callback(err, null);
                    } else {
                      log.info(result);
                      callback(null, newDataLoggerDataSource, dataLoggerObject);
                    }
                  });
                },
                function (newDataLoggerDataSource, origDataLogger, callback) {

                  if (!newDataLoggerDataSource) {
                    log.error("New DataLogger retrieval error");
                    callback();
                  }

                  // ******** Going through the current DataLogger"s Sensor ********

                  async.eachSeries(origDataLogger.sensors, function (sensor, sensorCallback) {

                    console.log("\n[DEBUG] : SENSOR");

                    var sensorUserChildrenArray = [],
                      sensorPresentationChildrenArray = [],
                      sensorDashboardChildrenArray = [];

                    var sensorObject = null;

                    async.waterfall([
                      function (callback) {
                        // Querying for actual Sensor object
                        sensorDAO.getSensorById(sensor, function (err, result) {
                          sensorObject = result;
                          callback();
                        });
                      },
                      function (callback) {
                        userDAO.getUsersByParams({sourceSensors: {$in: [sensor]}}, function (err, users) {
                          sensorUserChildrenArray = users;
                          callback();
                        });
                      },
                      function (callback) {
                        presentationDAO.getPresentationsByParams({sourceSensors: {$in: [sensor]}}, 
                          function (err, presentations) {
                              sensorPresentationChildrenArray = presentations;
                              callback();
                          }
                        );
                      },
                      function (callback) {
                        dashboardDAO.getDashboardsByParams({sourceSensors: {$in: [sensor]}}, 
                          function (err, dashboards) {
                            sensorDashboardChildrenArray = dashboards;
                            callback();
                          }
                        );
                      },
                      function (callback) {

                        var newSensorDataSource = new DataSource({
                          "dataSourceType": consts.DATA_SOURCE_TYPE.Sensor,
                          "name": sensorObject.name,
                          "manufacturer": sensorObject.manufacturer,
                          "device": sensorObject.device,
                          "deviceID": sensorObject.deviceID,
                          "sensorTarget": sensorObject.sensorTarget,
                          "interval": sensorObject.interval,
                          "latitude": sensorObject.Latitude,
                          "longitude": sensorObject.Longitude,
                          "weatherStation": sensorObject.weatherStation,
                          "creatorRole": sensorObject.creatorRole,
                          "creator": _currentUser._id,
                          "children": [],
                          "parents": [
                            {"tag": "DataLogger", "id": newDataLoggerDataSource._id}
                          ]
                        });

                        newSensorDataSource.children = populateChildrenArray(newSensorDataSource, 
                            sensorUserChildrenArray, sensorPresentationChildrenArray, sensorDashboardChildrenArray);

                        async.waterfall([
                          function (callback) {
                            newSensorDataSource.save(function (sensorSaveError, savedSensor) {
                              if (sensorSaveError) {
                                var correctErr = utils.convertError(sensorSaveError);
                                log.error(correctErr);
                                callback(null, null);
                              } else {
                                log.info("DataLogger\"s Sensor Saved!");
                                callback(null, savedSensor);
                              }
                            });
                          },

                          function (savedSensor, callback) {

                            if (!savedSensor) {
                              callback(null);
                            }

                            var childTag = {"tag": "Sensor", "id": savedSensor._id};

                            dataSourcesCollection.update({_id: newDataLoggerDataSource._id},
                              {$push: { "children": childTag }},
                              function (dataLoggerUpdateError, updatedDataLogger) {
                                if (dataLoggerUpdateError) {
                                  var correctErr = utils.convertError(dataLoggerUpdateError);
                                  log.error(correctErr);
                                  callback(null, null);
                                } else {
                                  log.info("DataLogger\"s children array updated!");
                                  //callback(null, updatedDataLogger, savedSensor);
                                  callback(null, savedSensor, sensorObject);
                                }
                              }
                            );
                          },
                          function (newSensorDataSource, origSensor, callback) {
                            if (!newSensorDataSource) {
                              log.error("New Sensor retrieval error");
                              callback(null, null);
                            }

                            var parentTag = {"tag": "Sensor", "id": newSensorDataSource._id};

                            async.parallel([
                              function (callback) {
                                async.each(sensorUserChildrenArray, function (userObj, userCallback) {
                                  usersCollection.update({_id: userObj._id},
                                    {$push: { "parents": parentTag }},
                                    function (userUpdateError, updatedUser) {
                                      if (userUpdateError) {
                                        var correctErr = utils.convertError(userUpdateError);
                                        log.error(correctErr);
                                        userCallback(null);
                                      } else {
                                        userCallback(null, "User\"s parents array updated!");
                                      }
                                    }
                                  );
                                }, function (updateErr, updateResult) {
                                  if (updateErr) {
                                    callback(updateErr, null);
                                  } else {
                                    callback(null, updateResult);
                                  }
                                });
                              },
                              function (callback) {
                                async.each(sensorPresentationChildrenArray, 
                                  function (presentationObj, presentationCallback) {
                                      presentationsCollection.update({_id: presentationObj._id},
                                        {$push: { "parents": parentTag }},
                                        function (presentationUpdateError, updatedPresentation) {
                                          if (presentationUpdateError) {
                                            var correctErr = utils.convertError(presentationUpdateError);
                                            log.error(correctErr);
                                            presentationCallback(correctErr, null);
                                          } else {
                                            presentationCallback(null, "Presentation\"s parents array updated!");
                                          }
                                        }
                                      );
                                    }, function (updateErr, updateResult) {
                                      if (updateErr) {
                                        callback(updateErr, null);
                                      } else {
                                        callback(null, updateResult);
                                      }
                                    }
                                );
                              },
                              function (callback) {
                                async.each(sensorDashboardChildrenArray, function (dashboardObj, dashboardCallback) {
                                  dashboardsCollection.update({_id: dashboardObj._id},
                                    {$push: { "parents": parentTag }},
                                    function (dashboardUpdateError, updatedDashboard) {
                                      if (dashboardUpdateError) {
                                        var correctErr = utils.convertError(dashboardUpdateError);
                                        log.error(correctErr);
                                        dashboardCallback(null, correctErr);
                                      } else {
                                        dashboardCallback(null, "Dashboard\"s parents array updated!");
                                      }
                                    }
                                  );
                                }, function (updateErr, updateResult) {
                                  if (updateErr) {
                                    callback(updateErr, null);
                                  } else {
                                    callback(null, updateResult);
                                  }
                                });
                              }
                            ], function (e, res) {
                              if (e) {
                                callback(e, null);
                              } else {
                                callback(null, res);
                              }
                            });
                          }
                        ], function (err, result) {
                          if (err) {
                            var correctErr = utils.convertError(err);
                            log.error(correctErr);
                            callback(err, null);
                          } else {
                            log.info(result);
                            callback(null, newSensorDataSource, sensorObject);
                          }
                        });
                      },
                      function (newSensorDataSource, origSensor, callback) {

                        if (!newSensorDataSource) {
                          log.error("New Sensor retrieval error");
                          callback();
                        }

                        // ******** Going through the current Sensor"s Metric ********

                        async.eachSeries(origSensor.metrics, function (metric, metricCallback) {

                          console.log("\n[DEBUG] : METRIC");

                          var metricUserChildrenArray = [],
                            metricPresentationChildrenArray = [],
                            metricDashboardChildrenArray = [];

                          var metricObject = null;

                          async.waterfall([
                            function (callback) {
                              // Querying for actual Metric object
                              metricDAO.getMetricById(metric, function (err, result) {
                                metricObject = result;
                                callback();
                              });
                            },
                            function (callback) {
                              userDAO.getUsersByParams({sourceMetrics: {$in: [metric]}}, function (err, users) {
                                metricUserChildrenArray = users;
                                callback();
                              });
                            },
                            function (callback) {
                              presentationDAO.getPresentationsByParams({sourceMetrics: {$in: [metric]}}, 
                                function (err, presentations) {
                                    metricPresentationChildrenArray = presentations;
                                    callback();
                                }
                              );
                            },
                            function (callback) {
                              dashboardDAO.getDashboardsByParams({sourceSensors: {$in: [metric]}}, 
                                function (err, dashboards) {
                                    metricDashboardChildrenArray = dashboards;
                                    callback();
                                }
                              );
                            },
                            function (callback) {

                              var newMetricDataSource = new DataSource({
                                "dataSourceType": consts.DATA_SOURCE_TYPE.Metric,
                                "name": metricObject.metricName,
                                "metric": metricObject.metric,
                                "metricType": metricObject.metricType,
                                "formula": metricObject.formula,
                                "metricID": metricObject.metricID,
                                "creatorRole": metricObject.creatorRole,
                                "creator": _currentUser._id,
                                "children": [],
                                "parents": [
                                  {"tag": "Sensor", "id": newSensorDataSource._id}
                                ]
                              });

                              newMetricDataSource.children = populateChildrenArray(newMetricDataSource, 
                                metricUserChildrenArray, metricPresentationChildrenArray, metricDashboardChildrenArray);

                              async.waterfall([
                                function (callback) {
                                  newMetricDataSource.save(function (metricSaveError, savedMetric) {
                                    if (metricSaveError) {
                                      var correctErr = utils.convertError(metricSaveError);
                                      log.error(correctErr);
                                      callback(null, null);
                                    } else {
                                      log.info("Sensor\"s Metric Saved!");
                                      callback(null, savedMetric);
                                    }
                                  });
                                },
                                function (savedMetric, callback) {

                                  if (!savedMetric) {
                                    callback(null);
                                  }

                                  var childTag = {"tag": "Metric", "id": savedMetric._id};

                                  dataSourcesCollection.update({_id: newSensorDataSource._id},
                                    {$push: { "children": childTag }},
                                    function (sensorUpdateError, updatedSensor) {
                                      if (sensorUpdateError) {
                                        var correctErr = utils.convertError(sensorUpdateError);
                                        log.error(correctErr);
                                        callback(null, null);
                                      } else {
                                        log.info("Sensor\"s children array updated!");
                                        //callback(null, updatedDataLogger, savedSensor);
                                        callback(null, savedMetric, metricObject);
                                      }
                                    }
                                  );
                                },
                                function (newMetricDataSource, origMetric, callback) {
                                  if (!newMetricDataSource) {
                                    log.error("New Metric retrieval error");
                                    callback(null, null);
                                  }

                                  var parentTag = {"tag": "Metric", "id": newMetricDataSource._id};

                                  async.parallel([
                                    function (callback) {
                                      async.each(metricUserChildrenArray, function (userObj, userCallback) {
                                        usersCollection.update({_id: userObj._id},
                                          {$push: { "parents": parentTag }},
                                          function (userUpdateError, updatedUser) {
                                            if (userUpdateError) {
                                              var correctErr = utils.convertError(userUpdateError);
                                              log.error(correctErr);
                                              userCallback(null);
                                            } else {
                                              userCallback(null, "User\"s parents array updated!");
                                            }
                                          }
                                        );
                                      }, function (updateErr, updateResult) {
                                        if (updateErr) {
                                          callback(updateErr, null);
                                        } else {
                                          callback(null, updateResult);
                                        }
                                      });
                                    },
                                    function (callback) {
                                      async.each(metricPresentationChildrenArray, 
                                        function (presentationObj, presentationCallback) {
                                            presentationsCollection.update({_id: presentationObj._id},
                                              {$push: { "parents": parentTag }},
                                              function (presentationUpdateError, updatedPresentation) {
                                                if (presentationUpdateError) {
                                                  var correctErr = utils.convertError(presentationUpdateError);
                                                  log.error(correctErr);
                                                  presentationCallback(correctErr, null);
                                                } else {
                                                  presentationCallback(null, "Presentation\"s parents array updated!");
                                                }
                                              }
                                            );
                                          }, function (updateErr, updateResult) {
                                            if (updateErr) {
                                              callback(updateErr, null);
                                            } else {
                                              callback(null, updateResult);
                                            }
                                          }
                                      );
                                    },
                                    function (callback) {
                                      async.each(metricDashboardChildrenArray, 
                                        function (dashboardObj, dashboardCallback) {
                                            dashboardsCollection.update({_id: dashboardObj._id},
                                              {$push: { "parents": parentTag }},
                                              function (dashboardUpdateError, updatedDashboard) {
                                                if (dashboardUpdateError) {
                                                  var correctErr = utils.convertError(dashboardUpdateError);
                                                  log.error(correctErr);
                                                  dashboardCallback(null, correctErr);
                                                } else {
                                                  dashboardCallback(null, "Dashboard\"s parents array updated!");
                                                }
                                              }
                                            );
                                          }, function (updateErr, updateResult) {
                                            if (updateErr) {
                                              callback(updateErr, null);
                                            } else {
                                              callback(null, updateResult);
                                            }
                                          }
                                      );
                                    }
                                  ], function (e, res) {
                                    if (e) {
                                      callback(e, null);
                                    } else {
                                      callback(null, res);
                                    }
                                  });
                                }
                              ], function (err, result) {
                                if (err) {
                                  var correctErr = utils.convertError(err);
                                  log.error(correctErr);
                                  callback(err, null);
                                } else {
                                  // PREV: log.info(result);
                                  log.info("Sensor\"s Metric Saved!");
                                  // PREV: callback(null, newMetricDataSource, sensorObject);
                                  callback(null, newMetricDataSource);
                                }
                              });
                            }
                          ], function (err, result) {
                            if (err) {
                              var correctErr = utils.convertError(err);
                              log.error(correctErr);
                              metricCallback(err);
                            } else {
                              log.info("Metric iteration completed");
                              metricCallback(null, "Metric iteration completed"); // Iteration succeeded
                            }
                          });
                        }, function (metricError, metricResult) {
                          if (metricError) {
                            callback(metricError);
                          } else {
                            callback(null, "Sensor\"s Metrics iteration completed");
                          }
                        });

                        // ******** End of iteration through the current DataLogger"s Sensors ********

                      }
                    ], function (err, result) {
                      if (err) {
                        var correctErr = utils.convertError(err);
                        log.error(correctErr);
                        sensorCallback(err);
                      } else {
                        log.info("Sensor iteration completed");
                        sensorCallback(null, "Sensor iteration completed"); // Iteration succeeded
                      }
                    });
                  }, function (sensorError, sensorResult) {
                    if (sensorError) {
                      callback(sensorError);
                    } else {
                      callback(null, "DataLogger\"s Sensors iteration completed");
                    }
                  });

                  // ******** End of iteration through the current DataLogger"s Sensors ********

                }
              ], function (err, result) {
                if (err) {
                  var correctErr = utils.convertError(err);
                  log.error(correctErr);
                  dataLoggerCallback(err);
                } else {
                  log.info("DataLogger iteration completed");
                  dataLoggerCallback(null, "DataLogger iteration completed"); // Iteration succeeded
                }
              });
            }, function (dataLoggerError, dataLoggerResult) {
              if (dataLoggerError) {
                callback(dataLoggerError);
              } else {
                callback(null, "Facility\"s DataLoggers iteration completed");
              }
            });

            // ******** End of iteration through the current Facility"s DataLogger ********
          }
        ], function (err, result) {
          if (err) {
            var correctErr = utils.convertError(err);
            log.error(correctErr);
            facilityCallback(err);
          } else {
            //log.info(result);
            log.info("Facility iteration completed");
            facilityCallback(null, "Facility iteration completed"); // Iteration succeeded
          }
        });

        // ******** End of current Facility iteration ********

      }, function (facilityError, facilityResult) {
        if (facilityError) {
          var correctErr = utils.convertError(facilityError);
          callback(correctErr);
        } else {
          callback(null, "Facilities iteration completed");
        }
      });
    }
  ], function (err, result) {
    if (err) {
      var correctErr = utils.convertError(err);
      log.error(correctErr);
    } else {
      log.info(result);
    }

    log.info("[update-db-structure.js] : [COMPLETED]", consts.OK);

    process.exit();
  });
});
