/**
 * @api {get} ems:currentdemand Get Current Demand data
 * @apiGroup EMS Lite - Surface
 * @apiName Get Current Demand data
 * @apiVersion 1.0.0
 * @apiDescription Get Current Demand data
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example
 * {
 *   "success": 1,
 *   "message": {
 *       "minDemand": 0.14565517241379305,
 *       "maxDemand": 1.2002962962962964,
 *       "currentDemand": 0.1474333333333333,
 *       "currentDayDemand": 192.36144034286266
 *   }
 *}
 *
 * @apiError (all) success 0
 * @apiError (all) message Error code
 * @apiErrorExample Error example
 *{
 *   "success": 0,
 *   "message": "External service error"
 *}
 */

/**
 * @api {get} ems:energy Get Energy data
 * @apiGroup EMS Lite - Surface
 * @apiName Get Energy data
 * @apiVersion 1.0.0
 * @apiDescription Get Energy data
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example
 *{
 *   "success": 1,
 *   "message": {
 *       "currentDayEnergy": 0,
 *       "currentDayRate": 0,
 *       "monthApproximateRate": 249.87789277809142,
 *       "minEnergy": 7.022075405405405,
 *       "maxEnergy": 35.64338302392723
 *   }
 *}
 *
 * @apiError (all) success 0
 * @apiError (all) message Error code
 * @apiErrorExample Error example
 *{
 *   "success": 0,
 *   "message": "External service error"
 *}
 */

/**
 * @api {get} ems:electricdemand Get Electric Demand data
 * @apiGroup EMS Lite - Surface
 * @apiName Get Electric Demand data
 * @apiVersion 1.0.0
 * @apiDescription Get Electric Demand data
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example
 *{
 *   "success": 1,
 *   "message": {
 *       "mainChart": {
 *           "categories": [
 *               "2015-08-05T00:00:00.000Z",
 *               "2015-08-06T00:00:00.000Z",
 *               "2015-08-07T00:00:00.000Z",
 *               "2015-08-08T00:00:00.000Z",
 *               "2015-08-09T00:00:00.000Z",
 *               "2015-08-10T00:00:00.000Z",
 *               "2015-08-11T00:00:00.000Z",
 *               "2015-08-12T00:00:00.000Z",
 *               "2015-08-13T00:00:00.000Z",
 *               "2015-08-14T00:00:00.000Z",
 *               "2015-08-15T00:00:00.000Z",
 *               "2015-08-16T00:00:00.000Z",
 *               "2015-08-17T00:00:00.000Z",
 *               "2015-08-18T00:00:00.000Z",
 *               "2015-08-19T00:00:00.000Z",
 *               "2015-08-20T00:00:00.000Z",
 *               "2015-08-21T00:00:00.000Z",
 *               "2015-08-22T00:00:00.000Z",
 *               "2015-08-23T00:00:00.000Z",
 *               "2015-08-24T00:00:00.000Z",
 *               "2015-08-25T00:00:00.000Z",
 *               "2015-08-26T00:00:00.000Z",
 *               "2015-08-27T00:00:00.000Z",
 *               "2015-08-28T00:00:00.000Z",
 *               "2015-08-29T00:00:00.000Z",
 *               "2015-08-30T00:00:00.000Z",
 *               "2015-08-31T00:00:00.000Z",
 *               "2015-09-01T00:00:00.000Z",
 *               "2015-09-02T00:00:00.000Z",
 *               "2015-09-03T00:00:00.000Z",
 *               "2015-09-04T00:00:00.000Z"
 *           ],
 *           "series": [
 *               {
 *                   "name": "Brightergy 6th Floor",
 *                   "sourceId": "55521beaa25a0c541b38d907",
 *                   "data": [
 *                       3.7697827777777784,
 *                       3.766417230769231,
 *                       0,
 *                       0,
 *                       0,
 *                       3.73021,
 *                       0,
 *                       3.727742727272727,
 *                       3.7320464102564106,
 *                       3.7310135135135134,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       3.72544,
 *                       0,
 *                       3.7190416734693876,
 *                       0,
 *                       0,
 *                       3.693373545787546,
 *                       3.7954908952380952,
 *                       3.68677293675384,
 *                       3.6866031412429363,
 *                       3.6823681127733057,
 *                       3.6758482971428577,
 *                       0,
 *                       3.654168102016607,
 *                       3.6483771115437222,
 *                       3.6476108587570613,
 *                       0,
 *                       0
 *                   ]
 *               },
 *               {
 *                   "name": "Brightergy 7th Floor",
 *                   "sourceId": "55dc94100bcf8e300089f32b",
 *                   "data": [
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0
 *                   ]
 *               },
 *               {
 *                   "name": null,
 *                   "sourceId": "54f9e98cf0bbdb1600a73c97",
 *                   "data": [
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0
 *                   ]
 *               },
 *               {
 *                   "name": null,
 *                   "sourceId": "5458a2acb0091419007e03df",
 *                   "data": [
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0
 *                   ]
 *               },
 *               {
 *                   "name": null,
 *                   "sourceId": "54f84ab21688f21600d74b48",
 *                   "data": [
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0
 *                   ]
 *               },
 *               {
 *                   "name": "Total",
 *                   "sourceId": null,
 *                   "data": [
 *                       3.7697827777777784,
 *                       3.766417230769231,
 *                       0,
 *                       0,
 *                       0,
 *                       3.73021,
 *                       0,
 *                       3.727742727272727,
 *                       3.7320464102564106,
 *                       3.7310135135135134,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       3.72544,
 *                       0,
 *                       3.7190416734693876,
 *                       0,
 *                       0,
 *                       3.693373545787546,
 *                       3.7954908952380952,
 *                       3.68677293675384,
 *                       3.6866031412429363,
 *                       3.6823681127733057,
 *                       3.6758482971428577,
 *                       0,
 *                       3.654168102016607,
 *                       3.6483771115437222,
 *                       3.6476108587570613,
 *                       0,
 *                       0
 *                   ]
 *               }
 *           ]
 *       },
 *       "demandBySources": {
 *           "55521beaa25a0c541b38d907": {
 *               "name": "Brightergy 6th Floor",
 *               "max": 3.7954908952380952,
 *               "min": 0,
 *               "last": 0,
 *               "sum": 63.07230733431501,
 *               "trend": null
 *           },
 *           "55dc94100bcf8e300089f32b": {
 *               "name": "Brightergy 7th Floor",
 *               "max": 0,
 *               "min": 0,
 *               "last": 0,
 *               "sum": 0,
 *               "trend": null
 *           },
 *           "54f9e98cf0bbdb1600a73c97": {
 *               "name": null,
 *               "max": 0,
 *               "min": 0,
 *               "last": 0,
 *               "sum": 0,
 *               "trend": null
 *           },
 *           "5458a2acb0091419007e03df": {
 *               "name": null,
 *               "max": 0,
 *               "min": 0,
 *               "last": 0,
 *               "sum": 0,
 *               "trend": null
 *           },
 *           "54f84ab21688f21600d74b48": {
 *               "name": null,
 *               "max": 0,
 *               "min": 0,
 *               "last": 0,
 *               "sum": 0,
 *               "trend": null
 *           }
 *       },
 *       "totalDemand": {
 *           "name": "Total",
 *           "max": 3.7954908952380952,
 *           "min": 0,
 *           "last": 0,
 *           "sum": 63.07230733431501,
 *           "trend": null
 *       },
 *       "realtime": false,
 *       "table": [
 *           {
 *               "date": "2015-08-05T00:00:00.000Z",
 *               "percent": 2.377688979436078,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.7697827777777784
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.7697827777777784
 *           },
 *           {
 *               "date": "2015-08-06T00:00:00.000Z",
 *               "percent": 2.375566251283366,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.766417230769231
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.766417230769231
 *           },
 *           {
 *               "date": "2015-08-07T00:00:00.000Z",
 *               "percent": 0,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 0
 *           },
 *           {
 *               "date": "2015-08-08T00:00:00.000Z",
 *               "percent": 0,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 0
 *           },
 *           {
 *               "date": "2015-08-09T00:00:00.000Z",
 *               "percent": 0,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 0
 *           },
 *           {
 *               "date": "2015-08-10T00:00:00.000Z",
 *               "percent": 2.3527295154153522,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.73021
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.73021
 *           },
 *           {
 *               "date": "2015-08-11T00:00:00.000Z",
 *               "percent": 0,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 0
 *           },
 *           {
 *               "date": "2015-08-12T00:00:00.000Z",
 *               "percent": 2.3511733495780307,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.727742727272727
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.727742727272727
 *           },
 *           {
 *               "date": "2015-08-13T00:00:00.000Z",
 *               "percent": 2.3538877817361943,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.7320464102564106
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.7320464102564106
 *           },
 *           {
 *               "date": "2015-08-14T00:00:00.000Z",
 *               "percent": 2.353236309928068,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.7310135135135134
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.7310135135135134
 *           },
 *           {
 *               "date": "2015-08-15T00:00:00.000Z",
 *               "percent": 0,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 0
 *           },
 *           {
 *               "date": "2015-08-16T00:00:00.000Z",
 *               "percent": 0,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 0
 *           },
 *           {
 *               "date": "2015-08-17T00:00:00.000Z",
 *               "percent": 0,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 0
 *           },
 *           {
 *               "date": "2015-08-18T00:00:00.000Z",
 *               "percent": 0,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 0
 *           },
 *           {
 *               "date": "2015-08-19T00:00:00.000Z",
 *               "percent": 2.349720966355505,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.72544
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.72544
 *           },
 *           {
 *               "date": "2015-08-20T00:00:00.000Z",
 *               "percent": 0,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 0
 *           },
 *           {
 *               "date": "2015-08-21T00:00:00.000Z",
 *               "percent": 2.3456853941818645,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.7190416734693876
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.7190416734693876
 *           },
 *           {
 *               "date": "2015-08-22T00:00:00.000Z",
 *               "percent": 0,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 0
 *           },
 *           {
 *               "date": "2015-08-23T00:00:00.000Z",
 *               "percent": 0,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 0
 *           },
 *           {
 *               "date": "2015-08-24T00:00:00.000Z",
 *               "percent": 2.329495913803409,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.693373545787546
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.693373545787546
 *           },
 *           {
 *               "date": "2015-08-25T00:00:00.000Z",
 *               "percent": 2.3939036822905155,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.7954908952380952
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.7954908952380952
 *           },
 *           {
 *               "date": "2015-08-26T00:00:00.000Z",
 *               "percent": 2.3253327573877334,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.68677293675384
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.68677293675384
 *           },
 *           {
 *               "date": "2015-08-27T00:00:00.000Z",
 *               "percent": 2.3252256634412563,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.6866031412429363
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.6866031412429363
 *           },
 *           {
 *               "date": "2015-08-28T00:00:00.000Z",
 *               "percent": 2.3225545332691953,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.6823681127733057
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.6823681127733057
 *           },
 *           {
 *               "date": "2015-08-29T00:00:00.000Z",
 *               "percent": 2.3184423351171284,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.6758482971428577
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.6758482971428577
 *           },
 *           {
 *               "date": "2015-08-30T00:00:00.000Z",
 *               "percent": 0,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 0
 *           },
 *           {
 *               "date": "2015-08-31T00:00:00.000Z",
 *               "percent": 2.30476813581642,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.654168102016607
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.654168102016607
 *           },
 *           {
 *               "date": "2015-09-01T00:00:00.000Z",
 *               "percent": 2.3011156245076614,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.6483771115437222
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.6483771115437222
 *           },
 *           {
 *               "date": "2015-09-02T00:00:00.000Z",
 *               "percent": 2.300632331195101,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.6476108587570613
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.6476108587570613
 *           },
 *           {
 *               "date": "2015-09-03T00:00:00.000Z",
 *               "percent": 0,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 0
 *           },
 *           {
 *               "date": "2015-09-04T00:00:00.000Z",
 *               "percent": 0,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 0
 *           }
 *       ],
 *       "dateRange": "month"
 *   }
 *}
 * @apiError (all) success 0
 * @apiError (all) message Error code
 * @apiErrorExample Error example
 *{
 *   "success": 0,
 *   "message": "External service error"
 *}
 */

