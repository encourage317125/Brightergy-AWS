
 /**
 * @api {get} assurf:power Get Power data
 * @apiGroup Analyze Solar Surface
 * @apiName Get Power data
 * @apiVersion 1.0.0
 * @apiDescription Get Power data
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example
 *{
 *   "success": 1,
 *   "message": {
 *       "currentPower": 26.673719529000003,
 *       "currentDayPower": 1.0917740146180548,
 *       "minPower": 0,
 *       "maxPower": 26.901972673000003,
 *       "selectedFacilities": [],
 *       "selectedScopes": []
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
 * @api {get} assurf:energy Get Energy data
 * @apiGroup Analyze Solar Surface
 * @apiName Get Energy data
 * @apiVersion 1.0.0
 * @apiDescription Get Energy data
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example
 *{
 *   "success": 1,
 *   "message": {
 *       "energyToday": 40.39403206749999,
 *       "utilitySavingToday": 4.03940320675,
 *       "utilitySavingMonth": 634.1013325863345,
 *       "minEnergy": 40.3940320675,
 *       "maxEnergy": 441.32489907666667
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
 *
 */

 /**
 * @api {get} assurf:weather Get Weather data
 * @apiGroup Analyze Solar Surface
 * @apiName Get Weather data
 * @apiVersion 1.0.0
 * @apiDescription Get Weather data
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example
 * {
 *    "success": 1,
 *    "message": {
 *        "current": {
 *            "time": 1440777212,
 *            "summary": "Mostly Cloudy",
 *            "icon": "partly-cloudy-day",
 *            "nearestStormDistance": 58,
 *            "nearestStormBearing": 336,
 *            "precipIntensity": 0,
 *            "precipProbability": 0,
 *            "temperature": 75.76,
 *            "apparentTemperature": 75.76,
 *            "dewPoint": 60.5,
 *            "humidity": 0.59,
 *            "windSpeed": 10.03,
 *            "windBearing": 154,
 *            "visibility": 10,
 *            "cloudCover": 0.87,
 *            "pressure": 1019.05,
 *            "ozone": 296.48,
 *            "sunriseTime": 1440761333,
 *            "sunsetTime": 1440808829,
 *            "longitude": -90.472394,
 *            "latitude": 38.576286,
 *            "city": "Manchester",
 *            "sunriseDate": "2015-08-28T11:28:53.000Z",
 *            "sunsetDate": "2015-08-29T00:40:29.000Z",
 *            "date": "2015-08-28T15:53:32.000Z"
 *        },
 *        "forecast": [
 *            {
 *                "time": 1440738000,
 *                "icon": "partly-cloudy-day",
 *                "temperatureMax": 82.1,
 *                "temperatureMin": 59.47,
 *                "sunriseTime": 1440761333,
 *                "sunsetTime": 1440808829,
 *                "humidity": 0.68,
 *                "pressure": 1017.59,
 *                "windSpeed": 6.37,
 *                "windBearing": 144,
 *                "date": "2015-08-28T05:00:00.000Z",
 *                "sunriseDate": "2015-08-28T11:28:53.000Z",
 *                "sunsetDate": "2015-08-29T00:40:29.000Z"
 *            },
 *            {
 *                "time": 1440824400,
 *                "icon": "rain",
 *                "temperatureMax": 86.99,
 *                "temperatureMin": 67.7,
 *                "sunriseTime": 1440847787,
 *                "sunsetTime": 1440895141,
 *                "humidity": 0.68,
 *                "pressure": 1015.85,
 *                "windSpeed": 6,
 *                "windBearing": 175,
 *                "date": "2015-08-29T05:00:00.000Z",
 *                "sunriseDate": "2015-08-29T11:29:47.000Z",
 *                "sunsetDate": "2015-08-30T00:39:01.000Z"
 *            },
 *            {
 *                "time": 1440910800,
 *                "icon": "rain",
 *                "temperatureMax": 86.05,
 *                "temperatureMin": 69.16,
 *                "sunriseTime": 1440934240,
 *                "sunsetTime": 1440981451,
 *                "humidity": 0.76,
 *                "pressure": 1015.86,
 *                "windSpeed": 2.52,
 *                "windBearing": 165,
 *                "date": "2015-08-30T05:00:00.000Z",
 *                "sunriseDate": "2015-08-30T11:30:40.000Z",
 *                "sunsetDate": "2015-08-31T00:37:31.000Z"
 *            },
 *            {
 *                "time": 1440997200,
 *                "icon": "rain",
 *                "temperatureMax": 87.92,
 *                "temperatureMin": 69.22,
 *                "sunriseTime": 1441020692,
 *                "sunsetTime": 1441067762,
 *                "humidity": 0.71,
 *                "pressure": 1015.6,
 *                "windSpeed": 5.35,
 *                "windBearing": 147,
 *                "date": "2015-08-31T05:00:00.000Z",
 *                "sunriseDate": "2015-08-31T11:31:32.000Z",
 *                "sunsetDate": "2015-09-01T00:36:02.000Z"
 *            },
 *            {
 *                "time": 1441083600,
 *                "icon": "partly-cloudy-day",
 *                "temperatureMax": 86.29,
 *                "temperatureMin": 68.94,
 *                "sunriseTime": 1441107145,
 *                "sunsetTime": 1441154071,
 *                "humidity": 0.6,
 *                "pressure": 1017.29,
 *                "windSpeed": 6.21,
 *                "windBearing": 169,
 *                "date": "2015-09-01T05:00:00.000Z",
 *                "sunriseDate": "2015-09-01T11:32:25.000Z",
 *                "sunsetDate": "2015-09-02T00:34:31.000Z"
 *            },
 *            {
 *                "time": 1441170000,
 *                "icon": "partly-cloudy-day",
 *                "temperatureMax": 87.18,
 *                "temperatureMin": 74.07,
 *                "sunriseTime": 1441193598,
 *                "sunsetTime": 1441240380,
 *                "humidity": 0.56,
 *                "pressure": 1016.34,
 *                "windSpeed": 4.05,
 *                "windBearing": 159,
 *                "date": "2015-09-02T05:00:00.000Z",
 *                "sunriseDate": "2015-09-02T11:33:18.000Z",
 *                "sunsetDate": "2015-09-03T00:33:00.000Z"
 *            },
 *            {
 *                "time": 1441256400,
 *                "icon": "partly-cloudy-day",
 *                "temperatureMax": 85.23,
 *                "temperatureMin": 72.23,
 *                "sunriseTime": 1441280050,
 *                "sunsetTime": 1441326688,
 *                "humidity": 0.56,
 *                "pressure": 1014.84,
 *                "windSpeed": 5.12,
 *                "windBearing": 115,
 *                "date": "2015-09-03T05:00:00.000Z",
 *                "sunriseDate": "2015-09-03T11:34:10.000Z",
 *                "sunsetDate": "2015-09-04T00:31:28.000Z"
 *            },
 *            {
 *                "time": 1441342800,
 *                "icon": "partly-cloudy-day",
 *                "temperatureMax": 86.49,
 *                "temperatureMin": 68.46,
 *                "sunriseTime": 1441366503,
 *                "sunsetTime": 1441412996,
 *                "humidity": 0.59,
 *                "pressure": 1014.2,
 *                "windSpeed": 5.45,
 *                "windBearing": 93,
 *                "date": "2015-09-04T05:00:00.000Z",
 *                "sunriseDate": "2015-09-04T11:35:03.000Z",
 *                "sunsetDate": "2015-09-05T00:29:56.000Z"
 *            }
 *        ],
 *        "history": [
 *            {
 *                "time": 1440738000,
 *                "icon": "partly-cloudy-day",
 *                "temperatureMax": 82.13,
 *                "temperatureMin": 59.53,
 *                "sunriseTime": 1440761333,
 *                "sunsetTime": 1440808829,
 *                "humidity": 0.68,
 *                "pressure": 1017.57,
 *                "windSpeed": 6.23,
 *                "windBearing": 144,
 *                "date": "2015-08-28T05:00:00.000Z",
 *                "sunriseDate": "2015-08-28T11:28:53.000Z",
 *                "sunsetDate": "2015-08-29T00:40:29.000Z"
 *            },
 *            {
 *                "time": 1440651600,
 *                "icon": "partly-cloudy-day",
 *                "temperatureMax": 78.81,
 *                "temperatureMin": 57.31,
 *                "sunriseTime": 1440674880,
 *                "sunsetTime": 1440722517,
 *                "humidity": 0.74,
 *                "pressure": 1019.76,
 *                "windSpeed": 1.57,
 *                "windBearing": 101,
 *                "date": "2015-08-27T05:00:00.000Z",
 *                "sunriseDate": "2015-08-27T11:28:00.000Z",
 *                "sunsetDate": "2015-08-28T00:41:57.000Z"
 *            },
 *            {
 *                "time": 1440565200,
 *                "icon": "clear-day",
 *                "temperatureMax": 78.05,
 *                "temperatureMin": 55.1,
 *                "sunriseTime": 1440588427,
 *                "sunsetTime": 1440636204,
 *                "humidity": 0.71,
 *                "pressure": 1019.93,
 *                "windSpeed": 2.77,
 *                "windBearing": 345,
 *                "date": "2015-08-26T05:00:00.000Z",
 *                "sunriseDate": "2015-08-26T11:27:07.000Z",
 *                "sunsetDate": "2015-08-27T00:43:24.000Z"
 *            },
 *            {
 *                "time": 1440478800,
 *                "icon": "clear-day",
 *                "temperatureMax": 77.9,
 *                "temperatureMin": 54.53,
 *                "sunriseTime": 1440501974,
 *                "sunsetTime": 1440549891,
 *                "humidity": 0.64,
 *                "pressure": 1018.73,
 *                "windSpeed": 5.18,
 *                "windBearing": 299,
 *                "date": "2015-08-25T05:00:00.000Z",
 *                "sunriseDate": "2015-08-25T11:26:14.000Z",
 *                "sunsetDate": "2015-08-26T00:44:51.000Z"
 *            },
 *            {
 *                "time": 1440392400,
 *                "icon": "clear-day",
 *                "temperatureMax": 77.7,
 *                "temperatureMin": 55.95,
 *                "sunriseTime": 1440415520,
 *                "sunsetTime": 1440463576,
 *                "humidity": 0.62,
 *                "pressure": 1018.26,
 *                "windSpeed": 6.41,
 *                "windBearing": 293,
 *                "date": "2015-08-24T05:00:00.000Z",
 *                "sunriseDate": "2015-08-24T11:25:20.000Z",
 *                "sunsetDate": "2015-08-25T00:46:16.000Z"
 *            },
 *            {
 *                "time": 1440306000,
 *                "icon": "partly-cloudy-day",
 *                "temperatureMax": 78.15,
 *                "temperatureMin": 64.62,
 *                "sunriseTime": 1440329066,
 *                "sunsetTime": 1440377261,
 *                "humidity": 0.78,
 *                "pressure": 1014.78,
 *                "windSpeed": 4.23,
 *                "windBearing": 281,
 *                "date": "2015-08-23T05:00:00.000Z",
 *                "sunriseDate": "2015-08-23T11:24:26.000Z",
 *                "sunsetDate": "2015-08-24T00:47:41.000Z"
 *            },
 *            {
 *                "time": 1440219600,
 *                "icon": "rain",
 *                "temperatureMax": 78.65,
 *                "temperatureMin": 63.63,
 *                "sunriseTime": 1440242613,
 *                "sunsetTime": 1440290945,
 *                "humidity": 0.82,
 *                "pressure": 1015.78,
 *                "windSpeed": 5.66,
 *                "windBearing": 136,
 *                "date": "2015-08-22T05:00:00.000Z",
 *                "sunriseDate": "2015-08-22T11:23:33.000Z",
 *                "sunsetDate": "2015-08-23T00:49:05.000Z"
 *            }
 *        ]
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
 *
 */

 /**
 * @api {get} assurf:yieldcomparator Get Yield Comparator data
 * @apiGroup Analyze Solar Surface
 * @apiName Get Yield Comparator data
 * @apiVersion 1.0.0
 * @apiDescription Get Yield Comparator data
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example
 * {
 *    "success": 1,
 *    "message": {
 *        "category": [
 *            "2015-01-01T05:00:00.000Z",
 *            "2015-02-01T05:00:00.000Z",
 *            "2015-03-01T05:00:00.000Z",
 *            "2015-04-01T05:00:00.000Z",
 *            "2015-05-01T05:00:00.000Z",
 *            "2015-06-01T05:00:00.000Z",
 *            "2015-07-01T05:00:00.000Z",
 *            "2015-08-01T05:00:00.000Z",
 *            "2015-09-01T05:00:00.000Z",
 *            "2015-10-01T05:00:00.000Z",
 *            "2015-11-01T05:00:00.000Z",
 *            "2015-12-01T05:00:00.000Z"
 *        ],
 *        "series": [
 *            {
 *                "name": "current",
 *                "data": [
 *                    9029.623664784938,
 *                    8722.018063157038,
 *                    15645.797503601914,
 *                    16547.98676862521,
 *                    16485.455839375183,
 *                    17317.595061206343,
 *                    18414.837321175088,
 *                    17938.552997499843,
 *                    4098.720918595419,
 *                    0,
 *                    0,
 *                    0
 *                ]
 *            },
 *            {
 *                "name": "currentCost",
 *                "data": [
 *                    3485.623279996653,
 *                    3337.1895548456805,
 *                    6121.710640445121,
 *                    6299.766938968103,
 *                    6121.774280982725,
 *                    6606.775926853927,
 *                    7005.769408354676,
 *                    6931.1788770679705,
 *                    1590.884694258727,
 *                    0,
 *                    0,
 *                    0
 *                ]
 *            },
 *            {
 *                "name": "previous",
 *                "data": [
 *                    0,
 *                    968.0436173815833,
 *                    3131.202171603248,
 *                    3505.2493032422517,
 *                    4003.898272328382,
 *                    3798.145667004833,
 *                    4331.540810410749,
 *                    3554.5803995112474,
 *                    3239.7169273360837,
 *                    2488.3518757688316,
 *                    1608.6068882030827,
 *                    1040.303305361917
 *                ]
 *            },
 *            {
 *                "name": "previousCost",
 *                "data": [
 *                    0,
 *                    95.63884245304999,
 *                    311.8886238249749,
 *                    349.14685560087537,
 *                    424.151331526959,
 *                    381.4730641555978,
 *                    5509.051917605517,
 *                    8223.030843149201,
 *                    4578.520046973445,
 *                    4855.437860311756,
 *                    3447.0700564976178,
 *                    1826.0569116012405
 *                ]
 *            },
 *            {
 *                "name": "mean",
 *                "data": [
 *                    9029.623664784938,
 *                    4845.030840269311,
 *                    9388.499837602581,
 *                    10026.61803593373,
 *                    10275.710444740671,
 *                    10559.608262085385,
 *                    17023.84114319191,
 *                    19437.455813188084,
 *                    8337.814860014814,
 *                    12716.489708597117,
 *                    8881.49994126946,
 *                    4854.161713045901
 *                ]
 *            },
 *            {
 *                "name": "infoLabel",
 *                "data": [
 *                    0,
 *                    968.0436173815833,
 *                    4099.245788984832,
 *                    7604.495092227084,
 *                    11670.460142333242,
 *                    15472.081605297672,
 *                    31104.926570506395,
 *                    52041.28519938272,
 *                    64618.19400081693,
 *                    77334.68370941405,
 *                    86216.18365068351,
 *                    91070.34536372942
 *                ]
 *            }
 *        ]
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
 *
 */

 /**
 * @api {get} assurf:table Get Table data
 * @apiGroup Analyze Solar Surface
 * @apiName Get Table data
 * @apiVersion 1.0.0
 * @apiDescription Get Table data
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example
 * {
 *    "success": 1,
 *    "message": {
 *        "table": [
 *            {
 *                "date": "2014-08-28T20:00:00.000Z",
 *                "percent": 4.409859693313887,
 *                "sources": {
 *                    "5458afc6fe540a120074c20f": {
 *                        "name": "Barretts Elementary School",
 *                        "savings": 334.7522714296832,
 *                        "kwh": 3347.5227142968315
 *                    }
 *                },
 *                "totalPerPeriod": 3347.5227142968315
 *            },
 *            {
 *                "date": "2014-09-28T20:00:00.000Z",
 *                "percent": 3.2659346624035077,
 *                "sources": {
 *                    "5458afc6fe540a120074c20f": {
 *                        "name": "Barretts Elementary School",
 *                        "savings": 247.9169684781832,
 *                        "kwh": 2479.169684781832
 *                    }
 *                },
 *                "totalPerPeriod": 2479.169684781832
 *            },
 *            {
 *                "date": "2014-10-28T20:00:00.000Z",
 *                "percent": 2.315149252562645,
 *                "sources": {
 *                    "5458afc6fe540a120074c20f": {
 *                        "name": "Barretts Elementary School",
 *                        "savings": 175.74288637099164,
 *                        "kwh": 1757.4288637099164
 *                    }
 *                },
 *                "totalPerPeriod": 1757.4288637099164
 *            },
 *            {
 *                "date": "2014-11-28T20:00:00.000Z",
 *                "percent": 1.2354915527374715,
 *                "sources": {
 *                    "5458afc6fe540a120074c20f": {
 *                        "name": "Barretts Elementary School",
 *                        "savings": 93.78611392968337,
 *                        "kwh": 937.8611392968335
 *                    }
 *                },
 *                "totalPerPeriod": 937.8611392968335
 *            },
 *            {
 *                "date": "2014-12-28T20:00:00.000Z",
 *                "percent": 3.825378680280625,
 *                "sources": {
 *                    "5458afc6fe540a120074c20f": {
 *                        "name": "Barretts Elementary School",
 *                        "savings": 183.0210018534583,
 *                        "kwh": 1830.210018534583
 *                    },
 *                    "556f15a24a14b2180aa325e0": {
 *                        "name": "Facility-c8fd6c51",
 *                        "savings": 70.37160053469168,
 *                        "kwh": 703.7160053469167
 *                    },
 *                    "556f159c4a14b2180aa315f1": {
 *                        "name": "Facility-7a79273a",
 *                        "savings": 36.991738919616665,
 *                        "kwh": 369.91738919616665
 *                    }
 *                },
 *                "totalPerPeriod": 2903.8434130776664
 *            },
 *            {
 *                "date": "2015-01-28T20:00:00.000Z",
 *                "percent": 6.934682297427948,
 *                "sources": {
 *                    "5458afc6fe540a120074c20f": {
 *                        "name": "Barretts Elementary School",
 *                        "savings": 184.55805526489996,
 *                        "kwh": 1845.5805526489994
 *                    },
 *                    "556f15a24a14b2180aa325e0": {
 *                        "name": "Facility-c8fd6c51",
 *                        "savings": 177.38245660048327,
 *                        "kwh": 1773.8245660048326
 *                    },
 *                    "556f159c4a14b2180aa315f1": {
 *                        "name": "Facility-7a79273a",
 *                        "savings": 164.47094159352505,
 *                        "kwh": 1644.7094159352503
 *                    }
 *                },
 *                "totalPerPeriod": 5264.114534589083
 *            },
 *            {
 *                "date": "2015-02-28T20:00:00.000Z",
 *                "percent": 9.930880197994787,
 *                "sources": {
 *                    "5458afc6fe540a120074c20f": {
 *                        "name": "Barretts Elementary School",
 *                        "savings": 233.3514283332583,
 *                        "kwh": 2333.5142833325826
 *                    },
 *                    "556f15a24a14b2180aa325e0": {
 *                        "name": "Facility-c8fd6c51",
 *                        "savings": 223.56528772315835,
 *                        "kwh": 2235.6528772315833
 *                    },
 *                    "556f159c4a14b2180aa315f1": {
 *                        "name": "Facility-7a79273a",
 *                        "savings": 296.9359991705917,
 *                        "kwh": 2969.359991705917
 *                    }
 *                },
 *                "totalPerPeriod": 7538.527152270083
 *            },
 *            {
 *                "date": "2015-03-28T20:00:00.000Z",
 *                "percent": 13.09900538151941,
 *                "sources": {
 *                    "5458afc6fe540a120074c20f": {
 *                        "name": "Barretts Elementary School",
 *                        "savings": 338.3583392730252,
 *                        "kwh": 3383.583392730252
 *                    },
 *                    "556f15a24a14b2180aa325e0": {
 *                        "name": "Facility-c8fd6c51",
 *                        "savings": 316.94882727125827,
 *                        "kwh": 3169.4882727125823
 *                    },
 *                    "556f159c4a14b2180aa315f1": {
 *                        "name": "Facility-7a79273a",
 *                        "savings": 339.0378035647584,
 *                        "kwh": 3390.3780356475845
 *                    }
 *                },
 *                "totalPerPeriod": 9943.449701090418
 *            },
 *            {
 *                "date": "2015-04-28T20:00:00.000Z",
 *                "percent": 14.004871716286779,
 *                "sources": {
 *                    "5458afc6fe540a120074c20f": {
 *                        "name": "Barretts Elementary School",
 *                        "savings": 383.66649404009166,
 *                        "kwh": 3836.6649404009167
 *                    },
 *                    "556f15a24a14b2180aa325e0": {
 *                        "name": "Facility-c8fd6c51",
 *                        "savings": 352.75619674238334,
 *                        "kwh": 3527.5619674238333
 *                    },
 *                    "556f159c4a14b2180aa315f1": {
 *                        "name": "Facility-7a79273a",
 *                        "savings": 326.68655625692486,
 *                        "kwh": 3266.865562569248
 *                    }
 *                },
 *                "totalPerPeriod": 10631.092470393996
 *            },
 *            {
 *                "date": "2015-05-28T20:00:00.000Z",
 *                "percent": 13.182981357941257,
 *                "sources": {
 *                    "5458afc6fe540a120074c20f": {
 *                        "name": "Barretts Elementary School",
 *                        "savings": 339.8845099283169,
 *                        "kwh": 3398.8450992831686
 *                    },
 *                    "556f15a24a14b2180aa325e0": {
 *                        "name": "Facility-c8fd6c51",
 *                        "savings": 315.74704366105016,
 *                        "kwh": 3157.4704366105016
 *                    },
 *                    "556f159c4a14b2180aa315f1": {
 *                        "name": "Facility-7a79273a",
 *                        "savings": 345.08802950234184,
 *                        "kwh": 3450.8802950234185
 *                    }
 *                },
 *                "totalPerPeriod": 10007.195830917088
 *            },
 *            {
 *                "date": "2015-06-28T20:00:00.000Z",
 *                "percent": 13.276980137101349,
 *                "sources": {
 *                    "5458afc6fe540a120074c20f": {
 *                        "name": "Barretts Elementary School",
 *                        "savings": 344.8770898221084,
 *                        "kwh": 3448.7708982210843
 *                    },
 *                    "556f15a24a14b2180aa325e0": {
 *                        "name": "Facility-c8fd6c51",
 *                        "savings": 315.1637159769167,
 *                        "kwh": 3151.637159769167
 *                    },
 *                    "556f159c4a14b2180aa315f1": {
 *                        "name": "Facility-7a79273a",
 *                        "savings": 347.8142208269001,
 *                        "kwh": 3478.142208269001
 *                    }
 *                },
 *                "totalPerPeriod": 10078.550266259252
 *            },
 *            {
 *                "date": "2015-07-28T20:00:00.000Z",
 *                "percent": 14.518785070430324,
 *                "sources": {
 *                    "5458afc6fe540a120074c20f": {
 *                        "name": "Barretts Elementary School",
 *                        "savings": 377.5475153262333,
 *                        "kwh": 3775.4751532623327
 *                    },
 *                    "556f15a24a14b2180aa325e0": {
 *                        "name": "Facility-c8fd6c51",
 *                        "savings": 347.7632364740501,
 *                        "kwh": 3477.6323647405006
 *                    },
 *                    "556f159c4a14b2180aa315f1": {
 *                        "name": "Facility-7a79273a",
 *                        "savings": 376.80963722135016,
 *                        "kwh": 3768.096372213501
 *                    }
 *                },
 *                "totalPerPeriod": 11021.203890216335
 *            }
 *        ]
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
 *
 */

 /**
 * @api {get} assurf:realtimepower Get Real Time Power data
 * @apiGroup Analyze Solar Surface
 * @apiName Get Real Time Power data
 * @apiVersion 1.0.0
 * @apiDescription Get Real Time Power data
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example
 * {
 *     "success": 1,
 *     "message": {
 *         "totalGeneration": {
 *             "kw": 41.755678521,
 *             "name": "Total Generation",
 *             "trend": "down"
 *         },
 *         "generationBySources": {
 *             "5458afc6fe540a120074c20f": {
 *                 "kw": 10.769453395,
 *                 "sourceId": "5458afc6fe540a120074c20f",
 *                 "name": "Barretts Elementary School",
 *                 "trend": "down"
 *             },
 *             "556f159c4a14b2180aa315f1": {
 *                 "kw": 15.034584071000001,
 *                 "sourceId": "556f159c4a14b2180aa315f1",
 *                 "name": "Facility-7a79273a",
 *                 "trend": "down"
 *             },
 *             "556f15a24a14b2180aa325e0": {
 *                 "kw": 15.951641055,
 *                 "sourceId": "556f15a24a14b2180aa325e0",
 *                 "name": "Facility-c8fd6c51",
 *                 "trend": "down"
 *             }
 *         },
 *         "mainChart": {
 *             "categories": [
 *                 "2015-07-28T21:00:00.000Z",
 *                 "2015-07-29T21:00:00.000Z",
 *                 "2015-07-30T21:00:00.000Z",
 *                 "2015-07-31T21:00:00.000Z",
 *                 "2015-08-01T21:00:00.000Z",
 *                 "2015-08-02T21:00:00.000Z",
 *                 "2015-08-03T21:00:00.000Z",
 *                 "2015-08-04T21:00:00.000Z",
 *                 "2015-08-05T21:00:00.000Z",
 *                 "2015-08-06T21:00:00.000Z",
 *                 "2015-08-07T21:00:00.000Z",
 *                 "2015-08-08T21:00:00.000Z",
 *                 "2015-08-09T21:00:00.000Z",
 *                 "2015-08-10T21:00:00.000Z",
 *                 "2015-08-11T21:00:00.000Z",
 *                 "2015-08-12T21:00:00.000Z",
 *                 "2015-08-13T21:00:00.000Z",
 *                 "2015-08-14T21:00:00.000Z",
 *                 "2015-08-15T21:00:00.000Z",
 *                 "2015-08-16T21:00:00.000Z",
 *                 "2015-08-17T21:00:00.000Z",
 *                 "2015-08-18T21:00:00.000Z",
 *                 "2015-08-19T21:00:00.000Z",
 *                 "2015-08-20T21:00:00.000Z",
 *                 "2015-08-21T21:00:00.000Z",
 *                 "2015-08-22T21:00:00.000Z",
 *                 "2015-08-23T21:00:00.000Z",
 *                 "2015-08-24T21:00:00.000Z",
 *                 "2015-08-25T21:00:00.000Z",
 *                 "2015-08-26T21:00:00.000Z",
 *                 "2015-08-27T21:00:00.000Z"
 *             ],
 *             "series": [
 *                 {
 *                     "name": "Total Generation",
 *                     "data": [
 *                         59.351872578,
 *                         58.865778116,
 *                         57.195800398,
 *                         58.529560802999995,
 *                         57.446904734,
 *                         58.10306983499999,
 *                         55.16825441,
 *                         57.348319221000004,
 *                         53.28021643700001,
 *                         58.38144871800001,
 *                         55.588504976,
 *                         55.57836232099999,
 *                         57.416948266,
 *                         61.576985007,
 *                         61.479700736,
 *                         60.708014937,
 *                         57.078413231000006,
 *                         57.436663821,
 *                         55.903399876,
 *                         55.301310543999996,
 *                         55.837899655,
 *                         52.882702303,
 *                         57.165528604,
 *                         56.763570121,
 *                         49.862702242999994,
 *                         56.48804607999999,
 *                         58.384294010999994,
 *                         56.582366274,
 *                         56.167966918999994,
 *                         53.09407119,
 *                         41.755678521
 *                     ]
 *                 },
 *                 {
 *                     "name": "Barretts Elementary School",
 *                     "data": [
 *                         20.224185064,
 *                         20.174243478,
 *                         19.792679231,
 *                         20.258759878,
 *                         19.572627688,
 *                         19.812876106,
 *                         18.726904347,
 *                         21.079376883,
 *                         18.108788854,
 *                         19.476662624,
 *                         18.875122808,
 *                         17.879701754000003,
 *                         20.411004501,
 *                         21.335976837,
 *                         20.969086498,
 *                         21.047789473999998,
 *                         19.014585813,
 *                         19.328763157,
 *                         19.607289473999998,
 *                         20.643597864,
 *                         19.617617392,
 *                         17.128719298,
 *                         18.330203308,
 *                         18.233150443,
 *                         16.333561015,
 *                         17.022097346,
 *                         18.881356826999998,
 *                         18.716848471,
 *                         18.598628552,
 *                         16.471163885,
 *                         10.769453395
 *                     ],
 *                     "sourceId": "5458afc6fe540a120074c20f"
 *                 },
 *                 {
 *                     "name": "Facility-7a79273a",
 *                     "data": [
 *                         20.004256321,
 *                         19.625159291,
 *                         18.991936155,
 *                         19.597882006,
 *                         19.581123893,
 *                         19.742633929,
 *                         17.272692568,
 *                         18.065825221,
 *                         17.445354297999998,
 *                         19.888935051,
 *                         19.506987673,
 *                         19.314083991,
 *                         19.876061947,
 *                         20.087510135000002,
 *                         20.759893805,
 *                         20.847991229,
 *                         19.368196787000002,
 *                         19.236342106000002,
 *                         18.226168142,
 *                         15.475987291,
 *                         17.438131813,
 *                         17.890785872,
 *                         19.566872471,
 *                         19.33646555,
 *                         18.396526549,
 *                         20.204699193,
 *                         19.789035398000003,
 *                         18.365463258,
 *                         17.448232143,
 *                         19.699598213999998,
 *                         15.034584071000001
 *                     ],
 *                     "sourceId": "556f159c4a14b2180aa315f1"
 *                 },
 *                 {
 *                     "name": "Facility-c8fd6c51",
 *                     "data": [
 *                         19.123431193000002,
 *                         19.066375346999997,
 *                         18.411185012,
 *                         18.672918919,
 *                         18.293153153000002,
 *                         18.547559800000002,
 *                         19.168657495,
 *                         18.203117117,
 *                         17.726073285000002,
 *                         19.015851043,
 *                         17.206394494999998,
 *                         18.384576576,
 *                         17.129881818,
 *                         20.153498035,
 *                         19.750720433,
 *                         18.812234234,
 *                         18.695630631,
 *                         18.871558558,
 *                         18.06994226,
 *                         19.181725389,
 *                         18.78215045,
 *                         17.863197133,
 *                         19.268452824999997,
 *                         19.193954128,
 *                         15.132614679,
 *                         19.261249540999998,
 *                         19.713901786,
 *                         19.500054545,
 *                         20.121106224,
 *                         16.923309091,
 *                         15.951641055
 *                     ],
 *                     "sourceId": "556f15a24a14b2180aa325e0"
 *                 }
 *             ]
 *         },
 *         "dateRange": "month",
 *         "history": false
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
 *
 */

 /**
 * @api {get} assurf:energytodaykpidrilldown Get Energy Today KPI Drilldown data
 * @apiGroup Analyze Solar Surface
 * @apiName Get Energy Today KPI Drilldown data
 * @apiVersion 1.0.0
 * @apiDescription Get Energy Today KPI Drilldown data
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example
 * {
 *    "success": 1,
 *    "message": {
 *        "totalProduction": 171.82125654608328,
 *        "totalProductionBySources": {
 *            "5458afc6fe540a120074c20f": {
 *                "kwh": 50.290685757333335,
 *                "name": "Barretts Elementary School"
 *            },
 *            "556f15a24a14b2180aa325e0": {
 *                "kwh": 66.44743731325002,
 *                "name": "Facility-c8fd6c51"
 *            },
 *            "556f159c4a14b2180aa315f1": {
 *                "kwh": 55.08313347550001,
 *                "name": "Facility-7a79273a"
 *            }
 *        },
 *        "energy": {
 *            "categories": [
 *                "2015-08-27T20:00:00.000Z",
 *                "2015-08-27T21:00:00.000Z",
 *                "2015-08-27T22:00:00.000Z",
 *                "2015-08-27T23:00:00.000Z",
 *                "2015-08-28T00:00:00.000Z",
 *                "2015-08-28T01:00:00.000Z",
 *                "2015-08-28T11:00:00.000Z",
 *                "2015-08-28T12:00:00.000Z",
 *                "2015-08-28T13:00:00.000Z",
 *                "2015-08-28T14:00:00.000Z",
 *                "2015-08-28T15:00:00.000Z",
 *                "2015-08-28T16:00:00.000Z"
 *            ],
 *            "series": [
 *                {
 *                    "type": "column",
 *                    "name": "Today Energy",
 *                    "data": [
 *                        37.49108359975,
 *                        27.89271114025,
 *                        16.989254217499997,
 *                        8.12354341775,
 *                        1.4828438245,
 *                        0,
 *                        0.0394436105,
 *                        2.4152475052500004,
 *                        7.4727971095,
 *                        15.770358211000001,
 *                        24.964967188083335,
 *                        29.179006721999997
 *                    ]
 *                }
 *            ]
 *        },
 *        "power": {
 *            "categories": [
 *                "2015-08-27T20:00:00.000Z",
 *                "2015-08-27T20:15:00.000Z",
 *                "2015-08-27T20:30:00.000Z",
 *                "2015-08-27T20:45:00.000Z",
 *                "2015-08-27T21:00:00.000Z",
 *                "2015-08-27T21:15:00.000Z",
 *                "2015-08-27T21:30:00.000Z",
 *                "2015-08-27T21:45:00.000Z",
 *                "2015-08-27T22:00:00.000Z",
 *                "2015-08-27T22:15:00.000Z",
 *                "2015-08-27T22:30:00.000Z",
 *                "2015-08-27T22:45:00.000Z",
 *                "2015-08-27T23:00:00.000Z",
 *                "2015-08-27T23:15:00.000Z",
 *                "2015-08-27T23:30:00.000Z",
 *                "2015-08-27T23:45:00.000Z",
 *                "2015-08-28T00:00:00.000Z",
 *                "2015-08-28T00:15:00.000Z",
 *                "2015-08-28T00:30:00.000Z",
 *                "2015-08-28T00:45:00.000Z",
 *                "2015-08-28T01:00:00.000Z",
 *                "2015-08-28T11:30:00.000Z",
 *                "2015-08-28T11:45:00.000Z",
 *                "2015-08-28T12:00:00.000Z",
 *                "2015-08-28T12:15:00.000Z",
 *                "2015-08-28T12:30:00.000Z",
 *                "2015-08-28T12:45:00.000Z",
 *                "2015-08-28T13:00:00.000Z",
 *                "2015-08-28T13:15:00.000Z",
 *                "2015-08-28T13:30:00.000Z",
 *                "2015-08-28T13:45:00.000Z",
 *                "2015-08-28T14:00:00.000Z",
 *                "2015-08-28T14:15:00.000Z",
 *                "2015-08-28T14:30:00.000Z",
 *                "2015-08-28T14:45:00.000Z",
 *                "2015-08-28T15:00:00.000Z",
 *                "2015-08-28T15:15:00.000Z",
 *                "2015-08-28T15:30:00.000Z",
 *                "2015-08-28T15:45:00.000Z",
 *                "2015-08-28T16:00:00.000Z"
 *            ],
 *            "series": [
 *                {
 *                    "type": "spline",
 *                    "name": "Current Power",
 *                    "data": [
 *                        36.043975128999996,
 *                        41.968616396,
 *                        38.852963008,
 *                        33.098779865999994,
 *                        31.317428596000003,
 *                        29.584033093,
 *                        29.417442690000005,
 *                        21.251940182,
 *                        20.337045676,
 *                        18.405178423,
 *                        14.938181580000002,
 *                        14.276611191,
 *                        11.443725073,
 *                        9.175148472999998,
 *                        7.585479965,
 *                        4.2898201600000005,
 *                        2.7996996710000004,
 *                        2.130233824,
 *                        0.902858798,
 *                        0.09858300499999999,
 *                        0,
 *                        0,
 *                        0.078887221,
 *                        0.696239527,
 *                        2.0950964919999993,
 *                        3.191809725,
 *                        3.677844277,
 *                        4.2229734610000005,
 *                        6.464538555,
 *                        7.8790945599999995,
 *                        11.324581862,
 *                        14.688780756,
 *                        16.295429497,
 *                        15.10978992,
 *                        16.987432670999997,
 *                        10.579430009,
 *                        23.042153556999995,
 *                        27.323804369,
 *                        28.84333699,
 *                        29.179006721999997
 *                    ]
 *                }
 *            ]
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
 *
 */

 /**
 * @api {get} assurf:actualpredictedenergy Get Actual Predicted Energy data
 * @apiGroup Analyze Solar Surface
 * @apiName Get Actual Predicted Energy data
 * @apiVersion 1.0.0
 * @apiDescription Get Actual Predicted Energy data
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example
 * {
 *    "success": 1,
 *    "message": {
 *        "categories": [
 *            "2014-08-01T05:00:00.000Z",
 *            "2014-09-01T05:00:00.000Z",
 *            "2014-10-01T05:00:00.000Z",
 *            "2014-11-01T05:00:00.000Z",
 *            "2014-12-01T05:00:00.000Z",
 *            "2015-01-01T05:00:00.000Z",
 *            "2015-02-01T05:00:00.000Z",
 *            "2015-03-01T05:00:00.000Z",
 *            "2015-04-01T05:00:00.000Z",
 *            "2015-05-01T05:00:00.000Z",
 *            "2015-06-01T05:00:00.000Z",
 *            "2015-07-01T05:00:00.000Z",
 *            "2015-08-01T05:00:00.000Z"
 *        ],
 *        "series": [
 *            {
 *                "name": "Actual Energy",
 *                "data": [
 *                    3554.5803995112474,
 *                    3239.7169273360837,
 *                    2488.3518757688316,
 *                    1608.6068882030827,
 *                    1040.303305361917,
 *                    3069.50083681375,
 *                    4871.92434489,
 *                    8835.007172889584,
 *                    9693.032200957918,
 *                    10329.162273665497,
 *                    10104.973228693503,
 *                    10698.477433954251,
 *                    9557.854836902417
 *                ]
 *            },
 *            {
 *                "name": "Predicted Energy",
 *                "data": [
 *                    11085.53275,
 *                    9900.14905,
 *                    8539.152949999998,
 *                    6486.683024999999,
 *                    5652.524124999999,
 *                    6398.876824999999,
 *                    871.239255643425,
 *                    2818.0819544429232,
 *                    3154.724372918027,
 *                    3603.5084450955437,
 *                    3418.3311003043495,
 *                    3898.3867293696744,
 *                    3199.1223595601227
 *                ]
 *            }
 *        ],
 *        "tooltips": [
 *            {
 *                "cloudydays": 8,
 *                "sunnydays": 23,
 *                "prevYearCloudyDays": 2,
 *                "prevYearSunnyDays": 29,
 *                "prevYearActualEnergy": -1,
 *                "prevYearPredictedEnergy": 11085.53275
 *            },
 *            {
 *                "cloudydays": 8,
 *                "sunnydays": 22,
 *                "prevYearCloudyDays": 2,
 *                "prevYearSunnyDays": 28,
 *                "prevYearActualEnergy": -1,
 *                "prevYearPredictedEnergy": 9900.14905
 *            },
 *            {
 *                "cloudydays": 5,
 *                "sunnydays": 26,
 *                "prevYearCloudyDays": 4,
 *                "prevYearSunnyDays": 27,
 *                "prevYearActualEnergy": -1,
 *                "prevYearPredictedEnergy": 8539.152949999998
 *            },
 *            {
 *                "cloudydays": 4,
 *                "sunnydays": 26,
 *                "prevYearCloudyDays": 4,
 *                "prevYearSunnyDays": 26,
 *                "prevYearActualEnergy": -1,
 *                "prevYearPredictedEnergy": 6486.683024999999
 *            },
 *            {
 *                "cloudydays": 2,
 *                "sunnydays": 29,
 *                "prevYearCloudyDays": 1,
 *                "prevYearSunnyDays": 30,
 *                "prevYearActualEnergy": -1,
 *                "prevYearPredictedEnergy": 5652.524124999999
 *            },
 *            {
 *                "cloudydays": 2,
 *                "sunnydays": 29,
 *                "prevYearCloudyDays": 2,
 *                "prevYearSunnyDays": 29,
 *                "prevYearActualEnergy": -1,
 *                "prevYearPredictedEnergy": 6398.876824999999
 *            },
 *            {
 *                "cloudydays": 3,
 *                "sunnydays": 25,
 *                "prevYearCloudyDays": 3,
 *                "prevYearSunnyDays": 25,
 *                "prevYearActualEnergy": 968.0436173815833,
 *                "prevYearPredictedEnergy": 7408.648124999999
 *            },
 *            {
 *                "cloudydays": 6,
 *                "sunnydays": 25,
 *                "prevYearCloudyDays": 4,
 *                "prevYearSunnyDays": 27,
 *                "prevYearActualEnergy": 3131.202171603248,
 *                "prevYearPredictedEnergy": 9911.124825
 *            },
 *            {
 *                "cloudydays": 3,
 *                "sunnydays": 27,
 *                "prevYearCloudyDays": 8,
 *                "prevYearSunnyDays": 22,
 *                "prevYearActualEnergy": 3505.2493032422517,
 *                "prevYearPredictedEnergy": 10668.453299999997
 *            },
 *            {
 *                "cloudydays": 5,
 *                "sunnydays": 26,
 *                "prevYearCloudyDays": 3,
 *                "prevYearSunnyDays": 28,
 *                "prevYearActualEnergy": 4003.898272328382,
 *                "prevYearPredictedEnergy": 11370.9029
 *            },
 *            {
 *                "cloudydays": 9,
 *                "sunnydays": 21,
 *                "prevYearCloudyDays": 6,
 *                "prevYearSunnyDays": 24,
 *                "prevYearActualEnergy": 3798.145667004833,
 *                "prevYearPredictedEnergy": 11008.702324999998
 *            },
 *            {
 *                "cloudydays": 4,
 *                "sunnydays": 27,
 *                "prevYearCloudyDays": 3,
 *                "prevYearSunnyDays": 28,
 *                "prevYearActualEnergy": 4331.540810410749,
 *                "prevYearPredictedEnergy": 11326.999799999998
 *            },
 *            {
 *                "cloudydays": 6,
 *                "sunnydays": 22,
 *                "prevYearCloudyDays": 8,
 *                "prevYearSunnyDays": 23,
 *                "prevYearActualEnergy": 3554.5803995112474,
 *                "prevYearPredictedEnergy": 11085.53275
 *            }
 *        ],
 *        "dateRange": "year",
 *        "dimension": "1month"
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
 *
 */

 /**
 * @api {get} assurf:solarenergygeneration Get Solar Energy Generation data
 * @apiGroup Analyze Solar Surface
 * @apiName Get Get Solar Energy Generation data
 * @apiVersion 1.0.0
 * @apiDescription Get Get Solar Energy Generation data
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example
 * {
 *     "success": 1,
 *     "message": {
 *         "totalSaving": 10322.057924934863,
 *         "totalProduction": 103220.57924934862,
 *         "totalProductionBySources": {
 *             "55d60385c63da8e403d76237": {
 *                 "kwh": 85011.5480319142,
 *                 "name": "Helix Architecture"
 *             },
 *             "55d60388c63da8e403d7774c": {
 *                 "kwh": 18209.031217434414,
 *                 "name": "3-8 Campus"
 *             }
 *         },
 *         "pie": {
 *             "series": [{
 *                 "type": "pie",
 *                 "name": "Generation Per Sources",
 *                 "data": [{
 *                     "name": "Helix Architecture",
 *                     "percent": 82.35910769939868,
 *                     "kwh": 85011.5480319142,
 *                     "sourceId": "55d60385c63da8e403d76237"
 *                 }, {
 *                     "name": "3-8 Campus",
 *                     "percent": 17.640892300601312,
 *                     "kwh": 18209.031217434414,
 *                     "sourceId": "55d60388c63da8e403d7774c"
 *                 }]
 *             }]
 *         },
 *         "mainChart": {
 *             "categories": [{
 *                 "type": "year",
 *                 "value": "2012-11-01T05:00:00.000Z"
 *             }, {
 *                 "type": "year",
 *                 "value": "2013-01-01T06:00:00.000Z"
 *             }, {
 *                 "type": "month",
 *                 "value": "2014-01-01T06:00:00.000Z"
 *             }, {
 *                 "type": "month",
 *                 "value": "2014-02-01T06:00:00.000Z"
 *             }, {
 *                 "type": "month",
 *                 "value": "2014-03-01T06:00:00.000Z"
 *             }, {
 *                 "type": "month",
 *                 "value": "2014-04-01T05:00:00.000Z"
 *             }, {
 *                 "type": "month",
 *                 "value": "2014-05-01T05:00:00.000Z"
 *             }, {
 *                 "type": "month",
 *                 "value": "2014-06-01T05:00:00.000Z"
 *             }, {
 *                 "type": "month",
 *                 "value": "2014-07-01T05:00:00.000Z"
 *             }, {
 *                 "type": "month",
 *                 "value": "2014-08-01T05:00:00.000Z"
 *             }, {
 *                 "type": "month",
 *                 "value": "2014-09-01T05:00:00.000Z"
 *             }, {
 *                 "type": "month",
 *                 "value": "2014-10-01T05:00:00.000Z"
 *             }, {
 *                 "type": "month",
 *                 "value": "2014-11-01T05:00:00.000Z"
 *             }, {
 *                 "type": "month",
 *                 "value": "2014-12-01T06:00:00.000Z"
 *             }, {
 *                 "type": "month",
 *                 "value": "2015-01-01T06:00:00.000Z"
 *             }, {
 *                 "type": "month",
 *                 "value": "2015-02-01T06:00:00.000Z"
 *             }, {
 *                 "type": "month",
 *                 "value": "2015-03-01T06:00:00.000Z"
 *             }, {
 *                 "type": "month",
 *                 "value": "2015-04-01T05:00:00.000Z"
 *             }, {
 *                 "type": "month",
 *                 "value": "2015-05-01T05:00:00.000Z"
 *             }, {
 *                 "type": "month",
 *                 "value": "2015-06-01T05:00:00.000Z"
 *             }, {
 *                 "type": "month",
 *                 "value": "2015-07-01T05:00:00.000Z"
 *             }, {
 *                 "type": "month",
 *                 "value": "2015-08-01T05:00:00.000Z"
 *             }, {
 *                 "type": "month",
 *                 "value": "2015-09-01T05:00:00.000Z"
 *             }, {
 *                 "type": "month",
 *                 "value": "2015-10-01T05:00:00.000Z"
 *             }, {
 *                 "type": "month",
 *                 "value": "2015-11-01T05:00:00.000Z"
 *             }],
 *             "series": [{
 *                 "name": "Total Generation",
 *                 "data": [
 *                     2297.5950000000003,
 *                     27029.175000000003,
 *                     1292.853,
 *                     1217.722,
 *                     2882.37,
 *                     2779.545,
 *                     3441.932,
 *                     2956.2110000000002,
 *                     3699.4710000000005,
 *                     3308.5460000000003,
 *                     2712.113,
 *                     2459.805,
 *                     1585.779,
 *                     737.886,
 *                     1406.8200000000002,
 *                     1706.995,
 *                     1819.9270000000001,
 *                     2302.5217476142657,
 *                     5310.436745960267,
 *                     6343.118558212749,
 *                     6847.74055578,
 *                     6687.853965907581,
 *                     5840.081415991252,
 *                     4452.803505062332,
 *                     2101.2777548201666
 *                 ]
 *             }, {
 *                 "name": "Savings",
 *                 "data": [
 *                     229.7595,
 *                     2702.9175000000005,
 *                     129.2853,
 *                     121.77220000000003,
 *                     288.237,
 *                     277.95450000000005,
 *                     344.1932,
 *                     295.6211,
 *                     369.94710000000003,
 *                     330.85460000000006,
 *                     271.2113,
 *                     245.9805,
 *                     158.57790000000003,
 *                     73.7886,
 *                     140.68200000000002,
 *                     170.6995,
 *                     181.9927,
 *                     230.2521747614266,
 *                     531.0436745960268,
 *                     634.3118558212749,
 *                     684.7740555780001,
 *                     668.7853965907582,
 *                     584.0081415991252,
 *                     445.2803505062332,
 *                     210.12777548201666
 *                 ]
 *             }, {
 *                 "name": "3-8 Campus",
 *                 "data": [
 *                     0,
 *                     0,
 *                     0,
 *                     0,
 *                     0,
 *                     0,
 *                     0,
 *                     0,
 *                     0,
 *                     0,
 *                     0,
 *                     0,
 *                     0,
 *                     0,
 *                     0,
 *                     0,
 *                     0,
 *                     0,
 *                     2316.6930434090837,
 *                     3112.6046342924988,
 *                     3429.5082176640008,
 *                     3343.542473587332,
 *                     2823.6732164576674,
 *                     2145.38452426925,
 *                     1037.6251077545835
 *                 ],
 *                 "sourceId": "55d60388c63da8e403d7774c"
 *             }, {
 *                 "name": "Helix Architecture",
 *                 "data": [
 *                     2297.5950000000003,
 *                     27029.175000000003,
 *                     1292.853,
 *                     1217.722,
 *                     2882.37,
 *                     2779.545,
 *                     3441.932,
 *                     2956.2110000000002,
 *                     3699.4710000000005,
 *                     3308.5460000000003,
 *                     2712.113,
 *                     2459.805,
 *                     1585.779,
 *                     737.886,
 *                     1406.8200000000002,
 *                     1706.995,
 *                     1819.9270000000001,
 *                     2302.5217476142657,
 *                     2993.7437025511836,
 *                     3230.5139239202504,
 *                     3418.2323381160004,
 *                     3344.311492320249,
 *                     3016.4081995335837,
 *                     2307.4189807930825,
 *                     1063.6526470655833
 *                 ],
 *                 "sourceId": "55d60385c63da8e403d76237"
 *             }]
 *         },
 *         "dateRange": "total",
 *         "dimension": "1month"
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
 *
 */

 /**
 * @api {get} assurf:equivalencies Get Equivalencies data
 * @apiGroup Analyze Solar Surface
 * @apiName Get Equivalencies data
 * @apiVersion 1.0.0
 * @apiDescription Get Equivalencies data
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example
 * {
 *    "success": 1,
 *    "message": {
 *        "homeElectricityUse": 1.080273384992022,
 *        "gallonsOfGasoline": 885.4100911941375,
 *        "passengerVehiclesPerYear": 1.6533868439772632,
 *        "barrelsOfOilConsumed": 18.264156997423257,
 *        "tankerTrucksFilledWithGasoline": 0.10396594531231135,
 *        "homeEnergyUse": 0.7159149962526891,
 *        "numberOfTreeSeedlingsGrownFor10Years": 201.37403868953845,
 *        "acresOfUSForestsStoringCarbonForOneYear": 6.437366810567213,
 *        "acresOfUSForestPreservedFromConversionToCropland": 0.060640780703358814,
 *        "propaneCylindersUsedForHomeBarbecues": 327.23281287049997,
 *        "railcarsOfCoalburned": 0.042110388787624665,
 *        "tonsOfWasteRecycledInsteadOfLandfilled": 2.8149059171655915,
 *        "coalFiredPowerPlantEmissionsForOneYear": 0.0000020620391600312027,
 *        "greenhouseEmissionsInKilograms": 0.007853587508892,
 *        "co2AvoidedInKilograms": 7.043576241158744,
 *        "aaBatteries": 3178082.103913447,
 *        "refrigerators": 8.667496647036673,
 *        "mobilePhones": 1733.4993294073347,
 *        "avoidedCarbon": 17314.17609385348,
 *        "avoidedCarbonTotal": 17314.17609385348,
 *        "kwh": 9534.24631174034
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
 *
 */

 /**
 * @api {get} assurf:totalenergygeneration Get TotalEnergyGeneration data
 * @apiGroup Analyze Solar Surface
 * @apiName Get TotalEnergyGeneration data
 * @apiVersion 1.0.0
 * @apiDescription Get TotalEnergyGeneration data
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example
 *{
 *    "success": 1,
 *    "message": {
 *        "totalEnergyGeneration": 9534.24631174034
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
 *
 */

 /**
 * @api {get} assurf:sunnyday Get Sunny day data
 * @apiGroup Analyze Solar Surface
 * @apiName Get Sunny day data
 * @apiVersion 1.0.0
 * @apiDescription Get Sunny day data
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example
 * {
 *    "success": 1,
 *    "message": [
 *        {
 *            "day": "2015-08-27T05:00:00.000Z",
 *            "Energy": 773.3535419345
 *        }
 *    ]
 *}
 *
 * @apiError (all) success 0
 * @apiError (all) message Error code
 * @apiErrorExample Error example
 *{
 *   "success": 0,
 *   "message": "External service error"
 *}
 *
 */

 /**
 * @api {get} assurf:sources Get Sources data
 * @apiGroup Analyze Solar Surface
 * @apiName Get Sources data
 * @apiVersion 1.0.0
 * @apiDescription Get Sources data
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example
 * {
 *     "success": 1,
 *     "message": {
 *         "5458afc6fe540a120074c20f": {
 *             "name": "Barretts Elementary",
 *             "id": "5458afc6fe540a120074c20f",
 *             "sourceId": "5458afc6fe540a120074c20f",
 *             "displayName": "Barretts Elementary School",
 *             "scopes": {
 *                 "5458b01afe540a120074c210": {
 *                     "name": "Barretts Elementary: Sunny WebBox",
 *                     "id": "5458b01afe540a120074c210",
 *                     "sourceId": "5458b01afe540a120074c210",
 *                     "displayName": "WebBox (Legacy)",
 *                     "lastReportedValue": 8.389234568,
 *                     "lastReportedTime": "2015-08-28T16:00:27.000Z",
 *                     "firstReportedTime": "2013-01-31T00:00:00.000Z",
 *                     "totalEnergyGenerated": 55294.23864651913,
 *                     "percent": 100,
 *                     "trend": "down",
 *                     "nodes": {
 *                         "WR8KU002:2002126708": {
 *                             "id": "5458ba38c0fa5a0e0045f161",
 *                             "sourceId": "5458ba38c0fa5a0e0045f161",
 *                             "name": "Barretts Elementary: Inverter C",
 *                             "displayName": "SB 8000 Inverter",
 *                             "rate": 0.1,
 *                             "powerMetricId": "Pac",
 *                             "lastReportedValue": 4.286,
 *                             "lastReportedTime": "2015-08-28T16:00:27.000Z",
 *                             "totalEnergyGenerated": 19058.639235487815,
 *                             "firstReportedTime": "2013-01-31T00:00:00.000Z",
 *                             "percent": 51,
 *                             "trend": "down"
 *                         },
 *                         "WR7KU009:2002112282": {
 *                             "id": "5458b23e79e7b60e00b1133b",
 *                             "sourceId": "5458b23e79e7b60e00b1133b",
 *                             "name": "Barretts Elementary: Inverter B",
 *                             "displayName": "SB 7000 Inverter",
 *                             "rate": 0.1,
 *                             "powerMetricId": "Pac",
 *                             "lastReportedValue": 0,
 *                             "lastReportedTime": "2015-08-27T16:00:31.000Z",
 *                             "totalEnergyGenerated": 17853.142608984163,
 *                             "firstReportedTime": "2013-01-31T00:00:00.000Z",
 *                             "percent": 0,
 *                             "trend": null
 *                         },
 *                         "WR7KU009:2002112342": {
 *                             "id": "5458b22379e7b60e00b1133a",
 *                             "sourceId": "5458b22379e7b60e00b1133a",
 *                             "name": "Barretts Elementary: Inverter A",
 *                             "displayName": "SB 7000 Inverter",
 *                             "rate": 0.1,
 *                             "powerMetricId": "Pac",
 *                             "lastReportedValue": 4.1032345679999995,
 *                             "lastReportedTime": "2015-08-28T16:00:27.000Z",
 *                             "totalEnergyGenerated": 18382.45680204715,
 *                             "firstReportedTime": "2013-01-31T00:00:00.000Z",
 *                             "percent": 49,
 *                             "trend": null
 *                         }
 *                     }
 *                 }
 *             },
 *             "lastReportedValue": 8.389234568,
 *             "lastReportedTime": "2015-08-28T16:00:27.000Z",
 *             "firstReportedTime": "2013-01-31T00:00:00.000Z",
 *             "totalEnergyGenerated": 55294.23864651913,
 *             "percent": 29,
 *             "trend": "down",
 *             "potentialPower": 25.58,
 *             "facilityImage": "https://cdn.brightergy.com/FacilityAssets/image/sIwHdsgd2nWKniO9.jpg"
 *         },
 *         "556f159c4a14b2180aa315f1": {
 *             "name": "Facility-7a79273a",
 *             "id": "556f159c4a14b2180aa315f1",
 *             "sourceId": "556f159c4a14b2180aa315f1",
 *             "displayName": "Facility-7a79273a",
 *             "scopes": {
 *                 "556f159c4a14b2180aa315f2": {
 *                     "name": "Sunny WebBox: wb150184802",
 *                     "id": "556f159c4a14b2180aa315f2",
 *                     "sourceId": "556f159c4a14b2180aa315f2",
 *                     "displayName": "WebBox (Legacy)",
 *                     "lastReportedValue": 4.875674119,
 *                     "lastReportedTime": "2015-08-28T16:00:32.000Z",
 *                     "firstReportedTime": "2014-07-24T00:00:00.000Z",
 *                     "totalEnergyGenerated": 22338.349270560087,
 *                     "percent": 100,
 *                     "trend": "down",
 *                     "nodes": {
 *                         "WR7KU020:2007304360": {
 *                             "id": "556f159c4a14b2180aa315ff",
 *                             "sourceId": "556f159c4a14b2180aa315ff",
 *                             "name": "wb150184802 inverter C",
 *                             "displayName": "SB 7000 Inverter",
 *                             "rate": 0.1,
 *                             "powerMetricId": "Pac",
 *                             "lastReportedValue": 1.73695614,
 *                             "lastReportedTime": "2015-08-28T16:00:32.000Z",
 *                             "totalEnergyGenerated": 7902.479104135751,
 *                             "firstReportedTime": "2014-07-24T00:00:00.000Z",
 *                             "percent": 36,
 *                             "trend": null
 *                         },
 *                         "WR7KU020:2002290942": {
 *                             "id": "556f159c4a14b2180aa315f9",
 *                             "sourceId": "556f159c4a14b2180aa315f9",
 *                             "name": "wb150184802 inverter B",
 *                             "displayName": "SB 7000 Inverter",
 *                             "rate": 0.1,
 *                             "powerMetricId": "Pac",
 *                             "lastReportedValue": 1.5758495579999998,
 *                             "lastReportedTime": "2015-08-28T16:00:32.000Z",
 *                             "totalEnergyGenerated": 7213.365950732168,
 *                             "firstReportedTime": "2014-07-24T00:00:00.000Z",
 *                             "percent": 32,
 *                             "trend": "down"
 *                         },
 *                         "WR7KU020:2002290404": {
 *                             "id": "556f159c4a14b2180aa315f3",
 *                             "sourceId": "556f159c4a14b2180aa315f3",
 *                             "name": "wb150184802 inverter A",
 *                             "displayName": "SB 7000 Inverter",
 *                             "rate": 0.1,
 *                             "powerMetricId": "Pac",
 *                             "lastReportedValue": 1.562868421,
 *                             "lastReportedTime": "2015-08-28T16:00:32.000Z",
 *                             "totalEnergyGenerated": 7222.504215692166,
 *                             "firstReportedTime": "2014-07-24T00:00:00.000Z",
 *                             "percent": 32,
 *                             "trend": null
 *                         }
 *                     }
 *                 }
 *             },
 *             "lastReportedValue": 4.875674119,
 *             "lastReportedTime": "2015-08-28T16:00:32.000Z",
 *             "firstReportedTime": "2014-07-24T00:00:00.000Z",
 *             "totalEnergyGenerated": 22338.349270560087,
 *             "percent": 17,
 *             "trend": "down",
 *             "potentialPower": 25.410000000000004,
 *             "facilityImage": null
 *         },
 *         "556f15a24a14b2180aa325e0": {
 *             "name": "Facility-c8fd6c51",
 *             "id": "556f15a24a14b2180aa325e0",
 *             "sourceId": "556f15a24a14b2180aa325e0",
 *             "displayName": "Facility-c8fd6c51",
 *             "scopes": {
 *                 "556f15a24a14b2180aa325e1": {
 *                     "name": "Sunny WebBox: wb150174964",
 *                     "id": "556f15a24a14b2180aa325e1",
 *                     "sourceId": "556f15a24a14b2180aa325e1",
 *                     "displayName": "WebBox (Legacy)",
 *                     "lastReportedValue": 15.914098034999999,
 *                     "lastReportedTime": "2015-08-28T16:00:44.000Z",
 *                     "firstReportedTime": "2014-09-18T00:00:00.000Z",
 *                     "totalEnergyGenerated": 21196.98364983992,
 *                     "percent": 100,
 *                     "trend": "down",
 *                     "nodes": {
 *                         "WR7KU009:2007330180": {
 *                             "id": "556f15a24a14b2180aa325ee",
 *                             "sourceId": "556f15a24a14b2180aa325ee",
 *                             "name": "wb150174964 inverter C",
 *                             "displayName": "SB 7000 Inverter",
 *                             "rate": 0.1,
 *                             "powerMetricId": "Pac",
 *                             "lastReportedValue": 5.368621622,
 *                             "lastReportedTime": "2015-08-28T16:00:44.000Z",
 *                             "totalEnergyGenerated": 7318.295288305916,
 *                             "firstReportedTime": "2014-09-18T00:00:00.000Z",
 *                             "percent": 34,
 *                             "trend": null
 *                         },
 *                         "WR7KU009:2007328878": {
 *                             "id": "556f15a24a14b2180aa325e8",
 *                             "sourceId": "556f15a24a14b2180aa325e8",
 *                             "name": "wb150174964 inverter B",
 *                             "displayName": "SB 7000 Inverter",
 *                             "rate": 0.1,
 *                             "powerMetricId": "Pac",
 *                             "lastReportedValue": 5.198594594999999,
 *                             "lastReportedTime": "2015-08-28T16:00:44.000Z",
 *                             "totalEnergyGenerated": 6798.422417388918,
 *                             "firstReportedTime": "2014-09-18T00:00:00.000Z",
 *                             "percent": 33,
 *                             "trend": null
 *                         },
 *                         "WR7KU009:2007328720": {
 *                             "id": "556f15a24a14b2180aa325e2",
 *                             "sourceId": "556f15a24a14b2180aa325e2",
 *                             "name": "wb150174964 inverter A",
 *                             "displayName": "SB 7000 Inverter",
 *                             "rate": 0.1,
 *                             "powerMetricId": "Pac",
 *                             "lastReportedValue": 5.346881818,
 *                             "lastReportedTime": "2015-08-28T16:00:44.000Z",
 *                             "totalEnergyGenerated": 7080.265944145084,
 *                             "firstReportedTime": "2014-09-18T00:00:00.000Z",
 *                             "percent": 34,
 *                             "trend": "down"
 *                         }
 *                     }
 *                 }
 *             },
 *             "lastReportedValue": 15.914098034999999,
 *             "lastReportedTime": "2015-08-28T16:00:44.000Z",
 *             "firstReportedTime": "2014-09-18T00:00:00.000Z",
 *             "totalEnergyGenerated": 21196.98364983992,
 *             "percent": 55,
 *             "trend": "down",
 *             "potentialPower": 24.705,
 *             "facilityImage": null
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
 *
 */

 /**
 * @api {get} assurf:savings Get Savings data
 * @apiGroup Analyze Solar Surface
 * @apiName Get Savings data
 * @apiVersion 1.0.0
 * @apiDescription Get Savings data
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example
 * {
 *    "success": 1,
 *    "message": {
 *        "totalSavingPerDateRange": 1102.1203890216334,
 *        "totalSavings": 9882.957156691911,
 *        "totalProduction": 98829.57156691914,
 *        "totalProductionBySources": {
 *            "5458afc6fe540a120074c20f": {
 *                "kwh": 55294.23864651913,
 *                "name": "Barretts Elementary School"
 *            },
 *            "556f15a24a14b2180aa325e0": {
 *                "kwh": 21196.98364983992,
 *                "name": "Facility-c8fd6c51"
 *            },
 *            "556f159c4a14b2180aa315f1": {
 *                "kwh": 22338.349270560087,
 *                "name": "Facility-7a79273a"
 *            }
 *        },
 *        "areaChart": {
 *            "categories": [
 *                "2015-07-28T20:00:00.000Z",
 *                "2015-07-29T20:00:00.000Z",
 *                "2015-07-30T20:00:00.000Z",
 *                "2015-07-31T20:00:00.000Z",
 *                "2015-08-01T20:00:00.000Z",
 *                "2015-08-02T20:00:00.000Z",
 *                "2015-08-03T20:00:00.000Z",
 *                "2015-08-04T20:00:00.000Z",
 *                "2015-08-05T20:00:00.000Z",
 *                "2015-08-06T20:00:00.000Z",
 *                "2015-08-07T20:00:00.000Z",
 *                "2015-08-08T20:00:00.000Z",
 *                "2015-08-09T20:00:00.000Z",
 *                "2015-08-10T20:00:00.000Z",
 *                "2015-08-11T20:00:00.000Z",
 *                "2015-08-12T20:00:00.000Z",
 *                "2015-08-13T20:00:00.000Z",
 *                "2015-08-14T20:00:00.000Z",
 *                "2015-08-15T20:00:00.000Z",
 *                "2015-08-16T20:00:00.000Z",
 *                "2015-08-17T20:00:00.000Z",
 *                "2015-08-18T20:00:00.000Z",
 *                "2015-08-19T20:00:00.000Z",
 *                "2015-08-20T20:00:00.000Z",
 *                "2015-08-21T20:00:00.000Z",
 *                "2015-08-22T20:00:00.000Z",
 *                "2015-08-23T20:00:00.000Z",
 *                "2015-08-24T20:00:00.000Z",
 *                "2015-08-25T20:00:00.000Z",
 *                "2015-08-26T20:00:00.000Z",
 *                "2015-08-27T20:00:00.000Z"
 *            ],
 *            "series": [
 *                {
 *                    "name": "Barretts Elementary School",
 *                    "data": [
 *                        14.9824988733,
 *                        16.004407445808337,
 *                        16.216919519158335,
 *                        13.779173036141668,
 *                        15.04591761419167,
 *                        15.445264781208333,
 *                        13.678100524658332,
 *                        9.609557788583334,
 *                        6.311110711525,
 *                        14.041983175866665,
 *                        10.3061062614,
 *                        8.795594727175,
 *                        8.093286113583334,
 *                        14.978194091725001,
 *                        15.334374608883333,
 *                        14.56877618455,
 *                        10.347413802975002,
 *                        14.535117377050003,
 *                        14.687981857841669,
 *                        14.565213386141668,
 *                        12.354270985783335,
 *                        6.64250754065,
 *                        11.987350035683333,
 *                        13.190459620000002,
 *                        6.676745295133334,
 *                        6.030935867658334,
 *                        14.476728731241668,
 *                        14.542996325458333,
 *                        14.242853669475004,
 *                        11.046606797650002,
 *                        5.0290685757333335
 *                    ],
 *                    "sourceId": "5458afc6fe540a120074c20f"
 *                },
 *                {
 *                    "name": "Facility-7a79273a",
 *                    "data": [
 *                        12.789301018225,
 *                        14.565732991266668,
 *                        15.658329911558331,
 *                        15.047713320141668,
 *                        13.976261833791668,
 *                        11.851826008375,
 *                        11.072949294833334,
 *                        9.107943512833334,
 *                        10.830203880108334,
 *                        11.258310258333335,
 *                        9.265533770725,
 *                        10.78392465665,
 *                        12.076519913175,
 *                        14.825972283400002,
 *                        12.365957828500001,
 *                        13.637666791475002,
 *                        14.628876810074999,
 *                        14.539700645391667,
 *                        13.799633044591667,
 *                        9.028614694250003,
 *                        3.1545006399833335,
 *                        10.095941630833334,
 *                        14.147207039600001,
 *                        14.666034125241666,
 *                        13.935185725375,
 *                        14.59779932315,
 *                        15.442811374566668,
 *                        14.477045984550005,
 *                        13.392389780875,
 *                        6.281435781925,
 *                        5.50831334755
 *                    ],
 *                    "sourceId": "556f159c4a14b2180aa315f1"
 *                },
 *                {
 *                    "name": "Facility-c8fd6c51",
 *                    "data": [
 *                        14.297152177425,
 *                        13.676068328200001,
 *                        13.794097977225,
 *                        12.563675449508334,
 *                        13.089798568133332,
 *                        13.439354027883336,
 *                        12.378865123050002,
 *                        8.387298209375,
 *                        6.191072229875,
 *                        13.082050718833333,
 *                        10.232351262241668,
 *                        7.740823362625,
 *                        8.145458515058335,
 *                        13.877779845466668,
 *                        13.414115100075001,
 *                        12.743562834808333,
 *                        10.277926960225,
 *                        12.764693329566667,
 *                        12.053732104700002,
 *                        11.923923444300002,
 *                        10.453644115133335,
 *                        6.1228751497000005,
 *                        10.977197099233335,
 *                        11.847477387166666,
 *                        6.7732183856,
 *                        7.324106950141666,
 *                        13.985965149000002,
 *                        14.092113186950002,
 *                        13.512308898650002,
 *                        11.955786852575,
 *                        6.644743731325001
 *                    ],
 *                    "sourceId": "556f15a24a14b2180aa325e0"
 *                }
 *            ]
 *        },
 *        "comboChart": {
 *            "categories": [
 *                "2015-07-28T20:00:00.000Z",
 *                "2015-07-29T20:00:00.000Z",
 *                "2015-07-30T20:00:00.000Z",
 *                "2015-07-31T20:00:00.000Z",
 *                "2015-08-01T20:00:00.000Z",
 *                "2015-08-02T20:00:00.000Z",
 *                "2015-08-03T20:00:00.000Z",
 *                "2015-08-04T20:00:00.000Z",
 *                "2015-08-05T20:00:00.000Z",
 *                "2015-08-06T20:00:00.000Z",
 *                "2015-08-07T20:00:00.000Z",
 *                "2015-08-08T20:00:00.000Z",
 *                "2015-08-09T20:00:00.000Z",
 *                "2015-08-10T20:00:00.000Z",
 *                "2015-08-11T20:00:00.000Z",
 *                "2015-08-12T20:00:00.000Z",
 *                "2015-08-13T20:00:00.000Z",
 *                "2015-08-14T20:00:00.000Z",
 *                "2015-08-15T20:00:00.000Z",
 *                "2015-08-16T20:00:00.000Z",
 *                "2015-08-17T20:00:00.000Z",
 *                "2015-08-18T20:00:00.000Z",
 *                "2015-08-19T20:00:00.000Z",
 *                "2015-08-20T20:00:00.000Z",
 *                "2015-08-21T20:00:00.000Z",
 *                "2015-08-22T20:00:00.000Z",
 *                "2015-08-23T20:00:00.000Z",
 *                "2015-08-24T20:00:00.000Z",
 *                "2015-08-25T20:00:00.000Z",
 *                "2015-08-26T20:00:00.000Z",
 *                "2015-08-27T20:00:00.000Z"
 *            ],
 *            "series": [
 *                {
 *                    "type": "column",
 *                    "name": "Savings",
 *                    "data": [
 *                        42.06895206895,
 *                        44.24620876527501,
 *                        45.66934740794167,
 *                        41.39056180579166,
 *                        42.11197801611667,
 *                        40.73644481746667,
 *                        37.129914942541674,
 *                        27.10479951079167,
 *                        23.332386821508333,
 *                        38.38234415303334,
 *                        29.803991294366668,
 *                        27.320342746450002,
 *                        28.315264541816667,
 *                        43.68194622059167,
 *                        41.11444753745835,
 *                        40.95000581083334,
 *                        35.25421757327501,
 *                        41.83951135200834,
 *                        40.54134700713334,
 *                        35.517751524691676,
 *                        25.962415740900003,
 *                        22.861324321183336,
 *                        37.11175417451667,
 *                        39.70397113240833,
 *                        27.385149406108333,
 *                        27.95284214095,
 *                        43.90550525480833,
 *                        43.112155496958344,
 *                        41.14755234900001,
 *                        29.28382943215,
 *                        17.182125654608335
 *                    ]
 *                },
 *                {
 *                    "type": "spline",
 *                    "name": "kWh",
 *                    "data": [
 *                        420.6895206895,
 *                        442.46208765275003,
 *                        456.6934740794166,
 *                        413.90561805791674,
 *                        421.11978016116666,
 *                        407.3644481746667,
 *                        371.29914942541666,
 *                        271.0479951079167,
 *                        233.32386821508328,
 *                        383.8234415303333,
 *                        298.03991294366665,
 *                        273.2034274645,
 *                        283.1526454181667,
 *                        436.8194622059167,
 *                        411.1444753745833,
 *                        409.5000581083333,
 *                        352.5421757327501,
 *                        418.3951135200833,
 *                        405.41347007133334,
 *                        355.1775152469167,
 *                        259.624157409,
 *                        228.6132432118333,
 *                        371.11754174516665,
 *                        397.0397113240833,
 *                        273.8514940610834,
 *                        279.52842140949997,
 *                        439.0550525480834,
 *                        431.12155496958337,
 *                        411.47552348999994,
 *                        292.83829432150003,
 *                        171.8212565460833
 *                    ]
 *                }
 *            ]
 *        },
 *        "dateRange": "month"
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
 *
 */

 /**
 * @api {get} assurf:carbonavoided Get Carbon Avoided data
 * @apiGroup Analyze Solar Surface
 * @apiName Get Carbon Avoided data
 * @apiVersion 1.0.0
 * @apiDescription Get Carbon Avoided data
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example
 * {
 *    "success": 1,
 *    "message": {
 *        "carbonAvoided": 17314.176093853464,
 *        "carbonAvoidedTotal": 44802.79888911093,
 *        "dateRange": "month"
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
 *
 */

 /**
 * @api {get} assurf:currentpower Get Current Power data
 * @apiGroup Analyze Solar Surface
 * @apiName Get Get Current Power Data data
 * @apiVersion 1.0.0
 * @apiDescription Get Get Current Power data
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example
 * {
 *    "success": 1,
 *    "message": {
 *        "totalGeneration": 36.63613671424999,
 *        "totalProductionBySources": {
 *            "5458afc6fe540a120074c20f": {
 *                "value": 11.110058276916666,
 *                "trend": "down",
 *                "name": "Barretts Elementary School"
 *            },
 *            "556f15a24a14b2180aa325e0": {
 *                "value": 13.675208137999999,
 *                "trend": "up",
 *                "name": "Facility-c8fd6c51"
 *            },
 *            "556f159c4a14b2180aa315f1": {
 *                "value": 11.850870299333334,
 *                "trend": "down",
 *                "name": "Facility-7a79273a"
 *            }
 *        },
 *        "energyChart": {
 *            "categories": [
 *                "2015-08-28T02:00:00.000Z",
 *                "2015-08-28T03:00:00.000Z",
 *                "2015-08-28T04:00:00.000Z",
 *                "2015-08-28T05:00:00.000Z",
 *                "2015-08-28T06:00:00.000Z",
 *                "2015-08-28T16:00:00.000Z",
 *                "2015-08-28T17:00:00.000Z",
 *                "2015-08-28T18:00:00.000Z",
 *                "2015-08-28T19:00:00.000Z",
 *                "2015-08-28T20:00:00.000Z",
 *                "2015-08-28T21:00:00.000Z"
 *            ],
 *            "series": [
 *                {
 *                    "name": "Total energy",
 *                    "data": [
 *                        2.324392595020833,
 *                        1.4157711847916665,
 *                        0.6769619514791667,
 *                        0.12357031870833333,
 *                        0,
 *                        0.003286967541666667,
 *                        0.2012706254375,
 *                        0.6227330924583333,
 *                        1.3141965175833332,
 *                        1.8705984359374999,
 *                        2.4315838934999996
 *                    ]
 *                }
 *            ]
 *        },
 *        "powerChart": {
 *            "categories": [
 *                "2015-08-27T21:00:00.000Z",
 *                "2015-08-27T21:15:00.000Z",
 *                "2015-08-27T21:30:00.000Z",
 *                "2015-08-27T21:45:00.000Z",
 *                "2015-08-27T22:00:00.000Z",
 *                "2015-08-27T22:15:00.000Z",
 *                "2015-08-27T22:30:00.000Z",
 *                "2015-08-27T22:45:00.000Z",
 *                "2015-08-27T23:00:00.000Z",
 *                "2015-08-27T23:15:00.000Z",
 *                "2015-08-27T23:30:00.000Z",
 *                "2015-08-27T23:45:00.000Z",
 *                "2015-08-28T00:00:00.000Z",
 *                "2015-08-28T00:15:00.000Z",
 *                "2015-08-28T00:30:00.000Z",
 *                "2015-08-28T00:45:00.000Z",
 *                "2015-08-28T01:00:00.000Z",
 *                "2015-08-28T11:30:00.000Z",
 *                "2015-08-28T11:45:00.000Z",
 *                "2015-08-28T12:00:00.000Z",
 *                "2015-08-28T12:15:00.000Z",
 *                "2015-08-28T12:30:00.000Z",
 *                "2015-08-28T12:45:00.000Z",
 *                "2015-08-28T13:00:00.000Z",
 *                "2015-08-28T13:15:00.000Z",
 *                "2015-08-28T13:30:00.000Z",
 *                "2015-08-28T13:45:00.000Z",
 *                "2015-08-28T14:00:00.000Z",
 *                "2015-08-28T14:15:00.000Z",
 *                "2015-08-28T14:30:00.000Z",
 *                "2015-08-28T14:45:00.000Z",
 *                "2015-08-28T15:00:00.000Z",
 *                "2015-08-28T15:15:00.000Z",
 *                "2015-08-28T15:30:00.000Z",
 *                "2015-08-28T15:45:00.000Z",
 *                "2015-08-28T16:00:00.000Z"
 *            ],
 *            "series": [
 *                {
 *                    "name": "Total power",
 *                    "data": [
 *                        31.317428596000003,
 *                        29.584033092999995,
 *                        29.417442689999998,
 *                        21.251940182,
 *                        20.337045676,
 *                        18.405178422999995,
 *                        14.93818158,
 *                        14.276611190999997,
 *                        11.443725073,
 *                        9.175148473,
 *                        7.585479964999999,
 *                        4.2898201600000005,
 *                        2.799699671,
 *                        2.1302338240000003,
 *                        0.902858798,
 *                        0.098583005,
 *                        0,
 *                        0,
 *                        0.07888722100000001,
 *                        0.696239527,
 *                        2.0950964920000006,
 *                        3.1918097249999997,
 *                        3.6778442769999997,
 *                        4.222973461,
 *                        6.464538554999999,
 *                        7.87909456,
 *                        11.324581862,
 *                        14.688780756,
 *                        16.295429496999997,
 *                        15.10978992,
 *                        16.987432671,
 *                        10.579430009,
 *                        23.042153557000002,
 *                        27.323804369,
 *                        28.843336989999994,
 *                        29.179006721999997
 *                    ]
 *                }
 *            ]
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
 *
 */

 /**
 * @api {get} assurf:facilitydrilldown Get Facility Drilldown data
 * @apiGroup Analyze Solar Surface
 * @apiName Get Facility Drilldown data
 * @apiVersion 1.0.0
 * @apiDescription Get Facility Drilldown data
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example
 * {
 *    "success": 1,
 *    "message": {
 *        "predictedAnnualGeneration": 37205.54311733406,
 *        "predictedCarbonAvoided": 67565.20695377271,
 *        "energyChart": {
 *            "series": [
 *                [
 *                    "2014",
 *                    1391212800000,
 *                    5.656252631416667,
 *                    141.586868893,
 *                    0,
 *                    123.10006920500001
 *                ],
 *                [
 *                    "2014",
 *                    1393632000000,
 *                    52.59520299775001,
 *                    160.43981125808332,
 *                    7.24980933075,
 *                    58.82805166033334
 *                ],
 *                [
 *                    "2014",
 *                    1396310400000,
 *                    126.79649428341669,
 *                    177.0978570971667,
 *                    13.037476166166668,
 *                    72.73397434066666
 *                ],
 *                [
 *                    "2014",
 *                    1398902400000,
 *                    62.87145308515001,
 *                    180.97601160874999,
 *                    34.7914146335,
 *                    154.77906160083336
 *                ],
 *                [
 *                    "2014",
 *                    1401580800000,
 *                    154.03232989925002,
 *                    189.05805097849998,
 *                    70.21360759474999,
 *                    138.90400210575
 *                ],
 *                [
 *                    "2014",
 *                    1404172800000,
 *                    125.72110763900001,
 *                    174.24508587308333,
 *                    63.870494395333345,
 *                    126.40760103808331
 *                ],
 *                [
 *                    "2014",
 *                    1406851200000,
 *                    111.58425189599998,
 *                    168.0716836918333,
 *                    25.040666593833333,
 *                    125.45593816975001
 *                ],
 *                [
 *                    "2014",
 *                    1409529600000,
 *                    92.51250593416667,
 *                    157.06495354900002,
 *                    18.503257663250004,
 *                    121.97900173424999
 *                ],
 *                [
 *                    "2014",
 *                    1412121600000,
 *                    103.13456704275,
 *                    136.6391349715,
 *                    9.360455819,
 *                    104.88851861841668
 *                ],
 *                [
 *                    "2014",
 *                    1414800000000,
 *                    109.09810132200002,
 *                    109.09810132200002,
 *                    2.6531164229166664,
 *                    45.09555223075
 *                ],
 *                [
 *                    "2014",
 *                    1417392000000,
 *                    39.29743201366667,
 *                    76.93623348,
 *                    1.8765543105000002,
 *                    76.67745707549999
 *                ]
 *            ],
 *            "categories": [
 *                "2014-02-01T05:00:00.000Z",
 *                "2014-03-01T05:00:00.000Z",
 *                "2014-04-01T05:00:00.000Z",
 *                "2014-05-01T05:00:00.000Z",
 *                "2014-06-01T05:00:00.000Z",
 *                "2014-07-01T05:00:00.000Z",
 *                "2014-08-01T05:00:00.000Z",
 *                "2014-09-01T05:00:00.000Z",
 *                "2014-10-01T05:00:00.000Z",
 *                "2014-11-01T05:00:00.000Z",
 *                "2014-12-01T05:00:00.000Z"
 *            ],
 *            "totalProduction": 31669.639238152216,
 *            "year": 2014
 *        },
 *        "powerChart": {
 *            "categories": [
 *                "2015-01-01T05:00:00.000Z",
 *                "2015-01-02T05:00:00.000Z",
 *                "2015-01-03T05:00:00.000Z",
 *                "2015-01-04T05:00:00.000Z",
 *                "2015-01-05T05:00:00.000Z",
 *                "2015-01-06T05:00:00.000Z",
 *                "2015-01-07T05:00:00.000Z",
 *                "2015-01-08T05:00:00.000Z",
 *                "2015-01-09T05:00:00.000Z",
 *                "2015-01-10T05:00:00.000Z",
 *                "2015-01-11T05:00:00.000Z",
 *                "2015-01-12T05:00:00.000Z",
 *                "2015-01-13T05:00:00.000Z",
 *                "2015-01-14T05:00:00.000Z",
 *                "2015-01-15T05:00:00.000Z",
 *                "2015-01-16T05:00:00.000Z",
 *                "2015-01-17T05:00:00.000Z",
 *                "2015-01-18T05:00:00.000Z",
 *                "2015-01-19T05:00:00.000Z",
 *                "2015-01-20T05:00:00.000Z",
 *                "2015-01-21T05:00:00.000Z",
 *                "2015-01-22T05:00:00.000Z",
 *                "2015-01-23T05:00:00.000Z",
 *                "2015-01-24T05:00:00.000Z",
 *                "2015-01-25T05:00:00.000Z",
 *                "2015-01-26T05:00:00.000Z",
 *                "2015-01-27T05:00:00.000Z",
 *                "2015-01-28T05:00:00.000Z",
 *                "2015-01-29T05:00:00.000Z",
 *                "2015-01-30T05:00:00.000Z",
 *                "2015-01-31T05:00:00.000Z",
 *                "2015-02-01T05:00:00.000Z",
 *                "2015-02-02T05:00:00.000Z",
 *                "2015-02-03T05:00:00.000Z",
 *                "2015-02-04T05:00:00.000Z",
 *                "2015-02-05T05:00:00.000Z",
 *                "2015-02-06T05:00:00.000Z",
 *                "2015-02-07T05:00:00.000Z",
 *                "2015-02-08T05:00:00.000Z",
 *                "2015-02-09T05:00:00.000Z",
 *                "2015-02-10T05:00:00.000Z",
 *                "2015-02-11T05:00:00.000Z",
 *                "2015-02-12T05:00:00.000Z",
 *                "2015-02-13T05:00:00.000Z",
 *                "2015-02-14T05:00:00.000Z",
 *                "2015-02-15T05:00:00.000Z",
 *                "2015-02-16T05:00:00.000Z",
 *                "2015-02-17T05:00:00.000Z",
 *                "2015-02-18T05:00:00.000Z",
 *                "2015-02-19T05:00:00.000Z",
 *                "2015-02-20T05:00:00.000Z",
 *                "2015-02-21T05:00:00.000Z",
 *                "2015-02-22T05:00:00.000Z",
 *                "2015-02-23T05:00:00.000Z",
 *                "2015-02-24T05:00:00.000Z",
 *                "2015-02-25T05:00:00.000Z",
 *                "2015-02-26T05:00:00.000Z",
 *                "2015-02-27T05:00:00.000Z",
 *                "2015-02-28T05:00:00.000Z",
 *                "2015-03-01T05:00:00.000Z",
 *                "2015-03-02T05:00:00.000Z",
 *                "2015-03-03T05:00:00.000Z",
 *                "2015-03-04T05:00:00.000Z",
 *                "2015-03-05T05:00:00.000Z",
 *                "2015-03-06T05:00:00.000Z",
 *                "2015-03-07T05:00:00.000Z",
 *                "2015-03-08T05:00:00.000Z",
 *                "2015-03-09T05:00:00.000Z",
 *                "2015-03-10T05:00:00.000Z",
 *                "2015-03-11T05:00:00.000Z",
 *                "2015-03-12T05:00:00.000Z",
 *                "2015-03-13T05:00:00.000Z",
 *                "2015-03-14T05:00:00.000Z",
 *                "2015-03-15T05:00:00.000Z",
 *                "2015-03-16T05:00:00.000Z",
 *                "2015-03-17T05:00:00.000Z",
 *                "2015-03-18T05:00:00.000Z",
 *                "2015-03-19T05:00:00.000Z",
 *                "2015-03-20T05:00:00.000Z",
 *                "2015-03-21T05:00:00.000Z",
 *                "2015-03-22T05:00:00.000Z",
 *                "2015-03-23T05:00:00.000Z",
 *                "2015-03-24T05:00:00.000Z",
 *                "2015-03-25T05:00:00.000Z",
 *                "2015-03-26T05:00:00.000Z",
 *                "2015-03-27T05:00:00.000Z",
 *                "2015-03-28T05:00:00.000Z",
 *                "2015-03-29T05:00:00.000Z",
 *                "2015-03-30T05:00:00.000Z",
 *                "2015-03-31T05:00:00.000Z",
 *                "2015-04-01T05:00:00.000Z",
 *                "2015-04-02T05:00:00.000Z",
 *                "2015-04-03T05:00:00.000Z",
 *                "2015-04-04T05:00:00.000Z",
 *                "2015-04-05T05:00:00.000Z",
 *                "2015-04-06T05:00:00.000Z",
 *                "2015-04-07T05:00:00.000Z",
 *                "2015-04-08T05:00:00.000Z",
 *                "2015-04-09T05:00:00.000Z",
 *                "2015-04-10T05:00:00.000Z",
 *                "2015-04-11T05:00:00.000Z",
 *                "2015-04-12T05:00:00.000Z",
 *                "2015-04-13T05:00:00.000Z",
 *                "2015-04-14T05:00:00.000Z",
 *                "2015-04-15T05:00:00.000Z",
 *                "2015-04-16T05:00:00.000Z",
 *                "2015-04-17T05:00:00.000Z",
 *                "2015-04-18T05:00:00.000Z",
 *                "2015-04-19T05:00:00.000Z",
 *                "2015-04-20T05:00:00.000Z",
 *                "2015-04-21T05:00:00.000Z",
 *                "2015-04-22T05:00:00.000Z",
 *                "2015-04-23T05:00:00.000Z",
 *                "2015-04-24T05:00:00.000Z",
 *                "2015-04-25T05:00:00.000Z",
 *                "2015-04-26T05:00:00.000Z",
 *                "2015-04-27T05:00:00.000Z",
 *                "2015-04-28T05:00:00.000Z",
 *                "2015-04-29T05:00:00.000Z",
 *                "2015-04-30T05:00:00.000Z",
 *                "2015-05-01T05:00:00.000Z",
 *                "2015-05-02T05:00:00.000Z",
 *                "2015-05-03T05:00:00.000Z",
 *                "2015-05-04T05:00:00.000Z",
 *                "2015-05-05T05:00:00.000Z",
 *                "2015-05-06T05:00:00.000Z",
 *                "2015-05-07T05:00:00.000Z",
 *                "2015-05-08T05:00:00.000Z",
 *                "2015-05-09T05:00:00.000Z",
 *                "2015-05-10T05:00:00.000Z",
 *                "2015-05-11T05:00:00.000Z",
 *                "2015-05-12T05:00:00.000Z",
 *                "2015-05-13T05:00:00.000Z",
 *                "2015-05-14T05:00:00.000Z",
 *                "2015-05-15T05:00:00.000Z",
 *                "2015-05-16T05:00:00.000Z",
 *                "2015-05-17T05:00:00.000Z",
 *                "2015-05-18T05:00:00.000Z",
 *                "2015-05-19T05:00:00.000Z",
 *                "2015-05-20T05:00:00.000Z",
 *                "2015-05-21T05:00:00.000Z",
 *                "2015-05-22T05:00:00.000Z",
 *                "2015-05-23T05:00:00.000Z",
 *                "2015-05-24T05:00:00.000Z",
 *                "2015-05-25T05:00:00.000Z",
 *                "2015-05-26T05:00:00.000Z",
 *                "2015-05-27T05:00:00.000Z",
 *                "2015-05-28T05:00:00.000Z",
 *                "2015-05-29T05:00:00.000Z",
 *                "2015-05-30T05:00:00.000Z",
 *                "2015-05-31T05:00:00.000Z",
 *                "2015-06-01T05:00:00.000Z",
 *                "2015-06-02T05:00:00.000Z",
 *                "2015-06-03T05:00:00.000Z",
 *                "2015-06-04T05:00:00.000Z",
 *                "2015-06-05T05:00:00.000Z",
 *                "2015-06-06T05:00:00.000Z",
 *                "2015-06-07T05:00:00.000Z",
 *                "2015-06-08T05:00:00.000Z",
 *                "2015-06-09T05:00:00.000Z",
 *                "2015-06-10T05:00:00.000Z",
 *                "2015-06-11T05:00:00.000Z",
 *                "2015-06-12T05:00:00.000Z",
 *                "2015-06-13T05:00:00.000Z",
 *                "2015-06-14T05:00:00.000Z",
 *                "2015-06-15T05:00:00.000Z",
 *                "2015-06-16T05:00:00.000Z",
 *                "2015-06-17T05:00:00.000Z",
 *                "2015-06-18T05:00:00.000Z",
 *                "2015-06-19T05:00:00.000Z",
 *                "2015-06-20T05:00:00.000Z",
 *                "2015-06-21T05:00:00.000Z",
 *                "2015-06-22T05:00:00.000Z",
 *                "2015-06-23T05:00:00.000Z",
 *                "2015-06-24T05:00:00.000Z",
 *                "2015-06-25T05:00:00.000Z",
 *                "2015-06-26T05:00:00.000Z",
 *                "2015-06-27T05:00:00.000Z",
 *                "2015-06-28T05:00:00.000Z",
 *                "2015-06-29T05:00:00.000Z",
 *                "2015-06-30T05:00:00.000Z",
 *                "2015-07-01T05:00:00.000Z",
 *                "2015-07-02T05:00:00.000Z",
 *                "2015-07-03T05:00:00.000Z",
 *                "2015-07-04T05:00:00.000Z",
 *                "2015-07-05T05:00:00.000Z",
 *                "2015-07-06T05:00:00.000Z",
 *                "2015-07-07T05:00:00.000Z",
 *                "2015-07-08T05:00:00.000Z",
 *                "2015-07-09T05:00:00.000Z",
 *                "2015-07-10T05:00:00.000Z",
 *                "2015-07-11T05:00:00.000Z",
 *                "2015-07-12T05:00:00.000Z",
 *                "2015-07-13T05:00:00.000Z",
 *                "2015-07-14T05:00:00.000Z",
 *                "2015-07-15T05:00:00.000Z",
 *                "2015-07-16T05:00:00.000Z",
 *                "2015-07-17T05:00:00.000Z",
 *                "2015-07-18T05:00:00.000Z",
 *                "2015-07-19T05:00:00.000Z",
 *                "2015-07-20T05:00:00.000Z",
 *                "2015-07-21T05:00:00.000Z",
 *                "2015-07-22T05:00:00.000Z",
 *                "2015-07-23T05:00:00.000Z",
 *                "2015-07-24T05:00:00.000Z",
 *                "2015-07-25T05:00:00.000Z",
 *                "2015-07-26T05:00:00.000Z",
 *                "2015-07-27T05:00:00.000Z",
 *                "2015-07-28T05:00:00.000Z",
 *                "2015-07-29T05:00:00.000Z",
 *                "2015-07-30T05:00:00.000Z",
 *                "2015-07-31T05:00:00.000Z",
 *                "2015-08-01T05:00:00.000Z",
 *                "2015-08-02T05:00:00.000Z",
 *                "2015-08-03T05:00:00.000Z",
 *                "2015-08-04T05:00:00.000Z",
 *                "2015-08-05T05:00:00.000Z",
 *                "2015-08-06T05:00:00.000Z",
 *                "2015-08-07T05:00:00.000Z",
 *                "2015-08-08T05:00:00.000Z",
 *                "2015-08-09T05:00:00.000Z",
 *                "2015-08-10T05:00:00.000Z",
 *                "2015-08-11T05:00:00.000Z",
 *                "2015-08-12T05:00:00.000Z",
 *                "2015-08-13T05:00:00.000Z",
 *                "2015-08-14T05:00:00.000Z",
 *                "2015-08-15T05:00:00.000Z",
 *                "2015-08-16T05:00:00.000Z",
 *                "2015-08-17T05:00:00.000Z",
 *                "2015-08-18T05:00:00.000Z",
 *                "2015-08-19T05:00:00.000Z",
 *                "2015-08-20T05:00:00.000Z",
 *                "2015-08-21T05:00:00.000Z",
 *                "2015-08-22T05:00:00.000Z",
 *                "2015-08-23T05:00:00.000Z",
 *                "2015-08-24T05:00:00.000Z",
 *                "2015-08-25T05:00:00.000Z",
 *                "2015-08-26T05:00:00.000Z",
 *                "2015-08-27T05:00:00.000Z",
 *                "2015-08-28T05:00:00.000Z"
 *            ],
 *            "series": [
 *                13.7749375,
 *                5.553486726,
 *                3.55002748,
 *                4.653243206999999,
 *                14.216218631,
 *                15.621615834,
 *                9.607597035000001,
 *                8.969997472,
 *                16.140701754,
 *                15.921598898000001,
 *                4.2812354610000005,
 *                13.944019358,
 *                16.214935957,
 *                9.333247088,
 *                15.358389379999998,
 *                15.006398072,
 *                16.022882237999998,
 *                16.268424779,
 *                14.950239174999998,
 *                15.258241071999999,
 *                15.896458779000001,
 *                10.386768515,
 *                15.72045094,
 *                15.912077784000001,
 *                2.0852365319999997,
 *                10.764539823,
 *                15.846837525000002,
 *                16.514266263,
 *                2.73322807,
 *                16.907350878,
 *                4.682112358,
 *                2.728104254,
 *                19.607654324,
 *                17.056424234999998,
 *                16.54156732,
 *                17.475002125,
 *                16.715280701,
 *                16.852780702,
 *                16.538966465,
 *                4.250919655,
 *                18.661675439,
 *                7.649037531,
 *                20.833433628999998,
 *                18.739415696000002,
 *                17.737866868999998,
 *                6.912991227999999,
 *                0.096976169,
 *                0.7052017540000001,
 *                1.635663717,
 *                1.813266883,
 *                0.8205398230000001,
 *                13.008256638,
 *                18.736650287,
 *                20.286791104,
 *                20.074306940000003,
 *                17.981814159000002,
 *                7.742283185999999,
 *                20.713672567,
 *                9.171276233,
 *                0.026236842000000003,
 *                1.0076405789999998,
 *                3.160647674,
 *                2.684932341,
 *                21.809557437000002,
 *                20.614684211,
 *                19.675136995,
 *                19.643189269,
 *                16.154616152,
 *                8.523858831,
 *                18.928369353,
 *                20.978420827,
 *                2.804192982,
 *                15.964781234999998,
 *                20.185309306000004,
 *                19.809312296,
 *                19.914370339,
 *                12.400973685,
 *                13.765684211,
 *                20.654849478,
 *                19.6300569,
 *                18.848382427,
 *                18.440712467,
 *                7.508848215000001,
 *                20.230442004,
 *                20.980348214000003,
 *                17.819197252,
 *                21.691817391999997,
 *                18.250929825,
 *                21.024425167,
 *                21.072511877,
 *                20.476044247999997,
 *                21.615902655,
 *                13.209620012,
 *                21.550812128,
 *                20.490151869,
 *                8.910875948000001,
 *                13.583709467,
 *                10.676300884999998,
 *                20.209708202,
 *                21.728686727,
 *                21.101704239,
 *                13.651304301,
 *                18.345911504,
 *                19.002345133000002,
 *                19.712452707999997,
 *                20.608530274,
 *                21.133841801,
 *                12.021412746,
 *                13.86725,
 *                15.528149122999999,
 *                17.188965217999996,
 *                21.981753377,
 *                21.708330150000002,
 *                16.931043860000003,
 *                15.342517543999998,
 *                21.890649123,
 *                21.115932495000003,
 *                21.911799720999998,
 *                22.210174142999996,
 *                21.908043860000003,
 *                21.561626144999998,
 *                21.077982455999997,
 *                21.142594126,
 *                20.279736842,
 *                21.600694069,
 *                21.440953655999998,
 *                17.967150442999998,
 *                10.978035087,
 *                11.187627620999999,
 *                19.385368964,
 *                21.434173303,
 *                22.109999690000002,
 *                21.798298245999998,
 *                18.343940885,
 *                21.488168142,
 *                15.769526316,
 *                21.240982455999998,
 *                21.650125368,
 *                21.829198183,
 *                3.9609384409999997,
 *                21.588901600999996,
 *                19.904274336,
 *                21.768857143,
 *                20.316557522000004,
 *                21.366157895,
 *                19.520268574000003,
 *                21.60675,
 *                20.443692982,
 *                19.798254386,
 *                11.241966154,
 *                10.074097344999998,
 *                11.225688133,
 *                21.789677526,
 *                20.544632427,
 *                12.061911582999999,
 *                21.787035399,
 *                21.489999161,
 *                21.234390236,
 *                21.05031434,
 *                21.336000001,
 *                20.268183667,
 *                20.791707704,
 *                20.69768421,
 *                18.476034858,
 *                19.954487532999998,
 *                20.641699114999998,
 *                18.634946127000003,
 *                9.861008771,
 *                8.124931999000001,
 *                8.415053098,
 *                20.640823463,
 *                20.547984896,
 *                18.361271929999997,
 *                20.356610976,
 *                20.489891457000002,
 *                19.864400404,
 *                16.553923035,
 *                20.611649123000003,
 *                21.605365217,
 *                20.767679773,
 *                13.832533264000002,
 *                19.040542944000002,
 *                19.528278262,
 *                19.138223264,
 *                19.148902654999997,
 *                19.403157666,
 *                17.567127887,
 *                8.638446592000001,
 *                4.911371682,
 *                21.573843479,
 *                12.850584624,
 *                19.751843478,
 *                19.238546887000002,
 *                19.581902669999998,
 *                19.294172081999996,
 *                19.108611746999998,
 *                20.26972479,
 *                19.493793103,
 *                17.963836207,
 *                14.996634761999998,
 *                14.988157895,
 *                19.271251825,
 *                20.352420627,
 *                21.546834782999998,
 *                19.632771930000004,
 *                17.843657948,
 *                18.586702441,
 *                21.064307247000002,
 *                18.61072807,
 *                20.224185063999997,
 *                20.174243477999998,
 *                19.792679231,
 *                20.258759878,
 *                19.572627688,
 *                19.812876106,
 *                18.726904347,
 *                21.079376883000002,
 *                18.108788854,
 *                19.476662624,
 *                18.875122808,
 *                17.879701754000003,
 *                20.411004501,
 *                21.335976837,
 *                20.969086497999996,
 *                21.047789473999998,
 *                19.014585812999997,
 *                19.328763157,
 *                19.607289474,
 *                20.643597864,
 *                19.617617392,
 *                17.128719298,
 *                18.330203308,
 *                18.233150443,
 *                16.333561015,
 *                17.022097346,
 *                18.881356827,
 *                18.716848471,
 *                18.598628552,
 *                16.471163885,
 *                10.161341204000001
 *            ]
 *        },
 *        "facilityImage": "https://cdn.brightergy.com/FacilityAssets/image/sIwHdsgd2nWKniO9.jpg"
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
 *
 */

 /**
 * @api {get} assurf:solarenergygenerationdrilldown Get Solar Generation Drilldown data
 * @apiGroup Analyze Solar Surface
 * @apiName Get Solar Generation Drilldown data
 * @apiVersion 1.0.0
 * @apiDescription Get Solar Generation Drilldown data
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example
 * {
 *     "success": 1,
 *     "message": {
 *         "totalSaving": 10322.057924934854,
 *         "totalProduction": 103220.57924934883,
 *         "totalProductionBySources": {
 *             "55d60385c63da8e403d76237": {
 *                 "kwh": 85011.54803191438,
 *                 "name": "Helix Architecture"
 *             },
 *             "55d60388c63da8e403d7774c": {
 *                 "kwh": 18209.031217434425,
 *                 "name": "3-8 Campus"
 *             }
 *         },
 *         "candlestick": {
 *             "series": {
 *                 "type": "candlestick",
 *                 "name": "Candlestick Chart",
 *                 "data": [{
 *                     "timestamp": "2012-12-31T06:00:00.000Z",
 *                     "initial": 7.763000000000001,
 *                     "minimum": 0.44599999999999995,
 *                     "minimumTimestamp": "2012-12-31T06:00:00.000Z",
 *                     "maximum": 72.04299999999999,
 *                     "maximumTimestamp": "2012-11-06T06:00:00.000Z",
 *                     "final": 0.44599999999999995,
 *                     "type": "year"
 *                 }, {
 *                     "timestamp": "2013-12-31T06:00:00.000Z",
 *                     "initial": 0.65,
 *                     "minimum": 0,
 *                     "minimumTimestamp": "2013-02-28T06:00:00.000Z",
 *                     "maximum": 162.46300000000002,
 *                     "maximumTimestamp": "2013-05-11T05:00:00.000Z",
 *                     "final": 43.876,
 *                     "type": "year"
 *                 }, {
 *                     "timestamp": "2014-01-31T06:00:00.000Z",
 *                     "initial": 20.445,
 *                     "minimum": 0.132,
 *                     "minimumTimestamp": "2014-01-05T06:00:00.000Z",
 *                     "maximum": 82.364,
 *                     "maximumTimestamp": "2014-01-29T06:00:00.000Z",
 *                     "final": 7.477,
 *                     "type": "month"
 *                 }, {
 *                     "timestamp": "2014-02-28T06:00:00.000Z",
 *                     "initial": 1.1700000000000002,
 *                     "minimum": 0.042,
 *                     "minimumTimestamp": "2014-02-10T06:00:00.000Z",
 *                     "maximum": 128.506,
 *                     "maximumTimestamp": "2014-02-26T06:00:00.000Z",
 *                     "final": 70.628,
 *                     "type": "month"
 *                 }, {
 *                     "timestamp": "2014-03-31T05:00:00.000Z",
 *                     "initial": 15.815999999999999,
 *                     "minimum": 0.324,
 *                     "minimumTimestamp": "2014-03-02T06:00:00.000Z",
 *                     "maximum": 151.291,
 *                     "maximumTimestamp": "2014-03-25T05:00:00.000Z",
 *                     "final": 117.88499999999999,
 *                     "type": "month"
 *                 }, {
 *                     "timestamp": "2014-04-30T05:00:00.000Z",
 *                     "initial": 93.407,
 *                     "minimum": 20.43,
 *                     "minimumTimestamp": "2014-04-29T05:00:00.000Z",
 *                     "maximum": 152.5,
 *                     "maximumTimestamp": "2014-04-15T05:00:00.000Z",
 *                     "final": 71.555,
 *                     "type": "month"
 *                 }, {
 *                     "timestamp": "2014-05-31T05:00:00.000Z",
 *                     "initial": 44.482,
 *                     "minimum": 27.863999999999997,
 *                     "minimumTimestamp": "2014-05-12T05:00:00.000Z",
 *                     "maximum": 151.466,
 *                     "maximumTimestamp": "2014-05-09T05:00:00.000Z",
 *                     "final": 35.481,
 *                     "type": "month"
 *                 }, {
 *                     "timestamp": "2014-06-30T05:00:00.000Z",
 *                     "initial": 36.697,
 *                     "minimum": 23.567999999999998,
 *                     "minimumTimestamp": "2014-06-10T05:00:00.000Z",
 *                     "maximum": 165.298,
 *                     "maximumTimestamp": "2014-06-13T05:00:00.000Z",
 *                     "final": 138.213,
 *                     "type": "month"
 *                 }, {
 *                     "timestamp": "2014-07-31T05:00:00.000Z",
 *                     "initial": 131.608,
 *                     "minimum": 56.794,
 *                     "minimumTimestamp": "2014-07-05T05:00:00.000Z",
 *                     "maximum": 159.619,
 *                     "maximumTimestamp": "2014-07-03T05:00:00.000Z",
 *                     "final": 107.46799999999999,
 *                     "type": "month"
 *                 }, {
 *                     "timestamp": "2014-08-31T05:00:00.000Z",
 *                     "initial": 112.66999999999999,
 *                     "minimum": 52.141,
 *                     "minimumTimestamp": "2014-08-15T05:00:00.000Z",
 *                     "maximum": 140.80700000000002,
 *                     "maximumTimestamp": "2014-08-12T05:00:00.000Z",
 *                     "final": 121.20400000000001,
 *                     "type": "month"
 *                 }, {
 *                     "timestamp": "2014-09-30T05:00:00.000Z",
 *                     "initial": 81.06099999999999,
 *                     "minimum": 26.503999999999998,
 *                     "minimumTimestamp": "2014-09-15T05:00:00.000Z",
 *                     "maximum": 139.284,
 *                     "maximumTimestamp": "2014-09-13T05:00:00.000Z",
 *                     "final": 112.03399999999999,
 *                     "type": "month"
 *                 }, {
 *                     "timestamp": "2014-10-31T05:00:00.000Z",
 *                     "initial": 59.088,
 *                     "minimum": 9.001999999999999,
 *                     "minimumTimestamp": "2014-10-13T05:00:00.000Z",
 *                     "maximum": 119.595,
 *                     "maximumTimestamp": "2014-10-04T05:00:00.000Z",
 *                     "final": 97.84800000000001,
 *                     "type": "month"
 *                 }, {
 *                     "timestamp": "2014-11-30T06:00:00.000Z",
 *                     "initial": 94.316,
 *                     "minimum": 7.817,
 *                     "minimumTimestamp": "2014-11-23T06:00:00.000Z",
 *                     "maximum": 94.316,
 *                     "maximumTimestamp": "2014-11-01T05:00:00.000Z",
 *                     "final": 29.646,
 *                     "type": "month"
 *                 }, {
 *                     "timestamp": "2014-12-31T06:00:00.000Z",
 *                     "initial": 51.676,
 *                     "minimum": 0.014,
 *                     "minimumTimestamp": "2014-12-19T06:00:00.000Z",
 *                     "maximum": 51.676,
 *                     "maximumTimestamp": "2014-12-01T06:00:00.000Z",
 *                     "final": 45.887,
 *                     "type": "month"
 *                 }, {
 *                     "timestamp": "2015-01-31T06:00:00.000Z",
 *                     "initial": 38.803,
 *                     "minimum": 7.228999999999999,
 *                     "minimumTimestamp": "2015-01-31T06:00:00.000Z",
 *                     "maximum": 72.749,
 *                     "maximumTimestamp": "2015-01-26T06:00:00.000Z",
 *                     "final": 7.228999999999999,
 *                     "type": "month"
 *                 }, {
 *                     "timestamp": "2015-02-28T06:00:00.000Z",
 *                     "initial": 1.6460000000000004,
 *                     "minimum": 1.329,
 *                     "minimumTimestamp": "2015-02-16T06:00:00.000Z",
 *                     "maximum": 127.251,
 *                     "maximumTimestamp": "2015-02-26T06:00:00.000Z",
 *                     "final": 10.993,
 *                     "type": "month"
 *                 }, {
 *                     "timestamp": "2015-03-31T05:00:00.000Z",
 *                     "initial": 16.325000000000003,
 *                     "minimum": 0,
 *                     "minimumTimestamp": "2015-03-31T05:00:00.000Z",
 *                     "maximum": 131.215,
 *                     "maximumTimestamp": "2015-03-05T06:00:00.000Z",
 *                     "final": 0,
 *                     "type": "month"
 *                 }, {
 *                     "timestamp": "2015-04-30T05:00:00.000Z",
 *                     "initial": 0,
 *                     "minimum": 9.696,
 *                     "minimumTimestamp": "2015-04-08T05:00:00.000Z",
 *                     "maximum": 148.17444858201668,
 *                     "maximumTimestamp": "2015-04-30T05:00:00.000Z",
 *                     "final": 148.17444858201668,
 *                     "type": "month"
 *                 }, {
 *                     "timestamp": "2015-05-31T05:00:00.000Z",
 *                     "initial": 122.85127891386668,
 *                     "minimum": 46.71200598208333,
 *                     "minimumTimestamp": "2015-05-20T05:00:00.000Z",
 *                     "maximum": 327.89143509191666,
 *                     "maximumTimestamp": "2015-05-12T05:00:00.000Z",
 *                     "final": 210.83521728000002,
 *                     "type": "month"
 *                 }, {
 *                     "timestamp": "2015-06-30T05:00:00.000Z",
 *                     "initial": 120.5137102075,
 *                     "minimum": 56.201010037500005,
 *                     "minimumTimestamp": "2015-06-23T05:00:00.000Z",
 *                     "maximum": 312.29561614091665,
 *                     "maximumTimestamp": "2015-06-08T05:00:00.000Z",
 *                     "final": 196.22696350075,
 *                     "type": "month"
 *                 }, {
 *                     "timestamp": "2015-07-31T05:00:00.000Z",
 *                     "initial": 201.14265078725,
 *                     "minimum": 50.48243470191666,
 *                     "minimumTimestamp": "2015-07-02T05:00:00.000Z",
 *                     "maximum": 293.334316693,
 *                     "maximumTimestamp": "2015-07-17T05:00:00.000Z",
 *                     "final": 289.2474637334166,
 *                     "type": "month"
 *                 }, {
 *                     "timestamp": "2015-08-31T05:00:00.000Z",
 *                     "initial": 236.2595012120833,
 *                     "minimum": 78.20043839141665,
 *                     "minimumTimestamp": "2015-08-05T05:00:00.000Z",
 *                     "maximum": 284.5846975409167,
 *                     "maximumTimestamp": "2015-08-02T05:00:00.000Z",
 *                     "final": 235.66963125333334,
 *                     "type": "month"
 *                 }, {
 *                     "timestamp": "2015-09-30T05:00:00.000Z",
 *                     "initial": 237.198902826,
 *                     "minimum": 71.57394610633332,
 *                     "minimumTimestamp": "2015-09-18T05:00:00.000Z",
 *                     "maximum": 260.71059431,
 *                     "maximumTimestamp": "2015-09-11T05:00:00.000Z",
 *                     "final": 228.52481998874998,
 *                     "type": "month"
 *                 }, {
 *                     "timestamp": "2015-10-31T05:00:00.000Z",
 *                     "initial": 226.93096792691665,
 *                     "minimum": 24.3843532805,
 *                     "minimumTimestamp": "2015-10-27T05:00:00.000Z",
 *                     "maximum": 230.45826930683336,
 *                     "maximumTimestamp": "2015-10-02T05:00:00.000Z",
 *                     "final": 62.51641501575,
 *                     "type": "month"
 *                 }, {
 *                     "timestamp": "2015-11-19T06:00:00.000Z",
 *                     "initial": 164.0876277474167,
 *                     "minimum": 7.89960954375,
 *                     "minimumTimestamp": "2015-11-17T06:00:00.000Z",
 *                     "maximum": 164.0876277474167,
 *                     "maximumTimestamp": "2015-11-01T05:00:00.000Z",
 *                     "final": 137.80767022099997,
 *                     "type": "month"
 *                 }]
 *             }
 *         },
 *         "dateRange": "total",
 *         "selectedYear": null
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
 *
 */

 /**
 ** @api {get} assurf:weatherhistory Get Weather History data
 * @apiGroup Analyze Solar Surface
 * @apiName Get Weather History data
 * @apiVersion 1.0.0
 * @apiDescription Get Weather History data
 * @apiSuccess (all) success 1
 * @apiSuccess (all) message Object
 * @apiSuccessExample Success example
 * {
 *    "success": 1,
 *    "message": {
 *        "history": [
 *            {
 *                "temperatureMin": 23.2,
 *                "pressure": 1028.96,
 *                "windBearing": 245,
 *                "humidity": 0.54,
 *                "windSpeed": 8.33,
 *                "sunriseTime": 1420118450,
 *                "sunsetTime": 1420152735,
 *                "temperatureMax": 38.86,
 *                "icon": "clear-day",
 *                "time": 1420070400,
 *                "date": "2015-01-01T00:00:00.000Z",
 *                "sunriseDate": "2015-01-01T13:20:50.000Z",
 *                "sunsetDate": "2015-01-01T22:52:15.000Z",
 *                "city": "Manchester"
 *            },
 *            {
 *                "temperatureMin": 33.8,
 *                "pressure": 1024.72,
 *                "windBearing": 248,
 *                "humidity": 0.77,
 *                "windSpeed": 6.16,
 *                "sunriseTime": 1420204857,
 *                "sunsetTime": 1420239182,
 *                "temperatureMax": 39.29,
 *                "icon": "rain",
 *                "time": 1420156800,
 *                "date": "2015-01-02T00:00:00.000Z",
 *                "sunriseDate": "2015-01-02T13:20:57.000Z",
 *                "sunsetDate": "2015-01-02T22:53:02.000Z",
 *                "city": "Manchester"
 *            },
 *            {
 *                "temperatureMin": 36.35,
 *                "pressure": 1018.63,
 *                "windBearing": 112,
 *                "humidity": 0.95,
 *                "windSpeed": 6.66,
 *                "sunriseTime": 1420291262,
 *                "sunsetTime": 1420325632,
 *                "temperatureMax": 41.91,
 *                "icon": "rain",
 *                "time": 1420243200,
 *                "date": "2015-01-03T00:00:00.000Z",
 *                "sunriseDate": "2015-01-03T13:21:02.000Z",
 *                "sunsetDate": "2015-01-03T22:53:52.000Z",
 *                "city": "Manchester"
 *            },
 *            {
 *                "temperatureMin": 16.11,
 *                "pressure": 1010.33,
 *                "windBearing": 265,
 *                "humidity": 0.94,
 *                "windSpeed": 5.01,
 *                "sunriseTime": 1420377665,
 *                "sunsetTime": 1420412082,
 *                "temperatureMax": 39.14,
 *                "icon": "cloudy",
 *                "time": 1420329600,
 *                "date": "2015-01-04T00:00:00.000Z",
 *                "sunriseDate": "2015-01-04T13:21:05.000Z",
 *                "sunsetDate": "2015-01-04T22:54:42.000Z",
 *                "city": "Manchester"
 *            },
 *            {
 *                "temperatureMin": 12.58,
 *                "pressure": 1039.65,
 *                "windBearing": 319,
 *                "humidity": 0.58,
 *                "windSpeed": 9.63,
 *                "sunriseTime": 1420464066,
 *                "sunsetTime": 1420498534,
 *                "temperatureMax": 25.51,
 *                "icon": "clear-day",
 *                "time": 1420416000,
 *                "date": "2015-01-05T00:00:00.000Z",
 *                "sunriseDate": "2015-01-05T13:21:06.000Z",
 *                "sunsetDate": "2015-01-05T22:55:34.000Z",
 *                "city": "Manchester"
 *            },
 *            {
 *                "temperatureMin": 23.58,
 *                "pressure": 1025.63,
 *                "windBearing": 201,
 *                "humidity": 0.58,
 *                "windSpeed": 6.57,
 *                "sunriseTime": 1420550465,
 *                "sunsetTime": 1420584987,
 *                "temperatureMax": 28.91,
 *                "icon": "partly-cloudy-day",
 *                "time": 1420502400,
 *                "date": "2015-01-06T00:00:00.000Z",
 *                "sunriseDate": "2015-01-06T13:21:05.000Z",
 *                "sunsetDate": "2015-01-06T22:56:27.000Z",
 *                "city": "Manchester"
 *            },
 *            {
 *                "temperatureMin": 3.73,
 *                "pressure": 1032.3,
 *                "windBearing": 302,
 *                "humidity": 0.82,
 *                "windSpeed": 9.64,
 *                "sunriseTime": 1420636862,
 *                "sunsetTime": 1420671442,
 *                "temperatureMax": 21.22,
 *                "icon": "snow",
 *                "time": 1420588800,
 *                "date": "2015-01-07T00:00:00.000Z",
 *                "sunriseDate": "2015-01-07T13:21:02.000Z",
 *                "sunsetDate": "2015-01-07T22:57:22.000Z",
 *                "city": "Manchester"
 *            },
 *            {
 *                "temperatureMin": 2.17,
 *                "pressure": 1045.55,
 *                "windBearing": 323,
 *                "humidity": 0.62,
 *                "windSpeed": 6.37,
 *                "sunriseTime": 1420723257,
 *                "sunsetTime": 1420757898,
 *                "temperatureMax": 30.62,
 *                "icon": "clear-day",
 *                "time": 1420675200,
 *                "date": "2015-01-08T00:00:00.000Z",
 *                "sunriseDate": "2015-01-08T13:20:57.000Z",
 *                "sunsetDate": "2015-01-08T22:58:18.000Z",
 *                "city": "Manchester"
 *            },
 *            {
 *                "temperatureMin": 11.93,
 *                "pressure": 1022.19,
 *                "windBearing": 301,
 *                "humidity": 0.56,
 *                "windSpeed": 15.41,
 *                "sunriseTime": 1420809649,
 *                "sunsetTime": 1420844355,
 *                "temperatureMax": 31.2,
 *                "icon": "cloudy",
 *                "time": 1420761600,
 *                "date": "2015-01-09T00:00:00.000Z",
 *                "sunriseDate": "2015-01-09T13:20:49.000Z",
 *                "sunsetDate": "2015-01-09T22:59:15.000Z",
 *                "city": "Manchester"
 *            },
 *            {
 *                "temperatureMin": 6.98,
 *                "pressure": 1036.64,
 *                "windBearing": 277,
 *                "humidity": 0.66,
 *                "windSpeed": 2.82,
 *                "sunriseTime": 1420896040,
 *                "sunsetTime": 1420930813,
 *                "temperatureMax": 33.13,
 *                "icon": "clear-day",
 *                "time": 1420848000,
 *                "date": "2015-01-10T00:00:00.000Z",
 *                "sunriseDate": "2015-01-10T13:20:40.000Z",
 *                "sunsetDate": "2015-01-10T23:00:13.000Z",
 *                "city": "Manchester"
 *            }
 *        ]
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
 *
 */

 /**
 * @api {get} assurf:weatherhistory Request Weather History data
 * @apiGroup Analyze Solar Surface
 * @apiName Request Weather data
 * @apiVersion 1.0.0
 * @apiDescription Request Weather data
 * @apiParam {Object} body Request data
 * @apiExample Example request
 * {
 *    "socketId": "HLGSaxqhhgZeZvDCAAAA",
 *    "dateRange": {
 *        "from": "2015-01-01",
 *        "to": "2015-01-10"
 *    }
 *}
 *
 */

 /**
 * @api {get} assurf:inputfacilitydrilldown Request Facility Drilldown data
 * @apiGroup Analyze Solar Surface
 * @apiName Request Facility Drilldown data
 * @apiVersion 1.0.0
 * @apiDescription Request Facility Drilldown data
 * @apiParam {Object} body Request data
 * @apiExample Example request
 * {
 *    "socketId": "HLGSaxqhhgZeZvDCAAAA",
 *    "inspectedFacility": "549012531e94a8881e6e8e54",
 *    "energyYear": 2015
 *}
 *
 */

 /**
 * @api {get} assurf:getsolarenergygeneration Request Solar Energy Generation data
 * @apiGroup Analyze Solar Surface
 * @apiName Request Solar Energy Generation data
 * @apiVersion 1.0.0
 * @apiDescription Request Solar Energy Generation data <br/>
 * Allowed dateRange is "total", "year", "month", "week"  <br/>
 * year is optional number. If it is not null, dateRange will be ignored and data for year will be loaded. <br/>
 * month is optional number from 0 to 11. Can be used only WITH year. <br/>
 *     if month is not null, dateRange will be ignored and data for month will be loaded.
 * @apiParam {Object} body Request data
 * @apiExample Example request
 * {
 *    "socketId": "HLGSaxqhhgZeZvDCAAAA",
 *    "dateRange": "year",
 *    "year": 2015,
 *    "month": 10
 *}
 *
 */

 /**
 * @api {get} assurf:getsolarenergygenerationdrilldown Request Solar Energy Generation Drilldown data
 * @apiGroup Analyze Solar Surface
 * @apiName Request Solar Energy Generation Drilldown data
 * @apiVersion 1.0.0
 * @apiDescription Request Solar Energy Generation Drilldown data <br/>
 * Allowed dateRange is "total", "year" <br/>
 * year is optional number. If it is not null, dateRange will be ignored and data for year will be loaded.
 * @apiParam {Object} body Request data
 * @apiExample Example request
 * {
 *    "socketId": "HLGSaxqhhgZeZvDCAAAA",
 *    "dateRange": "year",
 *    "year": 2015
 *}
 *
 */

 /**
 * @api {get} assurf:getrealtimepower Request Real Time Power data
 * @apiGroup Analyze Solar Surface
 * @apiName Request Real Time Power data
 * @apiVersion 1.0.0
 * @apiDescription Request Real Time Power data <br/>
 * Allowed dateRange is "today", "month", "week"  <br/>
 * Day is optional number. If it is not null, dateRange will be ignored and data for day will be loaded.
 * @apiParam {Object} body Request data
 * @apiExample Example request
 * {
 *    "socketId": "HLGSaxqhhgZeZvDCAAAA",
 *    "dateRange": "year",
 *    "day": 2014-12-01T00:00:00.000Z
 *}
 *
 */

 /**
 * @api {get} assurf:getsavings Request Savings data
 * @apiGroup Analyze Solar Surface
 * @apiName Request Savings data
 * @apiVersion 1.0.0
 * @apiDescription Request Savings data <br/>
 * Allowed dateRange is "total", "year", "month", "week"  <br/>
 * Year is optional number. If it is not null, dateRange will be ignored and data for year will be loaded.
 * @apiParam {Object} body Request data
 * @apiExample Example request
 * {
 *    "socketId": "HLGSaxqhhgZeZvDCAAAA",
 *    "dateRange": "year",
 *    "Year": 2015
 *}
 *
 */

 /**
 * @api {get} assurf:gettotalenergygeneration Request Total Energy Generation data
 * @apiGroup Analyze Solar Surface
 * @apiName Request Total Energy Generation data
 * @apiVersion 1.0.0
 * @apiDescription Request Total Energy Generation data <br/>
 * Allowed dateRange is "total", "year", "month", "week"
 * @apiParam {Object} body Request data
 * @apiExample Example request
 * {
 *    "socketId": "HLGSaxqhhgZeZvDCAAAA",
 *    "dateRange": "year"
 *}
 *
 */

 /**
 * @api {get} assurf:getequivalencies Request Equivalencies data
 * @apiGroup Analyze Solar Surface
 * @apiName Request Equivalencies data
 * @apiVersion 1.0.0
 * @apiDescription Request Equivalencies data <br/>
 * Allowed dateRange is "total", "year", "month", "week"
 * @apiParam {Object} body Request data
 * @apiExample Example request
 * {
 *    "socketId": "HLGSaxqhhgZeZvDCAAAA",
 *    "dateRange": "year"
 *}
 *
 */

 /**
 * @api {get} assurf:getcarbonavoided Request Carbon Avoided data
 * @apiGroup Analyze Solar Surface
 * @apiName Request Carbon Avoided data
 * @apiVersion 1.0.0
 * @apiDescription Request Carbon Avoided data <br/>
 * Allowed dateRange is "total", "year", "month"
 * @apiParam {Object} body Request data
 * @apiExample Example request
 * {
 *    "socketId": "HLGSaxqhhgZeZvDCAAAA",
 *    "dateRange": "year"
 *}
 *
 */

 /**
 * @api {get} assurf:inputactualpredictedenergy Request Actual Predicted Energy data
 * @apiGroup Analyze Solar Surface
 * @apiName Request Actual Predicted Energy data
 * @apiVersion 1.0.0
 * @apiDescription Request Actual Predicted Energy data <br/>
 * Allowed dateRange is "total", "year" <br/>
 * Year is optional number. If it is not null, dateRange will be ignored and data for year will be loaded.
 * @apiParam {Object} body Request data
 * @apiExample Example request
 * {
 *    "socketId": "HLGSaxqhhgZeZvDCAAAA",
 *    "dateRange": "year",
 *    "year": 2015
 *}
 *
 */

 /**
 * @api {get} assurf:selectedsources Request using selected sources
 * @apiGroup Analyze Solar Surface
 * @apiName Request using selected sources
 * @apiVersion 1.0.0
 * @apiDescription Request using selected sources <br/>
 * Server will start loading data for all elements
 * @apiParam {Object} body Request data
 * @apiExample Example request
 * {
 *   "socketId": "HLGSaxqhhgZeZvDCAAAA",
 *   "selectedFacilities": [
 *       "549012531e94a8881e6e8e54"
 *   ],
 *   "selectedScopes": [],
 *   "selectedNodes": []
 * }
 *
 */

 /**
 * @api {get} assurf:viewertzoffset Request using client offset for converting time
 * @apiGroup Analyze Solar Surface
 * @apiName Request using client offset for converting time
 * @apiVersion 1.0.0
 * @apiDescription Request using client offset for converting time
 * @apiParam {Object} body Request data
 * @apiExample Example request
 * {
 *   "socketId": "HLGSaxqhhgZeZvDCAAAA",
 *   "viewerTZOffset": -300
 * }
 *
 */

