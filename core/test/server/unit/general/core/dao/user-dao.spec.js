/* jshint expr: true */
/* jshint -W079 */

(function () {
    'use strict';

    var chai = require('chai'),
        expect = chai.expect,
        sinon = require('sinon'),
        serverRoot = '../../../../../../server',
        mongoose = require('mongoose'),
        consts = require(serverRoot + "/libs/consts"),
        cache = require(serverRoot + "/libs/cache");

    chai.use(require('sinon-chai'));

    describe('user-dao test suite', function () {

        require(serverRoot + "/general/models");

        var userDao = require(serverRoot + '/general/core/dao/user-dao');

        beforeEach(function () {
        });

        afterEach(function () {
            cache.end();
        });

        it('should filter solar nodes', function () {
            var tag = {
                tagType: consts.TAG_TYPE.Facility,
                name: "FacilityA",
                childTags: [{
                    _id: new mongoose.Schema.Types.ObjectId(),
                    tagType: consts.TAG_TYPE.Scope,
                    name: "ScopeA",
                    childTags: [{
                        _id: new mongoose.Schema.Types.ObjectId(),
                        tagType: consts.TAG_TYPE.Node,
                        name: "NodeA",
                        deviceID: "deviceA",
                        nodeType: consts.NODE_TYPE.Solar,
                        childTags: [{
                            tagType: consts.TAG_TYPE.Metric,
                            rate: 0.5,
                            name: consts.METRIC_NAMES.Reimbursement
                        }]
                    }]
                }]

            };

            var facilities = {
                scopes: []
            };
            var geo = {};

            userDao.findNodesByFacility(tag, tag.name, tag.timezone, facilities, null, geo,
                [consts.NODE_TYPE.Solar]);

            expect(facilities.scopes.length).to.equals(1);
            expect(facilities.scopes[0].nodes[0].nodeId).to.equals("deviceA");
            expect(facilities.scopes[0].selected).to.equals(true);
            expect(facilities.scopes[0].nodes[0].selected).to.equals(true);
        });

        it('should set user selected sources', function () {
            var result ={
                facilities: [{
                    id: "12345",
                    selected: false,
                    scopes: [{
                        id: "111",
                        selected: false,
                        nodes: [{
                            id: "222",
                            nodeType: "Supply",
                            name: "test 222",
                            selected: false
                        }]
                    }]
                }, {
                    id: "9876543",
                    selected: false,
                    scopes: [{
                        id: "333",
                        selected: false,
                        nodes: [{
                            id: "444",
                            nodeType: "Supply",
                            name: "test 444",
                            selected: false
                        }]
                    }]
                }],
                thermostatList: [{
                    id: "555",
                    selected: false
                }, {
                    id: "666",
                    selected: false
                }]
            };
            var cachedSources = {
                selectedFacilities: ["9876543"],
                selectedScopes: [],
                selectedNodes: [],
                selectedThermostats: ["666"]

            };
            userDao._setUserSelectedSources(result, cachedSources, false);
            expect(result.facilities[0].selected).to.equals(false);
            expect(result.facilities[0].scopes[0].selected).to.equals(false);
            expect(result.facilities[1].selected).to.equals(true);
            expect(result.facilities[1].scopes[0].selected).to.equals(true);

            expect(result.thermostatList[0].selected).to.equals(false);
            expect(result.thermostatList[1].selected).to.equals(true);
        });

        it('should set user selected sources for ems', function () {
            var result ={
                facilities: [{
                    id: "12345",
                    selected: true,
                    scopes: [{
                        id: "111",
                        selected: true,
                        nodes: [{
                            id: "222",
                            nodeType: "Supply",
                            name: "test 222",
                            selected: true
                        }]
                    }]
                }, {
                    id: "9876543",
                    selected: true,
                    scopes: [{
                        id: "333",
                        selected: true,
                        nodes: [{
                            id: "444",
                            nodeType: "Supply",
                            name: "Main Line phase A",
                            selected: true
                        }]
                    }]
                }],
                thermostatList: [{
                    id: "555",
                    selected: true
                }, {
                    id: "666",
                    selected: true
                }]
            };
            userDao._setUserSelectedSources(result, null, true);
            expect(result.facilities[0].selected).to.equals(true);
            expect(result.facilities[0].scopes[0].selected).to.equals(true);
            expect(result.facilities[0].scopes[0].nodes[0].selected).to.equals(true);
            expect(result.facilities[1].selected).to.equals(true);
            expect(result.facilities[1].scopes[0].selected).to.equals(true);
            expect(result.facilities[1].scopes[0].nodes[0].selected).to.equals(true);

            expect(result.thermostatList[0].selected).to.equals(true);
            expect(result.thermostatList[1].selected).to.equals(true);
        });
    });
}());