/**
 * @api {get} ems:peakdemand Get Peak Demand data
 * @apiGroup EMS Lite - Surface
 * @apiName Get Peak Demand data
 * @apiVersion 1.0.0
 * @apiDescription Get Peak Demand data
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example
 *{
 *     "success": 1,
 *     "message": {
 *         "peakDemandBySources": {
 *             "55521beaa25a0c541b38d907": {
 *                 "name": "Brightergy 6th Floor",
 *                 "value": 9.417683973029048
 *             }
 *         },
 *         "peakDemand": 9.417683973029048,
 *         "lowestDemand": 0
 *     }
 *}
 *
 * @apiError (all) success 0
 * @apiError (all) message Error code
 * @apiErrorExample Error example
 *{
 *   "success": 0,
 *   "message": "External service error"
 *}
 */

/**
 * @api {get} ems:peakdemanddrilldown Get Peak Demand Drilldown data
 * @apiGroup EMS Lite - Surface
 * @apiName Get Peak Demand Drilldown data
 * @apiVersion 1.0.0
 * @apiDescription Get Peak Demand Drilldown data
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example
 *{
 *   "success": 1,
 *   "message": {
 *       "mainChart": {
 *           "categories": [
 *               "2015-08-05T00:00:00.000Z",
 *               "2015-08-06T00:00:00.000Z",
 *               "2015-08-07T00:00:00.000Z",
 *               "2015-08-08T00:00:00.000Z",
 *               "2015-08-09T00:00:00.000Z",
 *               "2015-08-10T00:00:00.000Z",
 *               "2015-08-11T00:00:00.000Z",
 *               "2015-08-12T00:00:00.000Z",
 *               "2015-08-13T00:00:00.000Z",
 *               "2015-08-14T00:00:00.000Z",
 *               "2015-08-15T00:00:00.000Z",
 *               "2015-08-16T00:00:00.000Z",
 *               "2015-08-17T00:00:00.000Z",
 *               "2015-08-18T00:00:00.000Z",
 *               "2015-08-19T00:00:00.000Z",
 *               "2015-08-20T00:00:00.000Z",
 *               "2015-08-21T00:00:00.000Z",
 *               "2015-08-22T00:00:00.000Z",
 *               "2015-08-23T00:00:00.000Z",
 *               "2015-08-24T00:00:00.000Z",
 *               "2015-08-25T00:00:00.000Z",
 *               "2015-08-26T00:00:00.000Z",
 *               "2015-08-27T00:00:00.000Z",
 *               "2015-08-28T00:00:00.000Z",
 *               "2015-08-29T00:00:00.000Z",
 *               "2015-08-30T00:00:00.000Z",
 *               "2015-08-31T00:00:00.000Z",
 *               "2015-09-01T00:00:00.000Z",
 *               "2015-09-02T00:00:00.000Z",
 *               "2015-09-03T00:00:00.000Z",
 *               "2015-09-04T00:00:00.000Z"
 *           ],
 *           "series": [
 *               {
 *                   "name": "Brightergy 6th Floor",
 *                   "sourceId": "55521beaa25a0c541b38d907",
 *                   "data": [
 *                       3.7697827777777784,
 *                       3.766417230769231,
 *                       0,
 *                       0,
 *                       0,
 *                       3.73021,
 *                       0,
 *                       3.727742727272727,
 *                       3.7320464102564106,
 *                       3.7310135135135134,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       3.72544,
 *                       0,
 *                       3.7190416734693876,
 *                       0,
 *                       0,
 *                       3.693373545787546,
 *                       3.7954908952380952,
 *                       3.68677293675384,
 *                       3.6866031412429363,
 *                       3.6823681127733057,
 *                       3.6758482971428577,
 *                       0,
 *                       3.654168102016607,
 *                       3.6483771115437222,
 *                       3.6476108587570613,
 *                       0,
 *                       0
 *                   ]
 *               },
 *               {
 *                   "name": "Brightergy 7th Floor",
 *                   "sourceId": "55dc94100bcf8e300089f32b",
 *                   "data": [
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0
 *                   ]
 *               },
 *               {
 *                   "name": null,
 *                   "sourceId": "54f9e98cf0bbdb1600a73c97",
 *                   "data": [
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0
 *                   ]
 *               },
 *               {
 *                   "name": null,
 *                   "sourceId": "5458a2acb0091419007e03df",
 *                   "data": [
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0
 *                   ]
 *               },
 *               {
 *                   "name": null,
 *                   "sourceId": "54f84ab21688f21600d74b48",
 *                   "data": [
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0
 *                   ]
 *               },
 *               {
 *                   "name": "Total",
 *                   "sourceId": null,
 *                   "data": [
 *                       3.7697827777777784,
 *                       3.766417230769231,
 *                       0,
 *                       0,
 *                       0,
 *                       3.73021,
 *                       0,
 *                       3.727742727272727,
 *                       3.7320464102564106,
 *                       3.7310135135135134,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       3.72544,
 *                       0,
 *                       3.7190416734693876,
 *                       0,
 *                       0,
 *                       3.693373545787546,
 *                       3.7954908952380952,
 *                       3.68677293675384,
 *                       3.6866031412429363,
 *                       3.6823681127733057,
 *                       3.6758482971428577,
 *                       0,
 *                       3.654168102016607,
 *                       3.6483771115437222,
 *                       3.6476108587570613,
 *                       0,
 *                       0
 *                   ]
 *               }
 *           ]
 *       },
 *       "demandBySources": {
 *           "55521beaa25a0c541b38d907": {
 *               "name": "Brightergy 6th Floor",
 *               "max": 3.7954908952380952,
 *               "min": 0,
 *               "last": 0,
 *               "sum": 63.07230733431501,
 *               "trend": null
 *           },
 *           "55dc94100bcf8e300089f32b": {
 *               "name": "Brightergy 7th Floor",
 *               "max": 0,
 *               "min": 0,
 *               "last": 0,
 *               "sum": 0,
 *               "trend": null
 *           },
 *           "54f9e98cf0bbdb1600a73c97": {
 *               "name": null,
 *               "max": 0,
 *               "min": 0,
 *               "last": 0,
 *               "sum": 0,
 *               "trend": null
 *           },
 *           "5458a2acb0091419007e03df": {
 *               "name": null,
 *               "max": 0,
 *               "min": 0,
 *               "last": 0,
 *               "sum": 0,
 *               "trend": null
 *           },
 *           "54f84ab21688f21600d74b48": {
 *               "name": null,
 *               "max": 0,
 *               "min": 0,
 *               "last": 0,
 *               "sum": 0,
 *               "trend": null
 *           }
 *       },
 *       "totalDemand": {
 *           "name": "Total",
 *           "max": 3.7954908952380952,
 *           "min": 0,
 *           "last": 0,
 *           "sum": 63.07230733431501,
 *           "trend": null
 *       },
 *       "realtime": false,
 *       "table": [
 *           {
 *               "date": "2015-08-05T00:00:00.000Z",
 *               "percent": 2.377688979436078,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.7697827777777784
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.7697827777777784
 *           },
 *           {
 *               "date": "2015-08-06T00:00:00.000Z",
 *               "percent": 2.375566251283366,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.766417230769231
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.766417230769231
 *           },
 *           {
 *               "date": "2015-08-07T00:00:00.000Z",
 *               "percent": 0,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 0
 *           },
 *           {
 *               "date": "2015-08-08T00:00:00.000Z",
 *               "percent": 0,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 0
 *           },
 *           {
 *               "date": "2015-08-09T00:00:00.000Z",
 *               "percent": 0,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 0
 *           },
 *           {
 *               "date": "2015-08-10T00:00:00.000Z",
 *               "percent": 2.3527295154153522,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.73021
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.73021
 *           },
 *           {
 *               "date": "2015-08-11T00:00:00.000Z",
 *               "percent": 0,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 0
 *           },
 *           {
 *               "date": "2015-08-12T00:00:00.000Z",
 *               "percent": 2.3511733495780307,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.727742727272727
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.727742727272727
 *           },
 *           {
 *               "date": "2015-08-13T00:00:00.000Z",
 *               "percent": 2.3538877817361943,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.7320464102564106
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.7320464102564106
 *           },
 *           {
 *               "date": "2015-08-14T00:00:00.000Z",
 *               "percent": 2.353236309928068,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.7310135135135134
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.7310135135135134
 *           },
 *           {
 *               "date": "2015-08-15T00:00:00.000Z",
 *               "percent": 0,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 0
 *           },
 *           {
 *               "date": "2015-08-16T00:00:00.000Z",
 *               "percent": 0,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 0
 *           },
 *           {
 *               "date": "2015-08-17T00:00:00.000Z",
 *               "percent": 0,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 0
 *           },
 *           {
 *               "date": "2015-08-18T00:00:00.000Z",
 *               "percent": 0,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 0
 *           },
 *           {
 *               "date": "2015-08-19T00:00:00.000Z",
 *               "percent": 2.349720966355505,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.72544
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.72544
 *           },
 *           {
 *               "date": "2015-08-20T00:00:00.000Z",
 *               "percent": 0,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 0
 *           },
 *           {
 *               "date": "2015-08-21T00:00:00.000Z",
 *               "percent": 2.3456853941818645,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.7190416734693876
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.7190416734693876
 *           },
 *           {
 *               "date": "2015-08-22T00:00:00.000Z",
 *               "percent": 0,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 0
 *           },
 *           {
 *               "date": "2015-08-23T00:00:00.000Z",
 *               "percent": 0,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 0
 *           },
 *           {
 *               "date": "2015-08-24T00:00:00.000Z",
 *               "percent": 2.329495913803409,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.693373545787546
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.693373545787546
 *           },
 *           {
 *               "date": "2015-08-25T00:00:00.000Z",
 *               "percent": 2.3939036822905155,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.7954908952380952
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.7954908952380952
 *           },
 *           {
 *               "date": "2015-08-26T00:00:00.000Z",
 *               "percent": 2.3253327573877334,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.68677293675384
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.68677293675384
 *           },
 *           {
 *               "date": "2015-08-27T00:00:00.000Z",
 *               "percent": 2.3252256634412563,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.6866031412429363
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.6866031412429363
 *           },
 *           {
 *               "date": "2015-08-28T00:00:00.000Z",
 *               "percent": 2.3225545332691953,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.6823681127733057
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.6823681127733057
 *           },
 *           {
 *               "date": "2015-08-29T00:00:00.000Z",
 *               "percent": 2.3184423351171284,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.6758482971428577
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.6758482971428577
 *           },
 *           {
 *               "date": "2015-08-30T00:00:00.000Z",
 *               "percent": 0,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 0
 *           },
 *           {
 *               "date": "2015-08-31T00:00:00.000Z",
 *               "percent": 2.30476813581642,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.654168102016607
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.654168102016607
 *           },
 *           {
 *               "date": "2015-09-01T00:00:00.000Z",
 *               "percent": 2.3011156245076614,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.6483771115437222
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.6483771115437222
 *           },
 *           {
 *               "date": "2015-09-02T00:00:00.000Z",
 *               "percent": 2.300632331195101,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 3.6476108587570613
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 3.6476108587570613
 *           },
 *           {
 *               "date": "2015-09-03T00:00:00.000Z",
 *               "percent": 0,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 0
 *           },
 *           {
 *               "date": "2015-09-04T00:00:00.000Z",
 *               "percent": 0,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0
 *                   },
 *                   "55dc94100bcf8e300089f32b": {
 *                       "name": "Brightergy 7th Floor",
 *                       "value": 0
 *                   },
 *                   "54f9e98cf0bbdb1600a73c97": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "5458a2acb0091419007e03df": {
 *                       "name": null,
 *                       "value": 0
 *                   },
 *                   "54f84ab21688f21600d74b48": {
 *                       "name": null,
 *                       "value": 0
 *                   }
 *               },
 *               "totalPerPeriod": 0
 *           }
 *       ],
 *       "dateRange": "month"
 *   }
 *}
 *
 * @apiError (all) success 0
 * @apiError (all) message Error code
 * @apiErrorExample Error example
 *{
 *   "success": 0,
 *   "message": "External service error"
 *}
 */

