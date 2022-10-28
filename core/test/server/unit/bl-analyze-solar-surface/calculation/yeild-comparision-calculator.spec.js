"use strict";

const serverRoot = "../../../../../server";

var chai            = require("chai");
var expect          = chai.expect;
var moment          = require("moment");
var DateTimeUtils   = require(serverRoot + "/libs/date-time-utils");
var yieldComparator = require(serverRoot + "/bl-analyze-solar-surface/core/calculation/yield-comparision-calculator.js");

describe("assurf yield compararor", function() {
    describe("calculateDataInterval", function() {
        it("should return answer with necessary fields", function() {
            var init = moment("2015-01-01");
            var result = yieldComparator.calculateDataInterval(init, new DateTimeUtils(0, 0));
            expect(result).to.exist;
            expect(result).to.have.property("startDate");
            expect(result).to.have.property("endDate");
        });

        it("should two years period from given date", function() {
            var init = moment.utc("2015-01-01");
            var result = yieldComparator.calculateDataInterval(init, new DateTimeUtils(0, 0));
            expect(result.endDate.unix()).to.equal(moment.utc("2015-01-01").endOf("month").unix());
        });
    });

    describe("transformTempoiqResponse", function() {
        var inputData = {
            "dataPoints": [
                {
                    "ts": "2014-01-01T00:00:00.000Z",
                    "values": {
                        "WR8KU002:2002126708": {
                            "Pac": 1000
                        },
                        "WR7KU009:2002112342": {
                            "Pac": 2000
                        },
                        "WR7KU009:2002112282": {
                            "Pac": 3200
                        }
                    }
                },
                {
                    "ts": "2014-02-01T00:00:00.000Z",
                    "values": {
                        "WR8KU002:2002126708": {
                            "Pac": 3000
                        },
                        "WR7KU009:2002112342": {
                            "Pac": 4000
                        },
                        "WR7KU009:2002112282": {
                            "Pac": 5000
                        }
                    }
                },
                {
                    "ts": "2014-03-01T00:00:00.000Z",
                    "values": {
                        "WR8KU002:2002126708": {
                            "Pac": 6000
                        },
                        "WR7KU009:2002112342": {
                            "Pac": 7000
                        },
                        "WR7KU009:2002112282": {
                            "Pac": 8100
                        }
                    }
                },
                {
                    "ts": "2014-04-01T00:00:00.000Z",
                    "values": {
                        "WR8KU002:2002126708": {
                            "Pac": 9000
                        },
                        "WR7KU009:2002112342": {
                            "Pac": 10000
                        },
                        "Envoy:347894": {
                            "powr": 11000
                        },
                        "Envoy:416036": {
                            "powr": 12000
                        },
                        "Envoy:406326": {
                            "powr": 13000
                        },
                        "WR7KU009:2002112282": {
                            "Pac": 14000
                        }
                    }
                }
            ]
        };

        var nodeList = {
            "WR8KU002:2002126708": {
                rate: 1
            },
            "WR7KU009:2002112342": {
                rate: 1
            },
            "Envoy:347894": {
                rate: 1
            },
            "Envoy:416036": {
                "rate": 1
            },
            "Envoy:406326": {
                "rate": 1
            },
            "WR7KU009:2002112282": {
                "Pac": 1
            }
        };

        it("should return empty result on wrong input", function() {
            var result = yieldComparator.transformTempoiqResponse({}, null, nodeList);
            expect(result).a("object");
            expect(result).to.be.empty;
        });

        it("should aggrergagte data and sum by time", function() {

            var result = yieldComparator.transformTempoiqResponse(inputData, null, nodeList);
            expect(result).a("object");
            expect(result).to.have.property("Jan 14");
            expect(result["Jan 14"]).to.deep.equal({ energy: 6.2, cost: 6.2});
            expect(result).to.have.property("Feb 14");
            expect(result["Feb 14"]).to.deep.equal({ energy: 12, cost: 12});
            expect(result).to.have.property("Mar 14");
            expect(result["Mar 14"]).to.deep.equal({ energy: 21.1, cost: 21.1});
            expect(result).to.have.property("Apr 14");
            expect(result["Apr 14"]).to.deep.equal({ energy: 69, cost: 69});
        });

        var dailyInputData = {
            "dataPoints": [
                {
                    "ts": "2015-02-01T00:00:00.000Z",
                    "values": {
                        "WR8KU002:2002126708": {
                            "Pac": 1000
                        },
                        "WR7KU009:2002112342": {
                            "Pac": 1000
                        },
                        "Envoy:347894": {
                            "powr": 1000
                        },
                        "Envoy:416036": {
                            "powr": 1000
                        }
                    }
                },
                {
                    "ts": "2015-02-02T00:00:00.000Z",
                    "values": {
                        "WR8KU002:2002126708": {
                            "Pac": 2100
                        },
                        "WR7KU009:2002112342": {
                            "Pac": 2000
                        }
                    }
                },
                {
                    "ts": "2015-02-03T00:00:00.000Z",
                    "values": {
                        "Envoy:416036": {
                            "powr": 3000
                        },
                        "Envoy:415544": {
                            "powr": 3000
                        },
                        "Envoy:406326": {
                            "powr": 3000
                        },
                        "WR7KU009:2002112282": {
                            "Pac": 3100
                        }
                    }
                },
                {
                    "ts": "2015-02-04T00:00:00.000Z",
                    "values": {
                        "WR8KU002:2002126708": {
                            "Pac": 4000
                        },
                        "WR7KU009:2002112342": {
                            "Pac": 4000
                        },
                        "Envoy:347894": {
                            "powr": 4000
                        },
                        "Envoy:416036": {
                            "powr": 4000
                        }
                    }
                }
            ]
        };

        nodeList = {
            "WR8KU002:2002126708": {
                rate: 1
            },
            "WR7KU009:2002112342": {
                rate: 1
            },
            "Envoy:347894": {
                rate: 1
            },
            "Envoy:416036": {
                "rate": 1
            },
            "Envoy:406326": {
                "rate": 1
            },
            "WR7KU009:2002112282": {
                "rate": 1
            },
            "Envoy:415544": {
                "rate": 1
            },
        };

        it("should aggregate daily results", function() {
            var result = yieldComparator.transformTempoiqResponse(dailyInputData, function(ts) {
                return moment.utc(ts).format("DD-MM");
            }, nodeList);
            expect(result).a("object");
            expect(result).to.have.property("01-02");
            expect(result["01-02"]).to.deep.equal({energy: 4, cost: 4});
            expect(result).to.have.property("01-02");
            expect(result["02-02"]).to.deep.equal({energy: 4.1, cost: 4.1});
            expect(result).to.have.property("02-02");
            expect(result["03-02"]).to.deep.equal({energy: 12.1, cost: 12.1});
            expect(result).to.have.property("04-02");
            expect(result["04-02"]).to.deep.equal({energy: 16, cost: 16});
        });
    });
});
