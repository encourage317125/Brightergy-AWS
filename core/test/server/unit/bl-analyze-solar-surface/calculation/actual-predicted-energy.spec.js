"use strict";

const rootPath = "../../../../..";
require(rootPath + "/server/general/models");

var moment                = require("moment");
var chai                  = require("chai");
var expect                = chai.expect;
var actualPredictedEnergy = require(rootPath + "/server/bl-analyze-solar-surface/core/calculation/actual-predicted-energy");

describe("actual-predicted-energy", function() {
    describe("actual & predicted energy", function() {
        var inputData = {
            "dataPoints": [{
                "ts": "2014-02-01T08:00:00+03:00",
                "values": {
                    "WR8KU002:2002126708": {
                        "Pac": 331682.75977958326
                    },
                    "WR7KU009:2002112342": {
                        "Pac": 318796.14151016664
                    },
                    "WR7KU009:2002112282": {
                        "Pac": 317564.7160918334
                    }
                }
            }, {
                "ts": "2014-03-01T08:00:00+03:00",
                "values": {
                    "WR8KU002:2002126708": {
                        "Pac": 1089801.3232209159
                    },
                    "WR7KU009:2002112342": {
                        "Pac": 1039628.7460832498
                    },
                    "WR7KU009:2002112282": {
                        "Pac": 1001772.1022990823
                    }
                }
            }, {
                "ts": "2014-04-01T08:00:00+03:00",
                "values": {
                    "WR8KU002:2002126708": {
                        "Pac": 1199198.2499436673
                    },
                    "WR7KU009:2002112342": {
                        "Pac": 1163822.8520029178
                    },
                    "WR7KU009:2002112282": {
                        "Pac": 1142228.2012956666
                    }
                }
            }, {
                "ts": "2014-05-01T08:00:00+03:00",
                "values": {
                    "WR8KU002:2002126708": {
                        "Pac": 1395578.9376534824
                    },
                    "WR7KU009:2002112342": {
                        "Pac": 1319702.1421269004
                    },
                    "Envoy:409274": {
                        "powr": 14177.000000000005
                    },
                    "WR7KU009:2002112282": {
                        "Pac": 1288617.1925479993
                    }
                }
            }, {
                "ts": "2014-06-01T08:00:00+03:00",
                "values": {
                    "WR8KU002:2002126708": {
                        "Pac": 1302196.4153858335
                    },
                    "WR7KU009:2002112342": {
                        "Pac": 1265969.4705859995
                    },
                    "Envoy:409274": {
                        "powr": 955.0000000000003
                    },
                    "WR7KU009:2002112282": {
                        "Pac": 1229979.781033
                    }
                }
            }, {
                "ts": "2014-07-01T08:00:00+03:00",
                "values": {
                    "WR8KU002:2002126708": {
                        "Pac": 1491373.8027634998
                    },
                    "WR7KU009:2002112342": {
                        "Pac": 1438249.0997625
                    },
                    "Envoy:409274": {
                        "powr": 2839533.2345959614
                    },
                    "WR7KU009:2002112282": {
                        "Pac": 1401917.907884749
                    }
                }
            }, {
                "ts": "2014-08-01T08:00:00+03:00",
                "values": {
                    "WR8KU002:2002126708": {
                        "Pac": 1217690.4420958322
                    },
                    "WR7KU009:2002112342": {
                        "Pac": 1179489.7583689152
                    },
                    "Envoy:409274": {
                        "powr": 5191621.766810963
                    },
                    "WR7KU009:2002112282": {
                        "Pac": 1157400.1990465005
                    }
                }
            }, {
                "ts": "2014-09-01T08:00:00+03:00",
                "values": {
                    "WR8KU002:2002126708": {
                        "Pac": 1107085.8936037498
                    },
                    "WR7KU009:2002112342": {
                        "Pac": 1072838.7928455838
                    },
                    "Envoy:409274": {
                        "powr": 2399338.966666667
                    },
                    "WR7KU009:2002112282": {
                        "Pac": 1059792.2408867502
                    }
                }
            }, {
                "ts": "2014-10-01T08:00:00+03:00",
                "values": {
                    "WR8KU002:2002126708": {
                        "Pac": 850515.4579661663
                    },
                    "WR7KU009:2002112342": {
                        "Pac": 819416.6925374996
                    },
                    "Envoy:409274": {
                        "powr": 2046648
                    },
                    "WR7KU009:2002112282": {
                        "Pac": 818419.7252651659
                    }
                }
            }, {
                "ts": "2014-11-01T08:00:00+03:00",
                "values": {
                    "WR8KU002:2002126708": {
                        "Pac": 544448.9306060834
                    },
                    "WR7KU009:2002112342": {
                        "Pac": 530478.3209492496
                    },
                    "Envoy:409274": {
                        "powr": 1648171.5749999993
                    },
                    "WR7KU009:2002112282": {
                        "Pac": 533679.6366477498
                    }
                }
            }, {
                "ts": "2014-12-01T08:00:00+03:00",
                "values": {
                    "WR8KU002:2002126708": {
                        "Pac": 356063.17335725017
                    },
                    "WR7KU009:2002112342": {
                        "Pac": 341949.92911091674
                    },
                    "Envoy:409274": {
                        "powr": 676500.864502165
                    },
                    "WR7KU009:2002112282": {
                        "Pac": 342290.2028937502
                    }
                }
            }, {
                "ts": "2015-01-01T08:00:00+03:00",
                "values": {
                    "WR8KU002:2002126708": {
                        "Pac": 594032.9766967503
                    },
                    "WR7KU009:2002112342": {
                        "Pac": 573102.9240629169
                    },
                    "Envoy:409274": {
                        "powr": 1352206.1776695524
                    },
                    "WR7KU009:2002112282": {
                        "Pac": 574936.7485490828
                    }
                }
            }, {
                "ts": "2015-02-01T08:00:00+03:00",
                "values": {
                    "WR8KU002:2002126708": {
                        "Pac": 588966.7345191665
                    },
                    "WR7KU009:2002112342": {
                        "Pac": 562648.2840935831
                    },
                    "Envoy:409274": {
                        "powr": 1638401.1319264078
                    },
                    "WR7KU009:2002112282": {
                        "Pac": 554341.0153595832
                    }
                }
            }, {
                "ts": "2015-03-01T08:00:00+03:00",
                "values": {
                    "WR8KU002:2002126708": {
                        "Pac": 948880.6266224161
                    },
                    "WR7KU009:2002112342": {
                        "Pac": 919877.4264476668
                    },
                    "Envoy:409274": {
                        "powr": 3408488.5055194786
                    },
                    "WR7KU009:2002112282": {
                        "Pac": 907407.4146732496
                    }
                }
            }, {
                "ts": "2015-04-01T08:00:00+03:00",
                "values": {
                    "WR8KU002:2002126708": {
                        "Pac": 1131973.0804578336
                    },
                    "WR7KU009:2002112342": {
                        "Pac": 1098279.6901870845
                    },
                    "Envoy:409274": {
                        "powr": 3377624.757936506
                    },
                    "WR7KU009:2002112282": {
                        "Pac": 1075655.089105834
                    }
                }
            }, {
                "ts": "2015-05-01T08:00:00+03:00",
                "values": {
                    "WR8KU002:2002126708": {
                        "Pac": 1275610.8959884169
                    },
                    "WR7KU009:2002112342": {
                        "Pac": 1236005.4061617493
                    },
                    "Envoy:409274": {
                        "powr": 3228021.979797976
                    },
                    "WR7KU009:2002112282": {
                        "Pac": 1206218.3387401656
                    }
                }
            }, {
                "ts": "2015-06-01T08:00:00+03:00",
                "values": {
                    "WR8KU002:2002126708": {
                        "Pac": 1180614.0557214161
                    },
                    "WR7KU009:2002112342": {
                        "Pac": 1141051.0127093338
                    },
                    "Envoy:409274": {
                        "powr": 3508322.6558080832
                    },
                    "WR7KU009:2002112282": {
                        "Pac": 1115252.430474001
                    }
                }
            }, {
                "ts": "2015-07-01T08:00:00+03:00",
                "values": {
                    "WR8KU002:2002126708": {
                        "Pac": 1271832.3473608326
                    },
                    "WR7KU009:2002112342": {
                        "Pac": 1225401.095309251
                    },
                    "Envoy:409274": {
                        "powr": 3706301.496392498
                    },
                    "WR7KU009:2002112282": {
                        "Pac": 1182258.001376583
                    }
                }
            }, {
                "ts": "2015-08-01T08:00:00+03:00",
                "values": {
                    "WR8KU002:2002126708": {
                        "Pac": 1307893.4048696673
                    },
                    "WR7KU009:2002112342": {
                        "Pac": 1258349.6025281658
                    },
                    "Envoy:409274": {
                        "powr": 3745854.167316016
                    },
                    "WR7KU009:2002112282": {
                        "Pac": 943411.6648134167
                    }
                }
            }, {
                "ts": "2015-09-01T08:00:00+03:00",
                "values": {
                    "WR8KU002:2002126708": {
                        "Pac": 348047.7858948334
                    },
                    "WR7KU009:2002112342": {
                        "Pac": 335591.57549099997
                    },
                    "Envoy:409274": {
                        "powr": 958129.9784992782
                    },
                    "WR7KU009:2002112282": {
                        "Pac": 161091.79042466666
                    }
                }
            }]
        };

        var facilitiesList = {
            "5458afc6fe540a120074c20f": {
                "name": "Barretts Elementary",
                "id": "5458afc6fe540a120074c20f",
                "sourceId": "5458afc6fe540a120074c20f",
                "displayName": "Barretts Elementary School",
                "scopes": {
                    "5458b01afe540a120074c210": {
                        "name": "Barretts Elementary: Sunny WebBox",
                        "id": "5458b01afe540a120074c210",
                        "sourceId": "5458b01afe540a120074c210",
                        "displayName": "WebBox (Legacy)",
                        "lastReportedValue": 0,
                        "lastReportedTime": null,
                        "firstReportedTime": "2013-01-31T00:00:00.000Z",
                        "totalEnergyGenerated": 0,
                        "percent": 0,
                        "trend": null,
                        "nodes": {
                            "WR8KU002:2002126708": {
                                "id": "5458ba38c0fa5a0e0045f161",
                                "sourceId": "5458ba38c0fa5a0e0045f161",
                                "name": "Barretts Elementary: Inverter C",
                                "displayName": "SB 8000 Inverter",
                                "rate": 0.1,
                                "deviceOffset": -300,
                                "powerMetricId": "Pac",
                                "lastReportedValue": 0,
                                "lastReportedTime": null,
                                "totalEnergyGenerated": 0,
                                "firstReportedTime": "2013-01-31T00:00:00.000Z",
                                "percent": 0,
                                "trend": null
                            },
                            "WR7KU009:2002112282": {
                                "id": "5458b23e79e7b60e00b1133b",
                                "sourceId": "5458b23e79e7b60e00b1133b",
                                "name": "Barretts Elementary: Inverter B",
                                "displayName": "SB 7000 Inverter",
                                "rate": 0.1,
                                "deviceOffset": -300,
                                "powerMetricId": "Pac",
                                "lastReportedValue": 0,
                                "lastReportedTime": null,
                                "totalEnergyGenerated": 0,
                                "firstReportedTime": "2013-01-31T00:00:00.000Z",
                                "percent": 0,
                                "trend": null
                            },
                            "WR7KU009:2002112342": {
                                "id": "5458b22379e7b60e00b1133a",
                                "sourceId": "5458b22379e7b60e00b1133a",
                                "name": "Barretts Elementary: Inverter A",
                                "displayName": "SB 7000 Inverter",
                                "rate": 0.1,
                                "deviceOffset": -300,
                                "powerMetricId": "Pac",
                                "lastReportedValue": 0,
                                "lastReportedTime": null,
                                "totalEnergyGenerated": 0,
                                "firstReportedTime": "2013-01-31T00:00:00.000Z",
                                "percent": 0,
                                "trend": null
                            }
                        }
                    }
                },
                "lastReportedValue": 0,
                "lastReportedTime": null,
                "firstReportedTime": "2013-01-31T00:00:00.000Z",
                "totalEnergyGenerated": 0,
                "percent": 0,
                "trend": null,
                "potentialPower": 25.58,
                "facilityImage": "https://cdn.brightergy.com/FacilityAssets/image/sIwHdsgd2nWKniO9.jpg"
            },
            "549186ccadcc581500d216ab": {
                "name": "Facility-f375891d",
                "id": "549186ccadcc581500d216ab",
                "sourceId": "549186ccadcc581500d216ab",
                "displayName": "Facility-f375891d",
                "scopes": {
                    "5491ed7488640c230094a89c": {
                        "name": "Enphase Envoy",
                        "id": "5491ed7488640c230094a89c",
                        "sourceId": "5491ed7488640c230094a89c",
                        "displayName": "Scope",
                        "lastReportedValue": 0,
                        "lastReportedTime": null,
                        "firstReportedTime": null,
                        "totalEnergyGenerated": 0,
                        "percent": 0,
                        "trend": null,
                        "nodes": {
                            "Envoy:409274": {
                                "id": "5491edc388640c230094a89d",
                                "sourceId": "5491edc388640c230094a89d",
                                "name": "Solar Array",
                                "displayName": "Node",
                                "rate": 0.1,
                                "deviceOffset": -300,
                                "powerMetricId": "powr",
                                "lastReportedValue": 0,
                                "lastReportedTime": null,
                                "totalEnergyGenerated": 0,
                                "firstReportedTime": null,
                                "percent": 0,
                                "trend": null
                            }
                        }
                    }
                },
                "lastReportedValue": 0,
                "lastReportedTime": null,
                "firstReportedTime": null,
                "totalEnergyGenerated": 0,
                "percent": 0,
                "trend": null,
                "potentialPower": 0,
                "facilityImage": null
            }
        };

        it("should return empty result on wrong input", function() {
            var result = actualPredictedEnergy.transformTempoiqResponse({}, "year", facilitiesList);
            expect(result).a("object");
            expect(result.byFacility).to.be.empty;
        });

        it("should return answer with necessary fields", function() {
            var result = actualPredictedEnergy.transformTempoiqResponse(inputData, "year", facilitiesList);
            expect(result).to.exist;
            expect(result).to.have.property("Jan 2015", 3094.2788269783023);
            expect(result).to.have.property("Feb 2015", 3344.3571658987407);
        });

        it("should return correct predicted energy", function () {
            var result = actualPredictedEnergy.transformTempoiqResponse(inputData, "year", facilitiesList);
            var predictObject = new actualPredictedEnergy.PredictionObject(result, facilitiesList);
            // test for existing month
            expect(predictObject.predict("May 2015")).equals(3616.267745095544);

            // test for not existing month
            // Jan factor * potentialPower * SUN_HOURS
            expect(predictObject.predict("Jan 2015")).equals(2162.4053);
        });
    });

    describe("cloudy & sunny days", function() {
        var categories = [ "Jan 15","Feb 15","Mar 15","Apr 15","May 15","Jun 15","Jul 15","Aug 15","Sep 15","Oct 15","Nov 15","Dec 15" ];
        var inputData = [
            {
                "time" : moment([2015, 0, 1]).format("X"),
                "icon" : "cloudy"
            },
            {
                "time" : moment([2015, 0, 2]).format("X"),
                "icon" : "cloudy"
            },
            {
                "time" : moment([2015, 0, 3]).format("X"),
                "icon" : "cloudy"
            },
            {
                "time" : moment([2015, 0, 4]).format("X"),
                "icon" : "cloudy"
            },
            {
                "time" : moment([2015, 0, 5]).format("X"),
                "icon" : "clear-day"
            },
            {
                "time" : moment([2015, 0, 6]).format("X"),
                "icon" : "clear-day"
            },
            {
                "time" : moment([2015, 0, 7]).format("X"),
                "icon" : "clear-day"
            }
        ];

        it("should return daily forecast data with given date range and location", function() {
            /*actualPredictedEnergy.loadWeatherData({latitude: 1, longitude: 1}, "year", fakeWeatherProvider, function(err, result) {
             expect(err).to.be(null);
             expect(result).to.be.an("array");
             expect(result).to.have.length.above(1);
             done();
             });*/
        });

        it("should return empty result on wrong input", function() {
            var result = actualPredictedEnergy.transformWeatherResponse({}, "year", categories);
            expect(result).an("object");
            expect(result).to.be.empty;
        });

        it("should return correct data for correct location", function() {
            //var socket = getSocket(expectResult, done);
            var result = actualPredictedEnergy.transformWeatherResponse(inputData, "year", categories);
            expect(result).to.be.an("object");
            expect(result).to.include.keys("Jan 2015");
            //expect(result).to.contain.all.keys(categories);
            expect(result).to.have.property("Jan 2015").and.deep.equal({cloudydays: 4, sunnydays: 3});
            //expect(socket.message).deep.equals();
        });

        it("should return empty result on wrong date range", function() {
            var result = actualPredictedEnergy.transformWeatherResponse(inputData, "aa", categories);
            expect(result).an("object");
            expect(result).to.be.empty;
        });
    });
});