/**
 * @api {get} ems:energyconsumption Get Energy Consumption data
 * @apiGroup EMS Lite - Surface
 * @apiName Get Energy Consumption
 * @apiVersion 1.0.0
 * @apiDescription Get Energy Consumption
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example
 * {
 *    "success": 1,
 *    "message": {
 *        "monthConsumption": 483.37703032196015,
 *        "consumption": {
 *            "trend": "up",
 *            "value": 3.602291091954023
 *        },
 *        "table": [
 *            {
 *                "date": "2015-09-10T12:37:00.000Z",
 *                "percent": 100,
 *                "sources": {
 *                    "55521beaa25a0c541b38d907": {
 *                        "name": "Brightergy 6th Floor",
 *                        "value": 3.602291091954023
 *                    }
 *                },
 *                "totalPerPeriod": 3.602291091954023
 *            }
 *        ],
 *        "consumptionBySources": {
 *            "55521beaa25a0c541b38d907": {
 *                "name": "Brightergy 6th Floor",
 *                "prevValue": null,
 *                "value": 3.602291091954023,
 *                "trend": null
 *            },
 *            "55dc94100bcf8e300089f32b": {
 *                "name": "Brightergy 7th Floor",
 *                "prevValue": null,
 *                "value": 0,
 *                "trend": null
 *            }
 *        },
 *        "currentPower": 3.60229,
 *        "currentPowerBySources": {
 *            "55521beaa25a0c541b38d907": {
 *                "name": "Brightergy 6th Floor",
 *                "value": 3.60229
 *            },
 *            "55dc94100bcf8e300089f32b": {
 *                "name": "Brightergy 7th Floor",
 *                "value": 0
 *            }
 *        },
 *        "mainChart": {
 *            "categories": [
 *                "2015-09-10T12:37:00.000Z"
 *            ],
 *            "series": [
 *                {
 *                    "name": "Total Consumption",
 *                    "data": [
 *                        3.602291091954023
 *                    ]
 *                },
 *                {
 *                    "name": "Brightergy 6th Floor",
 *                    "sourceId": "55521beaa25a0c541b38d907",
 *                    "data": [
 *                        3.602291091954023
 *                    ]
 *                },
 *                {
 *                    "name": "Brightergy 7th Floor",
 *                    "sourceId": "55dc94100bcf8e300089f32b",
 *                    "data": [
 *                        0
 *                    ]
 *                }
 *            ]
 *        },
 *        "dateRange": "3-hours"
 *    }
 *}
 *
 * @apiError (all) success 0
 * @apiError (all) message Error code
 * @apiErrorExample Error example
 *{
 *   "success": 0,
 *   "message": "External service error"
 *}
 */

/**
 * @api {get} ems:realtimepower Get Real Time Power data
 * @apiGroup EMS Lite - Surface
 * @apiName Get Real Time Power data
 * @apiVersion 1.0.0
 * @apiDescription Get Real Time Power data
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example
 *{
 *   "success": 1,
 *   "message": {
 *       "currentPower": {
 *           "value": 0.744,
 *           "name": "Total Generation",
 *           "trend": "up"
 *       },
 *       "currentPowerBySources": {
 *           "561e5f2ca25a0c541b38d901": {
 *               "value": 0,
 *               "name": "6th Floor Test Env",
 *               "trend": "down"
 *           },
 *           "55521beaa25a0c541b38d907": {
 *               "value": 0.744,
 *               "name": "Brightergy 6th Floor",
 *               "trend": "up"
 *           },
 *           "55dc94100bcf8e300089f32b": {
 *               "value": 0,
 *               "name": "Brightergy 7th Floor",
 *               "trend": "down"
 *           }
 *       },
 *       "mainChart": {
 *           "categories": [
 *               "2015-11-25T13:06:00.000Z",
 *               "2015-11-25T13:07:00.000Z",
 *               "2015-11-25T13:08:00.000Z",
 *               "2015-11-25T13:09:00.000Z",
 *               "2015-11-25T13:10:00.000Z",
 *               "2015-11-25T13:11:00.000Z",
 *               "2015-11-25T13:12:00.000Z",
 *               "2015-11-25T13:13:00.000Z",
 *               "2015-11-25T13:14:00.000Z",
 *               "2015-11-25T13:15:00.000Z"
 *           ],
 *           "series": [
 *               {
 *                   "name": "Total Generation",
 *                   "data": [
 *                       0.24,
 *                       0.24,
 *                       0.24,
 *                       0.24,
 *                       0.239,
 *                       0.239,
 *                       0.23,
 *                       0.239,
 *                       0.239,
 *                       0.744
 *                   ]
 *               },
 *               {
 *                   "name": "6th Floor Test Env",
 *                   "sourceId": "561e5f2ca25a0c541b38d901",
 *                   "data": [
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0
 *                   ]
 *               },
 *               {
 *                   "name": "Brightergy 6th Floor",
 *                   "sourceId": "55521beaa25a0c541b38d907",
 *                   "data": [
 *                       0.24,
 *                       0.24,
 *                       0.24,
 *                       0.24,
 *                       0.239,
 *                       0.239,
 *                       0.23,
 *                       0.239,
 *                       0.239,
 *                       0.744
 *                   ]
 *               },
 *               {
 *                   "name": "Brightergy 7th Floor",
 *                   "sourceId": "55dc94100bcf8e300089f32b",
 *                   "data": [
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0,
 *                       0
 *                   ]
 *               }
 *           ]
 *       },
 *       "table": [
 *           {
 *               "date": "2015-11-25T13:06:00.000Z",
 *               "percent": 8.304498269896195,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0.24
 *                   }
 *               },
 *               "totalPerPeriod": 0.24
 *           },
 *           {
 *               "date": "2015-11-25T13:07:00.000Z",
 *               "percent": 8.304498269896195,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0.24
 *                   }
 *               },
 *               "totalPerPeriod": 0.24
 *           },
 *           {
 *               "date": "2015-11-25T13:08:00.000Z",
 *               "percent": 8.304498269896195,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0.24
 *                   }
 *               },
 *               "totalPerPeriod": 0.24
 *           },
 *           {
 *               "date": "2015-11-25T13:09:00.000Z",
 *               "percent": 8.304498269896195,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0.24
 *                   }
 *               },
 *               "totalPerPeriod": 0.24
 *           },
 *           {
 *               "date": "2015-11-25T13:10:00.000Z",
 *               "percent": 8.269896193771627,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0.239
 *                   }
 *               },
 *               "totalPerPeriod": 0.239
 *           },
 *           {
 *               "date": "2015-11-25T13:11:00.000Z",
 *               "percent": 8.269896193771627,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0.239
 *                   }
 *               },
 *               "totalPerPeriod": 0.239
 *           },
 *           {
 *               "date": "2015-11-25T13:12:00.000Z",
 *               "percent": 7.95847750865052,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0.23
 *                   }
 *               },
 *               "totalPerPeriod": 0.23
 *           },
 *           {
 *               "date": "2015-11-25T13:13:00.000Z",
 *               "percent": 8.269896193771627,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0.239
 *                   }
 *               },
 *               "totalPerPeriod": 0.239
 *           },
 *           {
 *               "date": "2015-11-25T13:14:00.000Z",
 *               "percent": 8.269896193771627,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0.239
 *                   }
 *               },
 *               "totalPerPeriod": 0.239
 *           },
 *           {
 *               "date": "2015-11-25T13:15:00.000Z",
 *               "percent": 25.7439446366782,
 *               "sources": {
 *                   "55521beaa25a0c541b38d907": {
 *                       "name": "Brightergy 6th Floor",
 *                       "value": 0.744
 *                   }
 *               },
 *               "totalPerPeriod": 0.744
 *           }
 *       ],
 *       "dateRange": "10-mins",
 *       "realTime": false
 *   }
 *}
 *
 * @apiError (all) success 0
 * @apiError (all) message Error code
 * @apiErrorExample Error example
 *{
 *   "success": 0,
 *   "message": "External service error"
 *}
 */

/**
 * @api {get} ems:sources Get Sources data
 * @apiGroup EMS Lite - Surface
 * @apiName Get Sources data
 * @apiVersion 1.0.0
 * @apiDescription Get Sources data
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example
 * {
 *     "success": 1,
 *     "message": {
 *         "55521beaa25a0c541b38d907": {
 *             "name": "Brightergy 6th Floor",
 *             "displayName": "Brightergy 6th Floor",
 *             "scopes": {
 *                 "55633fb725db5c501fd1afc5": {
 *                     "name": "GEM",
 *                     "displayName": "GEM",
 *                     "lastReportedValue": 6.902390000000001,
 *                     "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                     "maxValueHistorical": 670.35983,
 *                     "maxValueCurrentDay": 1.97803,
 *                     "minValueCurrentDay": 6.899100000000001,
 *                     "percent": 100,
 *                     "nodes": {
 *                         "5563401125db5c501fd1b080": {
 *                             "name": "Main Line - Phase C",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_32",
 *                             "displayName": "Main Line - Phase C",
 *                             "lastReportedValue": 0.36674,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 36.79453,
 *                             "maxValueCurrentDay": 0.36674,
 *                             "minValueCurrentDay": 0.36629,
 *                             "percent": 5,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1b07a": {
 *                             "name": "Main Line - Phase B",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_31",
 *                             "displayName": "Main Line - Phase B",
 *                             "lastReportedValue": 1.3291400000000002,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 1.3837300000000001,
 *                             "maxValueCurrentDay": 1.32917,
 *                             "minValueCurrentDay": 1.32902,
 *                             "percent": 19,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1b074": {
 *                             "name": "Main Line - Phase A",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_30",
 *                             "displayName": "Main Line - Phase A",
 *                             "lastReportedValue": 1.97803,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 2.22227,
 *                             "maxValueCurrentDay": 1.97803,
 *                             "minValueCurrentDay": 1.9772,
 *                             "percent": 29,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1b06e": {
 *                             "name": "Unknown Ch29",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_29",
 *                             "displayName": "Unknown Ch29",
 *                             "lastReportedValue": 0.32109,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 37.859230000000004,
 *                             "maxValueCurrentDay": 0.32127,
 *                             "minValueCurrentDay": 0.32108,
 *                             "percent": 5,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1b068": {
 *                             "name": "Condensor",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_28",
 *                             "displayName": "Condensor",
 *                             "lastReportedValue": 0.29362,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 37.52014,
 *                             "maxValueCurrentDay": 0.29378,
 *                             "minValueCurrentDay": 0.29362,
 *                             "percent": 4,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1b062": {
 *                             "name": "Condensor",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_27",
 *                             "displayName": "Condensor",
 *                             "lastReportedValue": 0.024460000000000003,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 1.02289,
 *                             "maxValueCurrentDay": 0.02447,
 *                             "minValueCurrentDay": 0.024460000000000003,
 *                             "percent": 0,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1b05c": {
 *                             "name": "Condensor",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_26",
 *                             "displayName": "Condensor",
 *                             "lastReportedValue": 0.15561000000000003,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 32.15583,
 *                             "maxValueCurrentDay": 0.15563999999999997,
 *                             "minValueCurrentDay": 0.1556,
 *                             "percent": 2,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1b056": {
 *                             "name": "Condensor",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_25",
 *                             "displayName": "Condensor",
 *                             "lastReportedValue": 0.08334,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 0.14579,
 *                             "maxValueCurrentDay": 0.08335,
 *                             "minValueCurrentDay": 0.08333,
 *                             "percent": 1,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1b050": {
 *                             "name": "Condensor",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_24",
 *                             "displayName": "Condensor",
 *                             "lastReportedValue": 0.12502,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 0.28042,
 *                             "maxValueCurrentDay": 0.12516,
 *                             "minValueCurrentDay": 0.12502,
 *                             "percent": 2,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1b04a": {
 *                             "name": "Condensor",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_23",
 *                             "displayName": "Condensor",
 *                             "lastReportedValue": 0.24918,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 0.49082,
 *                             "maxValueCurrentDay": 0.24919999999999998,
 *                             "minValueCurrentDay": 0.24915,
 *                             "percent": 4,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1b044": {
 *                             "name": "Unknown Ch22",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_22",
 *                             "displayName": "Unknown Ch22",
 *                             "lastReportedValue": 0.23002,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 0.45235000000000003,
 *                             "maxValueCurrentDay": 0.23004,
 *                             "minValueCurrentDay": 0.23,
 *                             "percent": 3,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1b03e": {
 *                             "name": "Printer/Copier",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_21",
 *                             "displayName": "Printer/Copier",
 *                             "lastReportedValue": 0.01693,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 0.03409,
 *                             "maxValueCurrentDay": 0.01693,
 *                             "minValueCurrentDay": 0.01693,
 *                             "percent": 0,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1b038": {
 *                             "name": "Receptical Kitchen Counter",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_20",
 *                             "displayName": "Receptical Kitchen Counter",
 *                             "lastReportedValue": 0.10490000000000001,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 0.20413,
 *                             "maxValueCurrentDay": 0.10491,
 *                             "minValueCurrentDay": 0.10487,
 *                             "percent": 2,
 *                             "trend": "up"
 *                         },
 *                         "5563401125db5c501fd1b032": {
 *                             "name": "Receptical Refrigerator",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_19",
 *                             "displayName": "Receptical Refrigerator",
 *                             "lastReportedValue": 0.07585,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 0.14373,
 *                             "maxValueCurrentDay": 0.07585,
 *                             "minValueCurrentDay": 0.07581,
 *                             "percent": 1,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1b02c": {
 *                             "name": "Receptical Kitchen Counter",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_18",
 *                             "displayName": "Receptical Kitchen Counter",
 *                             "lastReportedValue": 0.0001,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 103.33688000000001,
 *                             "maxValueCurrentDay": 0.0001,
 *                             "minValueCurrentDay": 0.0001,
 *                             "percent": 0,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1b026": {
 *                             "name": "Receptical West Col",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_17",
 *                             "displayName": "Receptical West Col",
 *                             "lastReportedValue": 0.00538,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 0.00868,
 *                             "maxValueCurrentDay": 0.00538,
 *                             "minValueCurrentDay": 0.00537,
 *                             "percent": 0,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1b020": {
 *                             "name": "Receptical East Col",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_16",
 *                             "displayName": "Receptical East Col",
 *                             "lastReportedValue": 0.07657,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 0.14787999999999998,
 *                             "maxValueCurrentDay": 0.07657,
 *                             "minValueCurrentDay": 0.07648,
 *                             "percent": 1,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1b01a": {
 *                             "name": "Receptical SE Office",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_15",
 *                             "displayName": "Receptical SE Office",
 *                             "lastReportedValue": 0.07578,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 0.14656,
 *                             "maxValueCurrentDay": 0.07578,
 *                             "minValueCurrentDay": 0.0757,
 *                             "percent": 1,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1b014": {
 *                             "name": "Receptical NE Office",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_14",
 *                             "displayName": "Receptical NE Office",
 *                             "lastReportedValue": 0.00175,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 103.33681,
 *                             "maxValueCurrentDay": 0.00175,
 *                             "minValueCurrentDay": 0.00175,
 *                             "percent": 0,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1b00e": {
 *                             "name": "Power Base North",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_13",
 *                             "displayName": "Power Base North",
 *                             "lastReportedValue": 0.06393,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 0.12561,
 *                             "maxValueCurrentDay": 0.06393,
 *                             "minValueCurrentDay": 0.06387,
 *                             "percent": 1,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1b008": {
 *                             "name": "Water Heater",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_12",
 *                             "displayName": "Water Heater",
 *                             "lastReportedValue": 0.0334,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 0.06493,
 *                             "maxValueCurrentDay": 0.033409999999999995,
 *                             "minValueCurrentDay": 0.03338,
 *                             "percent": 0,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1b002": {
 *                             "name": "Water Heater",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_11",
 *                             "displayName": "Water Heater",
 *                             "lastReportedValue": 0.00011,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 103.33025,
 *                             "maxValueCurrentDay": 0.00011,
 *                             "minValueCurrentDay": 0.00011,
 *                             "percent": 0,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1affc": {
 *                             "name": "Unknown Ch10",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_10",
 *                             "displayName": "Unknown Ch10",
 *                             "lastReportedValue": 0.12695,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 0.25749,
 *                             "maxValueCurrentDay": 0.12695,
 *                             "minValueCurrentDay": 0.1268,
 *                             "percent": 2,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1aff6": {
 *                             "name": "IT Outlets",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_9",
 *                             "displayName": "IT Outlets",
 *                             "lastReportedValue": 0.00015,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 103.33873,
 *                             "maxValueCurrentDay": 0.00015,
 *                             "minValueCurrentDay": 0.00015,
 *                             "percent": 0,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1aff0": {
 *                             "name": "IT Outlets",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_8",
 *                             "displayName": "IT Outlets",
 *                             "lastReportedValue": 0.00001,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 103.33873,
 *                             "maxValueCurrentDay": 0.00001,
 *                             "minValueCurrentDay": 0.00001,
 *                             "percent": 0,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1afea": {
 *                             "name": "Lighting East",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_7",
 *                             "displayName": "Lighting East",
 *                             "lastReportedValue": 0.24331,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 0.47529000000000005,
 *                             "maxValueCurrentDay": 0.24331,
 *                             "minValueCurrentDay": 0.2429,
 *                             "percent": 4,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1afe4": {
 *                             "name": "Lighting Center East",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_6",
 *                             "displayName": "Lighting Center East",
 *                             "lastReportedValue": 0.17479,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 0.34169,
 *                             "maxValueCurrentDay": 0.17479,
 *                             "minValueCurrentDay": 0.17451,
 *                             "percent": 3,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1afde": {
 *                             "name": "Lighting Center West",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_5",
 *                             "displayName": "Lighting Center West",
 *                             "lastReportedValue": 0.13972,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 0.26937,
 *                             "maxValueCurrentDay": 0.13972,
 *                             "minValueCurrentDay": 0.13953,
 *                             "percent": 2,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1afd8": {
 *                             "name": "Lighting West",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_4",
 *                             "displayName": "Lighting West",
 *                             "lastReportedValue": 0.41693,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 0.76051,
 *                             "maxValueCurrentDay": 0.41693,
 *                             "minValueCurrentDay": 0.41656,
 *                             "percent": 6,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1afd2": {
 *                             "name": "Receptical Conference",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_3",
 *                             "displayName": "Receptical Conference",
 *                             "lastReportedValue": 0.04683,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 0.09481,
 *                             "maxValueCurrentDay": 0.04685,
 *                             "minValueCurrentDay": 0.04683,
 *                             "percent": 1,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1afcc": {
 *                             "name": "Power Base NE",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_2",
 *                             "displayName": "Power Base NE",
 *                             "lastReportedValue": 0.07364,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 0.13943,
 *                             "maxValueCurrentDay": 0.07364,
 *                             "minValueCurrentDay": 0.07361,
 *                             "percent": 1,
 *                             "trend": null
 *                         },
 *                         "5563401125db5c501fd1afc6": {
 *                             "name": "Power Base NW",
 *                             "nodeId": "00:13:a2:00:40:30:e8:33_1",
 *                             "displayName": "Power Base NW",
 *                             "lastReportedValue": 0.06911,
 *                             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *                             "maxValueHistorical": 0.13623,
 *                             "maxValueCurrentDay": 0.06911,
 *                             "minValueCurrentDay": 0.06906,
 *                             "percent": 1,
 *                             "trend": null
 *                         }
 *                     },
 *                     "trend": "up"
 *                 },
 *                 "55521cf9a25a0c541b38d908": {
 *                     "name": "Digi Gateway",
 *                     "displayName": "Digi Gateway",
 *                     "lastReportedValue": 0.019164999999999998,
 *                     "lastReportedTime": "2015-08-28T16:40:27.222Z",
 *                     "maxValueHistorical": 0.0265,
 *                     "maxValueCurrentDay": 0.019164999999999998,
 *                     "minValueCurrentDay": 0.019164999999999998,
 *                     "percent": 0,
 *                     "nodes": {
 *                         "55521d53a25a0c541b38d909": {
 *                             "name": "Pearl Thermostat",
 *                             "nodeId": "00:0d:6f:00:02:f7:46:86",
 *                             "displayName": "Pearl Thermostat",
 *                             "lastReportedValue": 0.019164999999999998,
 *                             "lastReportedTime": "2015-08-28T16:40:27.222Z",
 *                             "maxValueHistorical": 0.0265,
 *                             "maxValueCurrentDay": 0.019164999999999998,
 *                             "minValueCurrentDay": 0.019164999999999998,
 *                             "percent": 100,
 *                             "trend": null
 *                         }
 *                     },
 *                     "trend": null
 *                 }
 *             },
 *             "lastReportedValue": 6.9215550000000015,
 *             "lastReportedTime": "2015-08-28T16:45:56.673Z",
 *             "maxValueHistorical": 670.38633,
 *             "maxValueCurrentDay": 1.97803,
 *             "minValueCurrentDay": 6.918265000000001,
 *             "percent": 100,
 *             "trend": "up",
 *             "billingInterval": 30
 *         },
 *         "55521beaa25a0c541b38d909": {
 *             "name": "Brightergy 7th Floor",
 *             "displayName": "Brightergy 7th Floor",
 *             "scopes": {
 *                 "55521cf9a25a0c541b38d909": {
 *                     "name": "Digi Gateway 2",
 *                     "displayName": "Digi Gateway 2",
 *                     "lastReportedValue": 0,
 *                     "lastReportedTime": "2015-08-26T21:00:32.479Z",
 *                     "maxValueHistorical": 0.026,
 *                     "maxValueCurrentDay": 0,
 *                     "minValueCurrentDay": 0,
 *                     "percent": 0,
 *                     "nodes": {
 *                         "55521d53a25a0c541b38d90a": {
 *                             "name": "Pearl Thermostat",
 *                             "nodeId": "00:0d:6f:00:03:04:30:a1",
 *                             "displayName": "Pearl Thermostat",
 *                             "lastReportedValue": 0,
 *                             "lastReportedTime": "2015-08-26T21:00:32.479Z",
 *                             "maxValueHistorical": 0.026,
 *                             "maxValueCurrentDay": 0,
 *                             "minValueCurrentDay": 0,
 *                             "percent": 0,
 *                             "trend": null
 *                         }
 *                     },
 *                     "trend": null
 *                 }
 *             },
 *             "lastReportedValue": 0,
 *             "lastReportedTime": "2015-08-26T21:00:32.479Z",
 *             "maxValueHistorical": 0.026,
 *             "maxValueCurrentDay": 0,
 *             "minValueCurrentDay": 0,
 *             "percent": 0,
 *             "trend": null,
 *             "billingInterval": 30
 *         }
 *     }
 * }
 *
 * @apiError (all) success 0
 * @apiError (all) message Error code
 * @apiErrorExample Error example
 *{
 *   "success": 0,
 *   "message": "External service error"
 *}
 */

/**
 * @api {get} ems:thermostat Get Thermostat data
 * @apiGroup EMS Lite - Surface
 * @apiName Get Thermostat data
 * @apiVersion 1.0.0
 * @apiDescription Get Thermostat data
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example
 * {
 *    "success": 1,
 *    "message": {
 *        "ts": "2015-08-28T16:33:58.451Z",
 *        "device": "00:0d:6f:00:02:f7:46:86",
 *        "type": "PearlThermostat",
 *        "values": {
 *            "local_temperature": "22.75",
 *            "system_mode": "Cool",
 *            "heat_setpoint": "18.46",
 *            "cool_setpoint": "23.465"
 *        }
 *    }
 *}
 *
 * @apiError (all) success 0
 * @apiError (all) message Error code
 * @apiErrorExample Error example
 *{
 *   "success": 0,
 *   "message": "External service error"
 *}
 */

/**
 * @api {get} ems:export Get Exported data
 * @apiGroup EMS Lite - Surface
 * @apiName Get Exported data
 * @apiVersion 1.0.0
 * @apiDescription Get Exported data
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example
 *{
 *    "success": 1,
 *    "message": "http://localhost:3000/exported/5416f4a4aa6409d01d0c91dc_1439810060.pdf"
 *}
 *
 * @apiError (all) success 0
 * @apiError (all) message Error code
 * @apiErrorExample Error example
 *{
 *   "success": 0,
 *   "message": "External service error"
 *}
 */

/**
 * @api {get} ems:getrealtimepower Request Real Time Power data
 * @apiGroup EMS Lite - Surface
 * @apiName Request Real Time Power data
 * @apiVersion 1.0.0
 * @apiDescription Request Real Time Power data <br/>
 * Allowed dateRange is "10-mins", "3-hours", "24-hours", "week", "month", "year"  <br/>
 * @apiParam {Object} body Request data
 * @apiExample Example request
 *{
 *    "socketId": "HLGSaxqhhgZeZvDCAAAA",
 *    "dateRange": "year",
 *}
 *
 */

/**
 * @api {get} ems:getenergyconsumption Request Energy Consumption data
 * @apiGroup EMS Lite - Surface
 * @apiName Request Energy Consumption data
 * @apiVersion 1.0.0
 * @apiDescription Request Energy Consumption data <br/>
 * Allowed dateRange is "3-hours", "24-hours", "week", "month", "year"  <br/>
 * @apiParam {Object} body Request data
 * @apiExample Example request
 *{
 *    "socketId": "HLGSaxqhhgZeZvDCAAAA",
 *    "dateRange": "year",
 *}
 *
 */

/**
 * @api {get} ems:getelectricdemand Request Electric Demand data
 * @apiGroup EMS Lite - Surface
 * @apiName Request Electric Demand data
 * @apiVersion 1.0.0
 * @apiDescription Request Electric Demand data <br/>
 * Allowed dateRange is "3-hours", "24-hours", "week", "month", "year"  <br/>
 * @apiParam {Object} body Request data
 * @apiExample Example request
 *{
 *    "socketId": "HLGSaxqhhgZeZvDCAAAA",
 *    "dateRange": "year",
 *}
 *
 */

/**
 * @api {get} ems:getpeakdemand Request Peak Demand data
 * @apiGroup EMS Lite - Surface
 * @apiName Request Peak Demand data
 * @apiVersion 1.0.0
 * @apiDescription Request Peak Demand data <br/>
 * Allowed dateRange is "3-hours", "24-hours", "week", "month", "year"  <br/>
 * @apiParam {Object} body Request data
 * @apiExample Example request
 *{
 *    "socketId": "HLGSaxqhhgZeZvDCAAAA",
 *    "dateRange": "year",
 *}
 *
 */

/**
 * @api {get} ems:getpeakdemanddrilldown Request Peak Demand Drilldown data
 * @apiGroup EMS Lite - Surface
 * @apiName Request Peak Demand Drilldown data
 * @apiVersion 1.0.0
 * @apiDescription Request Peak Demand Drilldown data <br/>
 * Allowed dateRange is "3-hours", "24-hours", "week", "month", "year"  <br/>
 * @apiParam {Object} body Request data
 * @apiExample Example request
 *{
 *    "socketId": "HLGSaxqhhgZeZvDCAAAA",
 *    "dateRange": "year",
 *}
 *
 */

/**
 * @api {get} ems:selectedsources Request using selected sources
 * @apiGroup EMS Lite - Surface
 * @apiName Request using selected sources
 * @apiVersion 1.0.0
 * @apiDescription Request using selected sources <br/>
 * Server will start loading data for all elements. if "reloadElements" is true
 * @apiParam {Object} body Request data
 * @apiExample Example request
 *{
 *   "socketId": "HLGSaxqhhgZeZvDCAAAA",
 *   "selectedFacilities": [
 *       "549012531e94a8881e6e8e54"
 *   ],
 *   "selectedScopes": [],
 *   "selectedNodes": [],
 *   "selectedThermostats": []
 *   "reloadElements": true
 *}
 *
 */

/**
 * @api {get} ems:viewertzoffset Request using client offset for converting time
 * @apiGroup EMS Lite - Surface
 * @apiName Request using client offset for converting time
 * @apiVersion 1.0.0
 * @apiDescription Request using client offset for converting time
 * @apiParam {Object} body Request data
 * @apiExample Example request
 *{
 *   "socketId": "HLGSaxqhhgZeZvDCAAAA",
 *   "viewerTZOffset": -300
 *}
 *
 */

/**
 * @api {get} ems:getexport Request export data
 * @apiGroup EMS Lite - Surface
 * @apiName Request export data
 * @apiVersion 1.0.0
 * @apiDescription Request export data
 * @apiParam {Object} body Request data
 * @apiExample Example request
 *{
 *    "socketId": "HLGSaxqhhgZeZvDCAAAA",
 *    "format": "pdf",
 *    "table": [
 *        {
 *            "date": "2015-08-28T13:37:00.000Z",
 *            "percent": 2.9563992286154597,
 *            "sources": {
 *                "55521beaa25a0c541b38d907": {
 *                    "name": "Brightergy 6th Floor",
 *                    "value": 7.168585887096776
 *                }
 *            },
 *            "totalPerPeriod": 7.168585887096776
 *        }
 *    ]
 *}
 *
 */


/**
 * @api {get} ems:heatmap Get Heat Map data
 * @apiGroup EMS Lite - Surface
 * @apiName Get Heat Map data
 * @apiVersion 1.0.0
 * @apiDescription Get Heat Map data
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example for week range
 * {
 *   "success": 1,
 *   "message": {
 *      "dateRange": "week",
 *      "rangeStart": "2016-01-15T00:00:000Z",
 *      "rangeEnd": "2016-01-16T00:00:000Z" 
 *      "points": [
 *         [
 *            0.8262208333333331,
 *            1.0759655555555552,
 *            0.6958638888888894,
 *            0.6593225000000001,
 *            2.554256944444444,
 *            2.426660833333333,
 *            1.0192963888888886,
 *            0.5068619444444443,
 *            1.1439575,
 *            0.8994352777777777,
 *            0.5045372222222222,
 *            0.8232674999999999,
 *            1.1558405555555555,
 *            0.5223838888888886,
 *            0.9220816666666669,
 *            0.9628558333333338,
 *            0.5557886111111112,
 *            1.466427777777777,
 *            0.8007799999999992,
 *            0.6331072222222223,
 *            1.1224177777777782,
 *            0.5414938888888887,
 *            0.9948733333333334,
 *            1.367639722222223
 *         ],
 *         [ the same data for the rest six days ]
 *      ]
 *   }
 *}
 *
 */

 /**
 * @api {get} ems:getheatmap Request Heat Map data
 * @apiGroup EMS Lite - Surface
 * @apiName Request Heat Map
 * @apiVersion 1.0.0
 * @apiDescription Request Heat Map data <br/>
 * Allowed dateRange are "week", "month", "6-months" <br/>
 * @apiParam {Object} body Request data
 * @apiExample Example request
 *{
 *    "socketId": "HLGSaxqhhgZeZvDCAAAA",
 *    "dateRange": "month",
 *}
 *
 */