angular.module('blApp.components.companyPanel')
    .controller('CompanySourcesController', ['$scope', '$rootScope', '$timeout', '$filter', '$cookieStore',
        'TagService', 'utilService', 'fileReader', 'tagFactory', 'notifyService',
        function($scope, $rootScope, $timeout, $filter, $cookies,
                 TagService, utilService, fileReader, tagFactory, notifyService) {

            $scope.select2Options = {
                allowClear: true
            };

            $scope.panelQueue = [1];
            $scope.timeZoneList = [];

            $scope.activePanelIndex = 0;
            $scope.facilities = [];
            $scope.scopes = [];
            $scope.nodes = [];
            $scope.metrics = [];

            $scope.currentFacilityId = '';
            $scope.currentScopeId = '';
            $scope.currentNodeId = '';
            $scope.currentMetricId = '';

            $scope.currentFacility = {};
            $scope.currentScope = {};
            $scope.currentNode = {};
            $scope.currentMetric = {};

            $scope.addFacility = {
                'utilityProvider': ''
            };

            $scope.editFacility = {
                'utilityProvider': ''
            };

            $scope.searchUtilities = [];
            $scope.noMatch = false;
            $scope.customEntry = false;
            $scope.showUtilityResults = false;
            $scope.showCustomEntry = true;

            $scope.showFacilities = false;
            $scope.showScopes = false;
            $scope.showNodes = false;
            $scope.showMetrics = false;

            $scope.searchSource = '';
            $scope.searchDebounce = 350;
            $scope.searchTag = [];
            $scope.searchTag.name = $cookies.get('searchSourceKey');
            $scope.sourceLoading = false;

            $scope.resultFacilities = [];
            $scope.resultScopes = [];
            $scope.resultNodes = [];
            $scope.resultMetrics = [];

            $scope.metricList = [
                {name : 'Energy (Wh)'},
                {name : 'Energy (kWh)'},
                {name : 'Reimbursement'},
                {name : 'Power (W)'},
                {name : 'Power (kW)'},
                {name : 'Max Watts'},
                {name : 'Min Watts'},
                {name : 'Irradiance'},
                {name : 'Frequency'},
                {name : 'Current'},
                {name : 'Reactive Power'},
                {name : 'Pressure'},
                {name : 'Volumetric Flow'},
                {name : 'Mass-Flow'},
                {name : 'Resistance'},
                {name : 'Apparent Power'},
                {name : 'Total Harmonic Distortion'},
                {name : 'Temperature'},
                {name : 'Voltage'},
                {name : 'Numeric'},
                {name : 'Angle'},
                {name : 'Relative Humidity'},
                {name : 'Speed'}
            ];
            $scope.addScope = {};
            $scope.addNode = {};
            $scope.addFacilityUtilityAccount = '';

            $rootScope.currentUser = $rootScope.currentUser || {};

            var timeoutVar;
            $scope.submitted = false;

            $scope.scopeNesting = false;

            $scope.facilityImageUploadStatus = '';
            $scope.facilityImageUploadProgress = 0;

            $scope.deviceSoftwareUploadStatus = '';
            $scope.deviceSoftwareUploadProgress = 0;
            $scope.uploadedDeviceSoftware = {
                'bucketName': null,
                'version': null,
                'uploadedDate': null
            };

            $scope.nodeCompanyList = {
                'Envoy': 'enphase',
                'GreenEye Monitor': 'gem',
                'GEM': 'gem',
                'Sunny WebBox': 'webbox',
                'EG3000': 'egauge'
            };

            $scope.currentDeviceSoftware = null;

            $scope.softwareToUpdate = '';
            $scope.deviceSoftwareUpdateStatus = '';

            /* Pagination Variables */
            $scope.totalPage = 4;
            $scope.currentPage = 1;
            $scope.limit = 30;
            $scope.offset = 0;
            $scope.totalCount = 0;

            $scope.initializeFormValidation = function (form) {
                $scope.submitted = false;
                if (typeof form !== 'undefined') {
                    form.$setPristine();
                } else {
                    $scope.createFacilityForm.$setPristine();
                    $scope.createScope2Form.$setPristine();
                    $scope.createNode2Form.$setPristine();
                    $scope.createMetric2Form.$setPristine();
                }
            };
            /**
             * List all facilities for current user 
             * @return {object}
             */
            $scope.listFacilities = function(filter) {
                var searchKey = '';
                if (typeof filter !== 'undefined') {
                    searchKey = filter.trim();
                }

                $scope.facilities = [];
                $scope.resultFacilities = [];
                $scope.resultScopes = [];
                $scope.resultNodes = [];
                $scope.resultMetrics = [];

                $scope.sourceLoading = true;
                TagService
                    .listAccessibleTagsByUser($rootScope.currentUser._id, $scope.limit,
                         ($scope.currentPage - 1) * $scope.limit, searchKey)
                    .then(function (tags) {
                        $scope.sourceLoading = false;

                        if (!tags || !tags.length) {
                            $scope.facilities = [];
                            return ;
                        }

                        $scope.totalCount = parseInt(tags._responseHeader_['x-total-count']);
                        $scope.totalPage =  Math.floor($scope.totalCount / $scope.limit) + 
                                                    ($scope.totalCount % $scope.limit > 0 ? 1 : 0);

                        $scope.facilities = tags;

                        $scope.currentFacility = $scope.facilities[0];
                        $scope.currentFacilityId = $scope.currentFacility._id;

                        $scope.initializeSearchResults();
                    });
            };

            $scope.listTimeZones = function() {
                utilService.getTimeZones().then(function(result) {
                    if (!result.length) {
                        return ;
                    }
                    $scope.timeZoneList = result;
                });
            };

            $scope.getClientTimeZone = function () {
                utilService.getClientTimeZone().then(function(result) {
                    console.log(result);
                });
            };

            $scope.listTimeZones = function() {
                utilService.getTimeZones().then(function(result) {
                    if (!result.length) {
                        return ;
                    }
                    $scope.timeZoneList = result;
                });
            };

            $scope.getClientTimeZone = function () {
                utilService.getClientTimeZone().then(function(result) {
                    console.log(result);
                });
            };

            $scope.initializeSearchResults = function() {
                angular.extend($scope, {
                    'resultFacilities': [],
                    'resultScopes': [],
                    'resultNodes': [],
                    'resultMetrics': []
                });
                
                $scope.fillTagsHierarchy($scope.facilities);
            };

            $scope.fillTagsHierarchy = function (tags) {
                var nextLevelTags = [];

                angular.forEach(tags, function(tag) {
                    switch (tag.tagType) {
                        case 'Facility':
                            pushWithoutDuplication($scope.resultFacilities, tag);
                            break;
                        case 'Scope':
                            pushWithoutDuplication($scope.resultScopes, tag);
                            break;
                        case 'Node':
                            pushWithoutDuplication($scope.resultNodes, tag);
                            break;
                        case 'Metric':
                            pushWithoutDuplication($scope.resultMetrics, tag);
                            break;
                    }
                    angular.forEach(tag.childTags, function(child) {
                        nextLevelTags.push(child);
                    });
                });

                if (nextLevelTags.length) {
                    $scope.fillTagsHierarchy(nextLevelTags);
                }
            };

            var pushWithoutDuplication = function (list, newTag) {
                angular.forEach(list, function(exTag, index) {
                    if (exTag._id === newTag._id) {
                        list.splice(index, 1);
                    }
                });

                list.push(newTag);
            };

            $scope.backToSearchResult = function() {
                $scope.activePanelIndex = 0;
                $scope.currentFacility.toggleDelete = false;
                $timeout(function() {
                    angular.element('#search-box').focus();
                }, 100);
            };

            $rootScope.initSource = $scope.backToSearchResult;

            /**
             * Show facility panel with facility Id
             * @param {string} facility
             * @param {string} openType
             * @return {object}
             */
            $scope.showFacilityDetail = function(facility, openType) {
                //HOBO U23 ProV2 External Temperature Relative Humidity DI - U23-02
                
                $scope.currentFacilityId = facility._id;
                $scope.currentFacility = facility;

                $scope.getAccessibleUsersByTag($scope.currentFacility._id, $scope.currentFacility);
                $scope.currentFacility.toggleDelete = false;
                $scope.activePanelIndex = 1;
                $timeout(function() {
                    $scope.slideRelatedSources($('.slide-sources-panel.facility'), 'holdOpen');
                }, 10);
            };

            /**
             * Show Scope panel with scope Id
             * @param {string} scope
             * @param {string} openType
             * @return {object}
             */
            $scope.showScopeDetail = function(scope, openType) {
                //HOBO U23 ProV2 External Temperature Relative Humidity DI - U23-02

                $scope.currentScopeId = scope._id;
                $scope.currentScope = scope;

                if (openType !== 'normal' && openType !== 'nested') {
                    if ($scope.currentScope.parents[0].tagType === 'Facility') {
                        $scope.currentFacilityId = $scope.currentScope.parents[0].id;
                        angular.forEach($scope.resultFacilities, function(facility) {
                            if (facility._id === $scope.currentFacilityId) {
                                $scope.currentFacility = facility;
                            }
                        });
                    }
                }

                $scope.getAccessibleUsersByTag($scope.currentScope._id, $scope.currentScope);
                $scope.activePanelIndex = 2;
                $scope.currentScope.toggleDelete = false;

                $scope.currentDeviceSoftware = null;
                $scope.softwareToUpdate = '';
                $scope.deviceSoftwareUpdateStatus = '';

                $timeout(function() {
                    $scope.slideRelatedSources($('.slide-sources-panel.scope'), 'holdOpen');
                }, 10);
                if (openType === 'nested') {
                    $('.panel.company-panel-main').removeClass('open');
                    $timeout(function() {
                        $('.panel.company-panel-main').addClass('open');
                    }, 500);
                }
            };

            /**
             * Check Scope's Current Device Software
             */
            $scope.checkCurrentDeviceSoftware = function(tagId) {

                $timeout(function() { 
                    $scope.currentDeviceSoftware = 'Checking ... Please wait';
                }, 10);

                TagService.getGatewaySoftwareConfigs(tagId).then(
                    function(data) {
                        console.log('getGatewaySoftwareConfigs success: ');
                        console.log(data);
                        $timeout(function() { 
                            $scope.currentDeviceSoftware = 'No Record Found';
                            for (var iConf = data.length-1; iConf >= 0; iConf--) {
                                if (data[iConf].status === 'success') {
                                    $scope.currentDeviceSoftware = data[iConf].softwareVersion;
                                    break;
                                }
                            }
                        }, 100);
                    },
                    function(data) {
                        console.log('getGatewaySoftwareConfigs error: ');
                        console.log(data);
                        $timeout(function() { 
                            $scope.currentDeviceSoftware = 'FAIL';
                        }, 100);
                    }
                );
            };

            /**
             * Update Device Software for the current scope
             */
            $scope.updateDeviceSoftware = function(tagId, softwareVersion) {

                if (!softwareVersion) {
                    $timeout(function() { 
                        $scope.deviceSoftwareUpdateStatus = 'EMPTY';
                    }, 10);
                    return;
                }

                $scope.deviceSoftwareUpdateStatus = 'SUBMITTING';
                $scope.togglePleaseWait();

                TagService.updateDeviceSoftware(tagId, softwareVersion).then(
                    function(data) {
                        console.log('updateDeviceSoftware success: ');
                        console.log(data);
                        $timeout(function() { 
                            $scope.deviceSoftwareUpdateStatus = 'SUCCESS';
                        }, 100);
                        $scope.togglePleaseWait();
                    },
                    function(data) {
                        console.log('updateDeviceSoftware error: ');
                        console.log(data);
                        $timeout(function() { 
                            $scope.deviceSoftwareUpdateStatus = 'FAIL';
                        }, 100);
                        $scope.togglePleaseWait();
                    }
                );
            };

            /**
             * Show node panel with node Id
             * @param {string} scope
             * @param {string} openType
             * @return {object}
             */
            $scope.showNodeDetail = function(node, openType) {
                //HOBO U23 ProV2 External Temperature Relative Humidity DI - U23-02

                $scope.currentNodeId = node._id;
                $scope.currentNode = node;

                if (openType !== 'normal') {
                    $scope.currentScopeId = $scope.currentNode.parents[0].id;
                    angular.forEach($scope.resultScopes, function(scope) {
                        if (scope._id === $scope.currentScopeId) {
                            $scope.currentScope = scope;
                        }
                    });
                    if ($scope.currentScope.parents[0].tagType === 'Facility') {
                        $scope.currentFacilityId = $scope.currentScope.parents[0].id;
                        angular.forEach($scope.resultFacilities, function(facility) {
                            if (facility._id === $scope.currentFacilityId) {
                                $scope.currentFacility = facility;
                            }
                        });
                    }
                }

                $scope.getAccessibleUsersByTag($scope.currentNode._id, $scope.currentNode);
                $scope.activePanelIndex = 3;
                $scope.currentNode.toggleDelete = false;
                $timeout(function() {
                    $scope.slideRelatedSources($('.slide-sources-panel.node'), 'holdOpen');
                }, 10);
            };

            /**
             * Show metric panel with metric Id
             * @param {string} metric
             * @param {string} openType
             * @return {object}
             */
            $scope.showMetricDetail = function(metric, openType) {

                $scope.currentMetricId = metric._id;
                $scope.currentMetric = metric;

                if (openType !== 'normal') {
                    $scope.currentNodeId = metric.parents[0].id;
                    angular.forEach($scope.resultNodes, function(node) {
                        if (node._id === $scope.currentNodeId) {
                            $scope.currentNode = node;
                        }
                    });
                    $scope.currentScopeId = $scope.currentNode.parents[0].id;
                    angular.forEach($scope.resultScopes, function(scope) {
                        if (scope._id === $scope.currentScopeId) {
                            $scope.currentScope = scope;
                        }
                    });
                    if ($scope.currentScope.parents[0].tagType === 'Facility') {
                        $scope.currentFacilityId = $scope.currentScope.parents[0].id;
                        angular.forEach($scope.resultFacilities, function(facility) {
                            if (facility._id === $scope.currentFacilityId) {
                                $scope.currentFacility = facility;
                            }
                        });
                    }
                }

                $scope.addMetric = {};
                angular.copy(metric, $scope.addMetric);
                $scope.activePanelIndex = 10;
                if ($scope.addMetric.metric === 'Custom') {
                    $scope.addMetric.metricList = 'custom';
                } else {
                    $scope.addMetric.metricList = $scope.addMetric.name;
                }
                $scope.currentMetric.toggleDelete = false;
                $scope.metricEventName = 'Update';
            };

            /**
             * Filter child tags by tagType and return the results
             * @param {object} parent
             * @param {string} type
             * @return {array}
            */
            $scope.getChildTagsByType = function (parent, type) {
                var childTagsByType = [];
                
                angular.forEach(parent.childTags, function(child) {
                    if (child.tagType === type) {
                        childTagsByType.push(child);
                    }
                });

                return childTagsByType;
            };

            /**
             * Back to facility detail panel
             * @param {string}
             * @return {object}
             */
            $scope.backFacilityDetail = function() {
                $scope.activePanelIndex = 1;
                $scope.currentScope.toggleDelete = false;
            };

            /**
             * Back to scope detail panel
             * @param {string}
             * @return {object}
             */
            $scope.backScopeDetail = function() {
                $scope.activePanelIndex = 2;
                $scope.currentNode.toggleDelete = false;
            };

            /**
             * Back to node detail panel
             * @param {string}
             * @return {object}
             */
            $scope.backNodeDetail = function() {
                $scope.activePanelIndex = 3;
            };

            /**
             * Toggle sliding related sources panel
             * @param {string} e
             * @return none
             */
            $scope.slideRelatedSources = function(e, type) {
                var relatedSourcesObj, sourcesSectionHeight;
                if(type === 'click') {
                    relatedSourcesObj = angular.element(e.target).parents('#related-sources-section');
                    sourcesSectionHeight = relatedSourcesObj.height();
                    relatedSourcesObj.animate({
                        bottom: parseInt(relatedSourcesObj.css('bottom'),10) === -30 ? 
                                    (-30 - sourcesSectionHeight + 66) : -30
                    });

                    relatedSourcesObj.find('.slide-source-head i')
                                     .toggleClass('fa-chevron-up')
                                     .toggleClass('fa-chevron-down');
                } else if (type === 'holdOpen') {
                    relatedSourcesObj = e;
                    sourcesSectionHeight = relatedSourcesObj.height();
                    relatedSourcesObj.css({
                        bottom: (-30 - sourcesSectionHeight + 66)
                    });
                    if(relatedSourcesObj.find('.slide-source-head i').hasClass('fa-chevron-down')) {
                        relatedSourcesObj.find('.slide-source-head i')
                                     .toggleClass('fa-chevron-down')
                                     .toggleClass('fa-chevron-up');
                    }
                } else {
                    relatedSourcesObj = e;
                    sourcesSectionHeight = relatedSourcesObj.height();
                    relatedSourcesObj.animate({
                        bottom: (-30 - sourcesSectionHeight + 66)
                    });
                    if(relatedSourcesObj.find('.slide-source-head i').hasClass('fa-chevron-down')) {
                        relatedSourcesObj.find('.slide-source-head i')
                                     .toggleClass('fa-chevron-down')
                                     .toggleClass('fa-chevron-up');
                    }
                }
                
            };

            /**
             * Open create facility panel
             * @return none
             */
            $scope.openCreateFacility = function() {
                if ($scope.editFacility === null) {
                    $scope.editFacility = {};
                }
                $scope.addMetric.metricList = 'custom';
                $scope.resetAddFacilityForm();
                $scope.oldPanelIndex = $scope.activePanelIndex;
                $scope.facilityImageUploadStatus = '';
                $scope.resetDeviceSoftwareUpload();
                $scope.activePanelIndex = 4;
                $scope.addMetricsDeviceIdList = [];
            };

            $scope.resetAddFacilityForm = function() {
                $scope.sourceType = 1;
                if ($scope.addFacility) {
                    angular.extend($scope.addFacility, {
                        name: '',
                        address: '',
                        taxID: '',
                        utilityProvider: '',
                        nonProfit: false,
                        bpLock: false,
                        billingInterval: 30,
                        image: null
                    });
                }
                $scope.addFacilityUtilityAccount = '';
            };

            $scope.resetDeviceSoftwareUpload = function() {
                $scope.deviceSoftwareUploadStatus = '';
                angular.extend($scope.uploadedDeviceSoftware, {
                    'bucketName': null,
                    'version': null,
                    'uploadedDate': null
                });
                angular.element('#addScopeSoftwareUpload').val('');
                angular.element('#editScopeSoftwareUpload').val('');
            };

            /**
             * Open edit facility panel
             * @return none
             */
            $scope.openEditFacility = function() {
                $scope.oldPanelIndex = $scope.activePanelIndex;
                $scope.editFacility = {};
                angular.copy($scope.currentFacility, $scope.editFacility);
                if (!$scope.editFacility.billingInterval) {
                    $scope.editFacility.billingInterval = 30;
                }
                $scope.facilityImageUploadStatus = '';
                $scope.activePanelIndex = 5;
                angular.element('#editFacilityUtilityAccount').val($scope.editFacility.utilityAccounts.join(', '));
            };

            /**
             * Open edit scope panel
             * @return none
             */
            $scope.openEditScope = function() {
                $scope.editScope = {};
                angular.copy($scope.currentScope, $scope.editScope);
                $scope.resetDeviceSoftwareUpload();
                $scope.activePanelIndex = 7;
            };

            /**
             * Open edit node panel
             * @return none
             */
            $scope.openEditNode = function() {
                $scope.editNode = {};
                angular.copy($scope.currentNode, $scope.editNode);
                $scope.activePanelIndex = 9;
            };

            /**
             * Open create metric panel
             * @return none
             */
            $scope.openCreateMetric = function() {
                $scope.activePanelIndex = 10;
                $scope.addMetric = {};
                $scope.addMetric.metricList = 'custom';
                $scope.metricEventName = 'Add';
                angular.element('#add_metric_formula_tagsinput span.tag').remove();
                angular.element('#metric-formula #verify').hide();

                $scope.addMetricsDeviceIdList = [];
                var scopeId = $scope.currentScope.deviceID;
                var company = $scope.nodeCompanyList[$scope.currentNode.device];
                TagService.getPossibleNodesMetricsByScope(scopeId, company)
                  .then(function(resp) {
                      $scope.addMetricsDeviceIdList = resp.metrics;
                  });
            };

            /**
             * Event handler for select metric list
             * @return none
             */
            $scope.selectMetricList = function() {
                $scope.addMetric.metricType = 'Datafeed';
                if ($scope.addMetric.metricList === 'custom') {
                    $scope.addMetric.metricType = 'Calculated';
                    $scope.addMetric.name = '';
                } else {
                    $scope.addMetric.name = $scope.addMetric.metricList;
                }
            };

            /**
             * Event handler for select metric type
             */
            $scope.selectMetricType = function() {
                if ($scope.addMetric.metricList === 'custom') {
                    $scope.addMetric.metricType = 'Calculated';
                }
            };

            /**
             * Toggle wait mode for uploading
             *
            **/
            $scope.togglePleaseWait = function(){
                if ($('.blockUI').length === 0) {
                    $.blockUI({
                        message: '<div id="loader"></div>',
                        css: {
                            cursor: 'arrow',
                            height: 'auto',
                            width: 'auto',
                            margin: '-85px 0 0 -85px',
                            padding: '0',
                            top: '50%',
                            left: '50%',
                            border: '0',
                            background: 'transparent'
                        },
                        applyPlatformOpacityRules: false,
                        fadeIn: 0,
                        fadeOut: 150
                    });
                } else {
                    $.unblockUI();
                }
            };

            /**
             * Upload facility image
             */
            $scope.uploadFacilityImage = function(element, creatingFacility) {

                // console.log("uploadFacilityImage function");

                if (!element || element.files.length === 0) {
                    return;
                }

                var image = element.files[0];
                
                $scope.facilityImageUploadStatus = 'UPLOADING';
                $scope.facilityImageUploadProgress = 0;

                $scope.togglePleaseWait();

                TagService.uploadImage(image).then(
                    function(data) {
                        console.log('upload success: ');
                        console.log(data);
                        $timeout(function() { 
                            $scope.facilityImageUploadStatus = 'SUCCESS';
                            if (creatingFacility) {
                                $scope.addFacility.image = data.sourceCDNURL;
                            } else {
                                $scope.editFacility.image = data.sourceCDNURL;
                            }
                        }, 100);
                        $scope.togglePleaseWait();
                    },
                    function(data) {
                        console.log('upload error: ');
                        console.log(data);
                        $timeout(function() { 
                            $scope.facilityImageUploadStatus = 'FAIL';
                            if (creatingFacility) {
                                angular.element('#addFacilityImageUpload').val('');
                            } else {
                                angular.element('#editFacilityImageUpload').val('');
                            }
                        }, 100);
                        $scope.togglePleaseWait();
                    }
                );
            };

            /**
             * Create new facility
             */
            $scope.createFacility = function(form) {
                if (form.$invalid) {
                    $scope.submitted = true;
                    return;
                }
                $scope.initializeFormValidation(form);

                $scope.ajaxLoading = true;

                var saveTag = function(tagObject) {
                    TagService.createTag(tagObject).then(function(newFacility) {
                        console.log('app runned?');
                        $scope.activePanelIndex = 0;
                        $scope.facilities = $scope.facilities.concat(newFacility);
                        $scope.resultFacilities = $scope.resultFacilities.concat(newFacility);
                        $scope.ajaxLoading = false;
                        $scope.resetAddFacilityForm();
                    });
                };

                angular.extend($scope.addFacility, {
                    'tagType': 'Facility',
                    'creatorRole': $rootScope.currentUser.role,
                    'utilityAccounts': $scope.addFacilityUtilityAccount.split(',').map(function(s) {return s.trim();})
                });

                if ($scope.addFacility.utilityProvider) {
                    $scope.checkUProviderExists($scope.addFacility.utilityProvider);
                }

                utilService.parseAddress($scope.addFacility.address, function(parsedAddress) {
                    angular.extend($scope.addFacility, parsedAddress);
                    saveTag($scope.addFacility);
                });
            };

            /**
             * Update facility
             * @param {string}
             * @return {object}
             */
            $scope.updateFacility = function(form) {
                if (form.$invalid) {
                    $scope.submitted = true;
                    return;
                }
                $scope.initializeFormValidation(form);
                $scope.ajaxLoading = true;

                var updateTag = function(tagObject) {

                    if ($scope.currentFacility.bpLock && tagObject.bpLock) {
                        notifyService.errorNotify('Source is locked. You don\'t have permission to update.');
                        return false;
                    }
                    $scope.ajaxLoading = true;
                    TagService.updateTag(tagObject._id, tagObject).then(function(resp) {
                        $scope.activePanelIndex = 1;
                        $scope.currentFacility = $scope.editFacility;
                        angular.forEach($scope.facilities, function(facility, index) {
                            if (facility._id === $scope.editFacility._id) {
                                $scope.facilities.splice(index, 1, $scope.editFacility);
                            }
                        });

                        angular.forEach($scope.resultFacilities, function(facility, index) {
                            if (facility._id === $scope.editFacility._id) {
                                $scope.resultFacilities.splice(index, 1, $scope.editFacility);
                            }
                        });
                        $scope.ajaxLoading = false;
                        return resp;
                    });
                };
                angular.extend($scope.editFacility, {
                    'tagType': 'Facility',
                    'utilityAccounts': angular.element('#editFacilityUtilityAccount').val()
                                    .split(',').map(function(s) {return s.trim();})
                });
                if ( $scope.editFacility.utilityProvider ) {
                    $scope.checkUProviderExists($scope.editFacility.utilityProvider);
                }
                utilService.parseAddress($scope.editFacility.address, function(parsedAddress) {
                    angular.extend($scope.editFacility, parsedAddress);
                    updateTag($scope.editFacility);
                });
            };

            /**
             * Upload Device Software
             */
            $scope.uploadDeviceSoftware = function(element, creatingScope) {

                if (!element || element.files.length === 0) {
                    return;
                }

                var software = element.files[0];
                
                $scope.deviceSoftwareUploadStatus = 'UPLOADING';
                $scope.deviceSoftwareUploadProgress = 0;

                $scope.togglePleaseWait();

                TagService.uploadDeviceSoftware(software).then(
                    function(data) {
                        console.log('upload success: ');
                        console.log(data);
                        $timeout(function() { 
                            $scope.deviceSoftwareUploadStatus = 'SUCCESS';
                            angular.extend($scope.uploadedDeviceSoftware, {
                                'bucketName': data.bucketName,
                                'version': data.title,
                                'uploadedDate': new Date()
                            });
                        }, 100);
                        $scope.togglePleaseWait();
                    },
                    function(data) {
                        console.log('upload error: ');
                        console.log(data);
                        $timeout(function() { 
                            $scope.deviceSoftwareUploadStatus = 'FAIL';
                            if (creatingScope) {
                                angular.element('#addScopeSoftwareUpload').val('');
                            } else {
                                angular.element('#editScopeSoftwareUpload').val('');
                            }
                        }, 100);
                        $scope.togglePleaseWait();
                    }
                );
            };

            /**
             * Create new scope
             * @param {string}
             * @return {object}
             */
            $scope.createScope = function (form) {
                if (form.$invalid) {
                    $scope.submitted = true;
                    return;
                }
                $scope.initializeFormValidation(form);

                if ($scope.scopeNesting === false) {
                    angular.extend($scope.addScope, {
                        'tagType': 'Scope',
                        'creatorRole': $rootScope.currentUser.role,
                        'parents': [{id: $scope.currentFacilityId, tagType: 'Facility'}]
                    });
                } else {
                    angular.extend($scope.addScope, {
                        'tagType': 'Scope',
                        'creatorRole': $rootScope.currentUser.role,
                        'parents': [{id: $scope.currentScopeId, tagType: 'Scope'}]
                    });
                }

                if ($scope.uploadedDeviceSoftware.bucketName) {
                    $scope.addScope.deviceSoftware = [angular.copy($scope.uploadedDeviceSoftware)];
                }

                TagService.createTag($scope.addScope).then(function(newScope) {
                    /*var scope_id = result.data.message._id;
                    var scopes = [];
                    var facility_scopes = [];

                    scopes.push(scope_id);*/

                    if ($scope.scopeNesting === false) {
                        $scope.currentFacility.childTags = $scope.currentFacility.childTags
                                                         ? $scope.currentFacility.childTags.concat(newScope)
                                                         : newScope;
                        $scope.resultScopes = $scope.resultScopes.concat(newScope);
                        $scope.activePanelIndex = 1;
                    } else {
                        $scope.currentScope.childTags = $scope.currentScope.childTags
                                                         ? $scope.currentScope.childTags.concat(newScope)
                                                         : newScope;
                        $scope.resultScopes = $scope.resultScopes.concat(newScope);
                        $scope.activePanelIndex = 2;
                    }
                    
                });
            };

            /**
             * Update scope
             * @param {string}
             * @return {object}
             */
            $scope.updateScope = function (form){
                if (form.$invalid) {
                    $scope.submitted = true;
                    return;
                }

                $scope.initializeFormValidation(form);

                if ($scope.uploadedDeviceSoftware.bucketName) {
                    if ($scope.editScope.deviceSoftware && angular.isArray($scope.editScope.deviceSoftware)) {
                        $scope.editScope.deviceSoftware.push(angular.copy($scope.uploadedDeviceSoftware));
                    } else {
                        $scope.editScope.deviceSoftware = [angular.copy($scope.uploadedDeviceSoftware)];
                    }
                    $scope.uploadedDeviceSoftware.bucketName = null;
                }

                TagService.updateTag($scope.editScope._id, $scope.editScope).then(function (resp) {
                    $scope.activePanelIndex=2;
                    $scope.currentScope = $scope.editScope;
                    var parentTag = $scope.currentFacility;

                    //Find a parent scope in case of nested scope
                    if ($scope.editScope.parents[0].tagType === 'Scope') {
                        angular.forEach($scope.resultScopes, function(scope) {
                            if (scope._id === $scope.editScope.parents[0].id) {
                                parentTag = scope;
                            }
                        });
                    }

                    angular.forEach(parentTag.childTags, function(scope, index){
                        if(scope._id === $scope.editScope._id) {
                            (parentTag.childTags).splice(index, 1, $scope.editScope);
                        }
                    });
                    angular.forEach($scope.resultScopes, function(scope, index){
                        if(scope._id === $scope.editScope._id) {
                            ($scope.resultScopes).splice(index, 1, $scope.editScope);
                        }
                    });
                    return resp;
                });
            };

            /**
             * Create new node
             * @param {string}
             * @return {object}
             */
            $scope.createNode = function(form) {
                if (form.$invalid) {
                    $scope.submitted = true;
                    return;
                }
                $scope.initializeFormValidation(form);
                angular.extend($scope.addNode, {
                    'tagType': 'Node',
                    'creatorRole': $rootScope.currentUser.role,
                    'parents': [{id: $scope.currentScopeId, tagType: 'Scope'}]
                });

                TagService.createTag($scope.addNode).then(function(newNode) {
                    var scopeNodes;
                    /*var nodeId = result.data.message._id;
                    var nodes = [];
                    nodes.push(nodeId);*/

                    scopeNodes = $scope.currentScope.childTags || [];
                    scopeNodes = scopeNodes.concat(newNode);
                    $scope.resultNodes = $scope.resultNodes.concat(newNode);
                    $scope.currentScope.childTags =  scopeNodes;
                    $scope.activePanelIndex = 2;
                });
            };

            /**
             * Update node
             * @param {string}
             * @return {object}
             */
            $scope.updateNode = function(form) {
                if (form.$invalid) {
                    $scope.submitted = true;
                    return;
                }
                if ($scope.currentNode.bpLock && $scope.editNode.bpLock) {
                    notifyService.errorNotify('Source is locked. You don\'t have permission to update.');
                    return false;
                }
                $scope.initializeFormValidation(form);
                TagService.updateTag($scope.editNode._id, $scope.editNode).then(function(resp) {
                    $scope.activePanelIndex = 3;
                    $scope.currentNode = $scope.editNode;
                    angular.forEach($scope.currentScope.childTags, function(node, index) {
                        if (node._id === $scope.editNode._id) {
                            ($scope.currentScope.childTags).splice(index, 1, $scope.editNode);
                        }
                    });

                    angular.forEach($scope.resultNodes, function(node, index){
                        if (node._id === $scope.editNode._id) {
                            ($scope.resultNodes).splice(index, 1, $scope.editNode);
                        }
                    });
                });
            };

            /**
             * Create new metric
             * @param {string}
             * @return {object}
             */
            $scope.createMetric = function(form) {
                if (form.$invalid) {
                    $scope.submitted = true;
                    return;
                }
                $scope.initializeFormValidation(form);
                var checkStatus = 0;
                angular.forEach($scope.currentNode.childTags, function(metric, index) {
                    if (metric.name === $scope.addMetric.name) {
                        checkStatus = 1;
                    }
                });
                if(checkStatus !== 0) {
                    var message = 'You cannot create two metrics with the same name.';
                    notifyService.errorNotify(message);
                    return false;
                }
                angular.extend($scope.addMetric, {
                    'tagType': 'Metric',
                    'creatorRole': $rootScope.currentUser.role,
                    'parents': [{id: $scope.currentNodeId, tagType: 'Node'}],
                    'metric': $scope.addMetric.metricType === 'Calculated' ? 'Custom' : 'Standard'
                });
                // Logic: Reimbursement should be Calculated metric type (though it's standard metric)
                if ($scope.addMetric.name === 'Reimbursement') {
                    $scope.addMetric.metricType = 'Calculated';
                    $scope.addMetric.metric = 'Standard';
                }
                console.log('create Metric with parameter:', $scope.addMetric);
                TagService.createTag($scope.addMetric).then(function(newMetrics) {
                    $scope.addMetric._id = newMetrics[0]._id;
                    $scope.currentNode.childTags = $scope.currentNode.childTags
                                                   ? $scope.currentNode.childTags.concat(newMetrics)
                                                   : newMetrics;
                    $scope.resultMetrics = $scope.resultMetrics.concat(newMetrics);
                    $scope.activePanelIndex = 3;
                });
            };

            /**
             * Update metric
             * @param {string}
             * @return {object}
             */
            $scope.updateMetric = function(form) {
                if (form.$invalid) {
                    $scope.submitted = true;
                    return;
                }
                $scope.initializeFormValidation(form);
                var checkStatus = 0;
                angular.forEach($scope.currentNode.childTags, function(metric, index) {
                    if (metric.name === $scope.addMetric.name) {
                        checkStatus = 1;
                    }
                });
                if(!checkStatus) {
                    var message = 'Selected metric doesn\'t exist.';
                    notifyService.errorNotify(message);
                    return false;
                }

                angular.extend($scope.addMetric, {
                    metric: $scope.addMetric.metricType === 'Calculated' ? 'Custom' : 'Standard'
                });

                if ($scope.addMetric.name === 'Reimbursement') {
                    $scope.addMetric.metric = 'Standard';
                }


                TagService.updateTag($scope.addMetric._id, $scope.addMetric).then(function(updatedMetrics) {
                    $scope.activePanelIndex = 3;
                    angular.forEach($scope.currentNode.childTags, function(metric, index) {
                        if (metric._id === $scope.addMetric._id) {
                            ($scope.currentNode.childTags).splice(index, 1, updatedMetrics);
                        }
                    });

                    angular.forEach($scope.resultMetrics, function(metric, index) {
                        if (metric._id === $scope.addMetric._id) {
                            ($scope.resultMetrics).splice(index, 1, updatedMetrics);
                        }
                    });
                });
            };

            /**
             * Delete facility with facility Id
             * @param {string} facilityId
             * @param {string} type
             * @return {object}
             */
            $scope.deleteFacility = function (facilityId, type){
                TagService.deleteTag(facilityId).then(function (result) {
                    if(type === 'list') {
                        $('.facility-'+facilityId).slideUp('slow');
                        $timeout(function() {
                            var searchKey = (!$scope.searchTag.name) ? '' : $scope.searchTag.name.trim();
                            $scope.listFacilities(searchKey);
                        }, 1000);
                    } else {
                        $scope.activePanelIndex=0;
                        var searchKey = (!$scope.searchTag.name) ? '' : $scope.searchTag.name.trim();
                        $scope.listFacilities(searchKey);
                    }
                });
            };

            /**
             * Delete scope with scope Id
             * @param {string} scopeId
             * @param {string} type
             * @return {object}
             */
            $scope.deleteScope = function(scopeId, type) {
                TagService.deleteTag(scopeId).then(function(resp) {
                    if(type === 'list') {
                        $('.scope-' + scopeId).slideUp('slow');
                        $timeout(function() {
                            $scope.currentFacility.children =
                                $filter('filter')($scope.currentFacility.children, {id: '!'+scopeId});
                            $scope.currentFacility.childTags =
                                $filter('filter')($scope.currentFacility.childTags, {_id: '!'+scopeId});
                            /*
                             $scope.resultScopes =
                             $filter('filter')($scope.currentFacility.childTags, {_id: '!'+scopeId});
                             */
                            var searchKey = (!$scope.searchTag.name) ? '' : $scope.searchTag.name.trim();
                            $scope.listFacilities(searchKey);
                        }, 1000);
                    }
                    else {
                        $scope.activePanelIndex = 1;
                        $scope.currentFacility.children =
                            $filter('filter')($scope.currentFacility.children, {id: '!'+scopeId});
                        $scope.currentFacility.childTags =
                            $filter('filter')($scope.currentFacility.childTags, {_id: '!'+scopeId});
                        /*
                         $scope.resultScopes =
                         $filter('filter')($scope.currentFacility.childTags, {_id: '!'+scopeId});
                         */
                        var searchKey = (!$scope.searchTag.name) ? '' : $scope.searchTag.name.trim();
                        $scope.listFacilities(searchKey);
                    }
                });
            };

            /**
             * Delete node with node Id
             * @param {string} nodeId
             * @param {string} type
             * @return {object}
             */
            $scope.deleteNode = function (nodeId, type){
                TagService.deleteTag(nodeId).then(function (result) {
                    if(type === 'list') {
                        $('.node-'+nodeId).slideUp('slow');
                        $timeout(function() {
                            $scope.currentScope.children =
                                $filter('filter')($scope.currentScope.children, {id: '!'+nodeId});
                            $scope.currentScope.childTags =
                                $filter('filter')($scope.currentScope.childTags, {_id: '!'+nodeId});
                            /*
                             $scope.resultNodes =
                             $filter('filter')($scope.currentScope.childTags, {_id: '!'+nodeId});
                             */
                            var searchKey = (!$scope.searchTag.name) ? '' : $scope.searchTag.name.trim();
                            $scope.listFacilities(searchKey);
                        }, 1000);
                    } else {
                        $scope.activePanelIndex = 2;
                        $scope.currentScope.children =
                            $filter('filter')($scope.currentScope.children, {id: '!'+nodeId});
                        $scope.currentScope.childTags =
                            $filter('filter')($scope.currentScope.childTags, {_id: '!'+nodeId});
                        /*
                         $scope.resultNodes =
                         $filter('filter')($scope.currentScope.childTags, {_id: '!'+nodeId});
                         */
                    }
                });
            };

            /**
             * delete metric with facility Id
             * Params:
             *
             */
            $scope.deleteMetric = function(metricId, type) {
                TagService.deleteTag(metricId).then(function(resp) {
                    console.log($scope.resultMetrics);
                    if(type === 'list') {
                        $('.metric-'+metricId).slideUp('slow');
                        $timeout(function() {
                            $scope.currentNode.children =
                                $filter('filter')($scope.currentNode.children, {id: '!'+metricId});
                            $scope.currentNode.childTags =
                                $filter('filter')($scope.currentNode.childTags, {_id: '!'+metricId});
                            var searchKey = (!$scope.searchTag.name) ? '' : $scope.searchTag.name.trim();
                            $scope.listFacilities(searchKey);
                            /*
                             $scope.resultMetrics =
                             $filter('filter')($scope.currentNode.childTags, {_id: '!'+metricId});
                             console.log($scope.resultMetrics);
                             */
                        }, 1000);
                    } else {
                        $scope.activePanelIndex = 3;
                        $scope.currentNode.children =
                            $filter('filter')($scope.currentNode.children, {id: '!'+metricId});
                        $scope.currentNode.childTags =
                            $filter('filter')($scope.currentNode.childTags, {_id: '!'+metricId});
                        /*
                         $scope.resultMetrics =
                         $filter('filter')($scope.currentNode.childTags, {_id: '!'+metricId});
                         */
                        var searchKey = (!$scope.searchTag.name) ? '' : $scope.searchTag.name.trim();
                        $scope.listFacilities(searchKey);
                    }
                });
            };

            /**
             * Show delete confirm window
             * @param {object} source
             * @param {object} sourceItem
             * @param {string} type
             * @param {string} showType
             * @return {object}
             */
            $scope.toggleDeleteSource = function(source, sourceItem, type, showType, $event) {
                var animationAction; //, message;
                if (source.bpLock) {
                    notifyService.errorNotify('Source is locked. Therefore you don\'t have permission to update.');
                    return false;
                }

                if (showType === 'show') {
                    TagService.checkTagDeletable(source._id).then(function(deletableSource) {
                        if(!deletableSource[source._id].isDeletable) {
                            $scope.showMessage(deletableSource, sourceItem);
                            return false;
                        }
                        else {
                            var children = '';
                            angular.forEach(deletableSource[source._id].children, function (removeTag, i) {
                                if(removeTag.id.toString() !== source._id.toString()) {
                                    children += '<span>' + removeTag.name + '</span>';
                                }
                            });

                            var parentEl = null;
                            if($($event.currentTarget).parents('.detail-section').length > 0) {
                                parentEl = $($event.currentTarget).parents('.detail-section');
                            }
                            else if($($event.currentTarget).parents('.source-item').length > 0) {
                                parentEl = $($event.currentTarget).parents('.source-item');
                            }

                            if(parentEl && parentEl !== undefined) {
                                var deleteEl = parentEl.find('delete-dialog').eq(0);
                                if(children === '') {
                                    deleteEl.find('p').html('Really Delete?');
                                }
                                else {
                                    deleteEl.find('p').html('If you delete <b>' + source.name + '</b>, ' +
                                        'then the following sources will also be deleted. Please confirm' + children);
                                }
                            }
                        }
                        animationAction = 'flipInX';
                        source.toggleDelete = true;
                        $scope.animationPanel(type, sourceItem, source, animationAction);
                    });
                } else {
                    animationAction = 'fadeOutLeftBig';
                    source.toggleDelete = false;
                    $scope.animationPanel(type, sourceItem, source, animationAction);
                }
                /*
                switch (sourceItem) {
                    case 'facility':
                        // if (source.children.length > 0) {
                        //     message = 'You cannot delete a Facility if it contains Scopes.';
                        //     notifyService.errorNotify(message);
                        //     return false; 
                        // } else {
                            if (showType === 'show') {
                                TagService.checkTagDeletable(source._id).then(function(deleteableFacility) {
                                    if(deleteableFacility.isUsed) {
                                        $scope.showMessage(deleteableFacility, sourceItem);
                                        return false;
                                    }
                                    animationAction = 'flipInX';
                                    source.toggleDelete = true;
                                    $scope.animationPanel(type, sourceItem, source, animationAction);
                                });
                            } else {
                                animationAction = 'fadeOutLeftBig';
                                source.toggleDelete = false;
                                $scope.animationPanel(type, sourceItem, source, animationAction);
                            }
                        // }
                        break;
                    case 'scope':
                        // if (source.children.length > 0) {
                        //     message = 'You cannot delete a Scope if it contains Nodes.';
                        //     notifyService.errorNotify(message);
                        //     return false;
                        // } else {
                            if (showType === 'show') {
                                TagService.checkTagDeletable(source._id).then(function(deleteableScope) {
                                    if (deleteableScope.isUsed) {
                                        $scope.showMessage(deleteableScope, sourceItem);
                                        return false;
                                    }
                                    animationAction = 'flipInX';
                                    source.toggleDelete = true;
                                    $scope.animationPanel(type, sourceItem, source, animationAction);
                                });
                            } else {
                                animationAction = 'fadeOutLeftBig';
                                source.toggleDelete = false;
                                $scope.animationPanel(type, sourceItem, source, animationAction);
                            }
                        // }
                        break;
                    case 'node':
                        // if (source.children.length > 0) {
                        //     message = 'You cannot delete a Node if it contains Metrics.';
                        //     notifyService.errorNotify(message);
                        //     return false;
                        // } else {
                            if (showType === 'show') {
                                TagService.checkTagDeletable(source._id).then(function(deleteableNode) {
                                    if (deleteableNode.isUsed) {
                                        $scope.showMessage(deleteableNode, sourceItem);
                                        return false;
                                    }
                                    animationAction = 'flipInX';
                                    source.toggleDelete = true;
                                    $scope.animationPanel(type, sourceItem, source, animationAction);
                                });
                            } else {
                                animationAction = 'fadeOutLeftBig';
                                source.toggleDelete = false;
                                $scope.animationPanel(type, sourceItem, source, animationAction);
                            }
                        // }
                        break;
                    case 'metric':
                        if(showType === 'show') {
                            TagService.checkTagDeletable(source._id).then(function(deleteableMetric) {
                                if (deleteableMetric.isUsed) {
                                    $scope.showMessage(deleteableMetric, sourceItem);
                                    return false;
                                }
                                animationAction = 'flipInX';
                                source.toggleDelete = true;
                                $scope.animationPanel(type, sourceItem, source, animationAction);
                            });
                        } else {
                            animationAction = 'fadeOutLeftBig';
                            source.toggleDelete = false;
                            $scope.animationPanel(type, sourceItem, source, animationAction);
                        }
                        break;
                }
                */
            };

            /**
             * Show delete confirm window
             * @param {object} source
             * @param {object} sourceItem
             * @param {string} type
             * @param {string} showType
             * @return {object}
             */
            $scope.animationPanel = function (type, sourceItem, source, animationAction) {
                if (type === 'list'){
                    $('.'+sourceItem+'-'+source._id+' .delete-box')
                        .removeClass(animationAction+' animated')
                        .addClass(animationAction+' animated')
                        .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 
                            function(){
                                $(this).removeClass(animationAction+' animated');
                            }
                        );
                } else {
                    $('.error-panel').removeClass(animationAction+' animated')
                        .addClass(animationAction+' animated')
                        .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 
                            function(){
                                $(this).removeClass(animationAction+' animated');
                            }
                        );
                }
            };

            /**
             * Show delete confirm window
             * @param {object} source
             * @param {object} sourceItem
             * @param {string} type
             * @param {string} showType
             * @return {object}
             */
            $scope.showMessage = function (deletableSource, sourceItem) {
                /*
                var message, userNames, presentationNames, dashboardNames, widgetNames;
                if (deletableSource.userNames.length > 0) {
                    userNames = deletableSource.userNames.join(', ');
                    userNames = 'User: ' + userNames;
                } else {
                    userNames = '';
                }
                if (deletableSource.presentationNames.length > 0) {
                    presentationNames = deletableSource.presentationNames.join(', ');
                    presentationNames = 'Presentation: ' + presentationNames;
                } else {
                    presentationNames = '';
                }

                if (deletableSource.dashboardNames.length > 0) {
                    dashboardNames = deletableSource.dashboardNames.join(', ');
                    dashboardNames = 'Dashboard: ' + dashboardNames;
                } else {
                    dashboardNames = '';
                }

                if (deletableSource.widgetNames.length > 0) {
                    widgetNames = deletableSource.presentationNames.join(', ');
                    widgetNames = 'Widget: ' + widgetNames;
                } else {
                    widgetNames = '';
                }

                var allNames = userNames +  ' ' + presentationNames +  ' ' + dashboardNames +  ' ' + widgetNames;

                message = 'You cannot delete this ' + sourceItem + ' because it is related ' + 
                                allNames.trim() + '.';
                */
                var message = 'You cannot delete this because it or child source has been related in any apps.';
                notifyService.errorNotify(message);
            };

            /**
             * Event Handler: it checks if there is match between keyword and tags name
             * @param {object}
             * @return {object}
             */

            var searchTagCallBack = function() {
                $scope.currentPage = 1;
                $cookies.put('searchSourceKey', $scope.searchTag.name);
                $scope.listFacilities($scope.searchTag.name);
            };

            var inputChangedPromise;
            $scope.startSearchTags = function() {
                if(inputChangedPromise){
                    $timeout.cancel(inputChangedPromise);
                }
                inputChangedPromise = $timeout(searchTagCallBack, $scope.searchDebounce);
/*
                if (!$scope.searchTag.name.length || $scope.searchTag.name.length < 2) {
                    $scope.searchPanel = false;
                    $scope.noMatch = true;
                    return;
                }

                $scope.searchPanel = true;

                var keyword = $scope.searchTag.name,
                    tagTypes = {
                        'Facility': 'resultFacilities',
                        'Scope': 'resultScopes',
                        'Node': 'resultNodes',
                        'Metric': 'resultMetrics'
                    },
                    noMatch = true;

                angular.forEach(tagTypes, function(tagContainer) {
                    if ($scope[tagContainer].length) {
                        angular.forEach($scope[tagContainer], function(tag) {
                            if (tag.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
                                noMatch = false;
                            }
                        });
                    }
                });

                $scope.noMatch = noMatch;
*/
            };

            $scope.searchBlur = function () { // has to deprecate
                $scope.ajaxLoading = false;
                $scope.noMatch = false;
                if (timeoutVar !== null) {
                    clearTimeout(timeoutVar);
                    $scope.showUtilityResults = false;
                }
            };

            /**
             * Check facility name, if user's input name isn't in the database, 
             * send an email to BP to add it.
             */
            $scope.checkUProviderExists = function(uprovider) {

                utilService.getUtilityProviders(uprovider).then(function (ups) {
                    if (!ups || !ups.length) {
                        console.log('Utility name not found in database. Alerting BP via email...');
                        utilService.sendEmailOfNewUtil(uprovider);
                    } else {
                        var found = false;
                        angular.forEach(ups, function(up) {
                            if (up.name.toLowerCase() === uprovider.toLowerCase()) {
                                found = true;
                            }
                        });
                        if (!found){
                            console.log('Utility name not found in database. Alerting BP via email...');
                            utilService.sendEmailOfNewUtil(uprovider);
                        }
                    }
                }, function () {
                    console.log('Utility name not found in database. Alerting BP via email...');
                    utilService.sendEmailOfNewUtil(uprovider);
                });
            };
            /**
             * when change source type, get parents
             * @param 
             * @return {object}
             */
            $scope.changeSourceType = function (type, dataSourceId) {
                switch($scope.sourceType) {
                    case '2':
                        if (type === 'source') {
                            $scope.listParents = $scope.resultFacilities;
                            if ($scope.facilityParent === undefined && $scope.resultFacilities.length > 0) {
                                $scope.facilityParent = $scope.resultFacilities[0]._id;
                            }
                            $scope.scopeNesting = false;
                            if ($scope.scopeParent === undefined && $scope.resultScopes.length > 0) {
                                $scope.scopeParent = $scope.resultScopes[0]._id;
                            }
                        } else {
                            if ($scope.scopeNesting === false) {
                                $scope.facilityParent = dataSourceId;
                            } else {
                                $scope.scopeParent = dataSourceId;
                            }
                        }
                        if ($scope.scopeNesting === false) {
                            angular.forEach($scope.resultFacilities, function(tempFacility){
                                if(tempFacility._id === $scope.facilityParent) {
                                    $scope.currentFacilityId = tempFacility._id;
                                    $scope.currentFacility = tempFacility;
                                }
                            });
                        } else {
                            angular.forEach($scope.resultScopes, function(tempScope){
                                if(tempScope._id === $scope.scopeParent) {
                                    $scope.currentScopeId = tempScope._id;
                                    $scope.currentScope = tempScope;
                                }
                            });
                            if ($scope.currentScope.parents[0].tagType === 'Facility') {
                                $scope.currentFacilityId = $scope.currentScope.parents[0].id;
                                angular.forEach($scope.resultFacilities, function(facility) {
                                    if (facility._id === $scope.currentFacilityId) {
                                        $scope.currentFacility = facility;
                                    }
                                });
                            }
                        }
                        
                        break;
                    case '3':
                        if (type === 'source') {
                            $scope.listParents = $scope.resultScopes;
                            if ($scope.scopeParent === undefined && $scope.resultScopes.length > 0) {
                                $scope.scopeParent = $scope.resultScopes[0]._id;
                            }
                        } else {
                            $scope.scopeParent = dataSourceId;
                        }
                        angular.forEach($scope.resultScopes, function(tempScope){
                            if(tempScope._id === $scope.scopeParent) {
                                $scope.currentScopeId = tempScope._id;
                                $scope.currentScope = tempScope;
                                $scope.addNode = {};
                                $scope.addNode.weatherStation = '--Use NOAA--'; 
                                $scope.addNode.latitude = tempScope.latitude; 
                                $scope.addNode.longitude = tempScope.longitude;
                            }
                        });
                        if ($scope.currentScope.parents[0].tagType === 'Facility') {
                            $scope.currentFacilityId = $scope.currentScope.parents[0].id;
                            angular.forEach($scope.resultFacilities, function(facility) {
                                if (facility._id === $scope.currentFacilityId) {
                                    $scope.currentFacility = facility;
                                }
                            });
                        }
                        
                        break;
                    case '4':
                        if (type === 'source') {
                            $scope.listParents = $scope.resultNodes;
                            if ($scope.nodeParent === undefined && $scope.resultNodes.length > 0) {
                                $scope.nodeParent = $scope.resultNodes[0]._id;
                            }
                        } else {
                            $scope.nodeParent = dataSourceId;
                            $scope.addMetricsDeviceIdList = [];
                            TagService.getTagInfoById($scope.nodeParent)
                              .then(function(info) {
                                  var scopeDeviceId = info.deviceID;
                                  var company = $scope.nodeCompanyList[info.device];
                                  TagService.getPossibleNodesMetricsByScope(scopeDeviceId, company)
                                    .then(function(nodes) {
                                        $scope.addMetricsDeviceIdList = nodes.nodes;
                                    });
                              });
                        }
                        
                        angular.forEach($scope.resultNodes, function(tempNode){
                            if(tempNode._id === $scope.nodeParent) {
                                $scope.currentNodeId = tempNode._id;
                                $scope.currentNode = tempNode;
                            }
                        });
                        $scope.currentScopeId = $scope.currentNode.parents[0].id;
                        angular.forEach($scope.resultScopes, function(scope) {
                            if (scope._id === $scope.currentScopeId) {
                                $scope.currentScope = scope;
                            }
                        });
                        if ($scope.currentScope.parents[0].tagType === 'Facility') {
                            $scope.currentFacilityId = $scope.currentScope.parents[0].id;
                            angular.forEach($scope.resultFacilities, function(facility) {
                                if (facility._id === $scope.currentFacilityId) {
                                    $scope.currentFacility = facility;
                                }
                            });
                        }
                        break;
                }
            };

             /**
             * Check enphase URL
             * @Event onChange
             * @param {object}
             * @return {object}
             */
            $scope.checkEnphaseURL = function(dataSource) {
                dataSource.enphaseUserId = $rootScope.currentUser.enphaseUserId;
                if (($rootScope.currentUser.enphaseUserId === null) && (dataSource.manufacturer === 'Enphase')) {
                    notyfy({
                        text: '<strong>You must log in to <a href="' + $rootScope.enphaseURL + 
                        '" target="_blank">Enphase portal</a> and grant access</strong><br>' + 
                        '<div class="click-close">{Click this bar to Close}',
                        type: 'warning',
                        dismissQueue: true
                    });
                }
            };


            /**
             * get utility data for auto complete
             * @param request func
             * @param response func
             * @return 
             */
            $scope.getUtilities = function (request, response) {
                utilService
                    .getUtilityProviders(request.term)
                    .then(function(ups) {
                        var utilities = [];
                        if (!ups || !ups.length) {
                            utilities.push({
                                label: 'Not Found',
                                value: ''
                            });
                        } else {
                            utilities = ups.map(function(u) {
                                return {
                                    label: u.name,
                                    value: u.name
                                };
                            });
                        }
                        response(utilities);
                    }, function () {
                        var utilities = [{
                            label: 'Not Found',
                            value: ''
                        }];
                        response(utilities);
                    });
            };

            /**
             * get manufacturer data for auto complete
             * @param request func, response func
             * @return 
             */
            $scope.getManufacturers = function (request, response) {
                TagService.listAllManufacturers(request.term).then(function(mans) {
                    var listManufacturers = [];
                    if (!mans || !mans.length) {
                        listManufacturers.push({
                            label: 'Not Found',
                            value: ''
                        });
                    } else {
                        listManufacturers = mans.map(function(u) {
                            return {
                                label: u.name,
                                value: u.name
                            };
                        });
                    }
                    response(listManufacturers);
                });
            };

            /**
             * get device data for auto complete
             * @param request func, response func
             * @return 
             */
            $scope.getDevices = function (request, response) {
                TagService.listAllDevices(request.term).then(function(resp) {
                    var devices = [];
                    if (!resp || !resp.length) {
                        devices.push({
                            label: 'Not Found',
                            value: ''
                        });
                    } else {
                        devices = resp.map(function(u) {
                            return {
                                label: u.name,
                                value: u.name
                            };
                        });
                    }
                    response(devices);
                });
            };

            //check metric name
            $scope.checkMetricName = function (metricName) {
                var checkStatus = 0;
                if ($scope.metricEventName === 'Update') {
                    return true;
                }
                angular.forEach($scope.currentNode.childTags, function(metric, index) {
                    if (metric.name === metricName) {
                        checkStatus = 1;
                    }
                });
                return !checkStatus;
            };

            // Invoke request to fetch user accessible tag list;
            $scope.init = function() {
                var searchKey = (!$scope.searchTag.name) ? '' : $scope.searchTag.name.trim();
                $scope.listFacilities(searchKey);
                $scope.timeZoneList = angular.copy($rootScope.timeZoneList);
                $scope.addScope.timezone = $rootScope.timeZone;
                $scope.getClientTimeZone();
            };
            
            $scope.$on('CPanelSourceInit', function () {
                $scope.backToSearchResult();
            });

            /**
             * Call tag service to get accessible users to the specified tag
             * @param {object} tagId
             * @return {object} tagObject
             */
            $scope.getAccessibleUsersByTag = function(tagId, tagObj) {
                TagService
                    .getAccessibleUsersByTag(tagId)
                    .then(function(users) {
                        var usernameArray = [];
                        angular.forEach(users, function(user) {
                            if (user && user.role !== 'BP') {
                                usernameArray.push(user.firstName + ' ' + user.lastName);
                            }
                        });
                        tagObj.accessibleUsers = usernameArray.join(', ');
                    });
            };

            /* 
             * upload data source file
             */
            
            $scope.metricSourceFields = [
                { 'name': 'Metric', 'column': ''},
                { 'name': 'DateTime', 'column': ''},
                { 'name': 'MetricValue', 'column': ''}
            ];
            /*
            $scope.sensorSourceFields = [
                { 'name': 'Name', 'field': 'name', 'column': ''},
                { 'name': 'Manufacturer', 'field': 'manufacturer', 'column': ''},
                { 'name': 'DeviceID', 'field': 'deviceID', 'column': ''},
                { 'name': 'Latitude', 'field': 'latitude', 'column': ''},
                { 'name': 'Longitude', 'field': 'longitude', 'column': ''}
            ];

            $scope.dataLoggerSourceFields = [
                { 'name': 'Name', 'field': 'name', 'column': ''},
                { 'name': 'Manufacturer', 'field': 'manufacturer', 'column': ''},
                { 'name': 'Device', 'field': 'device', 'column': ''},
                { 'name': 'DeviceID', 'field': 'deviceID', 'column': ''}
            ];
            */
            /*
             * parse uploaded source file
             */
            $scope.parseUploadedFile = function () {
                fileReader.readAsText($scope.sourceUploadInfo.file, $scope).then(function(result) {
                    $scope.sourceUploadInfo.rawData = result;
                    $scope.sourceUploadInfo.submitted = false;
                    $scope.sourceUploadInfo.disabled = false;
                    $scope.activePanelIndex = 11;

                    console.log('sourceUploadInfo', $scope.sourceUploadInfo);

                    if($scope.sourceUploadInfo.type === 'JSON') {
                        $scope.parseJSON();
                    }
                    else if($scope.sourceUploadInfo.type === 'CSV') {
                        $scope.parseCSV();
                    }

                    $scope.sourceUploadInfo.filteredContents = $scope.sourceUploadInfo.contents;

                    angular.forEach($scope.metricSourceFields, function (field, i) {
                        field.column = '';
                    });

                    /*
                    // fix scroll bar height
                    $timeout(function() {
                        var h = $(window).height() - $('#source_columns').height() - 502;
                        $('#source_table_section').height(h);
                    }, 100);
                    */
                });
            };

            /*
             * parse CSV
             */
            $scope.parseCSV = function () {
                var parsedArray = utilService.CSVToArray($scope.sourceUploadInfo.rawData);
                
                if(parsedArray.length > 0) {
                    angular.forEach(parsedArray[0], function (colName, colNum) {
                        $scope.sourceUploadInfo.columns.push({
                            'name': colName,
                            'value': colNum.toString(),
                            'selected': false 
                        });    
                    });

                    for(var i=1; i<parsedArray.length; i++) {
                        if(parsedArray[i].length === parsedArray[0].length) {
                            $scope.sourceUploadInfo.contents.push(parsedArray[i]);        
                        }
                    }
                    
                    //console.log(utilService.arrayToJSON(parsedArray));
                }
            };

            /*
             * parse JSON
             */
            $scope.parseJSON = function () {
                var keys = [];
                var parsedData = JSON.parse($scope.sourceUploadInfo.rawData);
                
                if(!angular.isArray(parsedData)) {
                    parsedData = [parsedData];
                }

                // get keys
                angular.forEach(parsedData, function (row, i) {
                    angular.forEach(row, function (val, key) {
                        if(keys.indexOf(key) === -1) {
                            keys.push(key);
                        }
                    });
                });

                if(keys.length > 0) {
                    // make columns
                    angular.forEach(keys, function (key, i) {
                        $scope.sourceUploadInfo.columns.push({
                            'name': key,
                            'value': i.toString(),
                            'selected': false 
                        });    
                    });

                    // get contents
                    angular.forEach(parsedData, function (row, i) {
                        $scope.sourceUploadInfo.contents[i] = [];
                        angular.forEach(keys, function (key, j) {
                            if(row[key] === undefined) {
                                $scope.sourceUploadInfo.contents[i][j] = '';
                            }
                            else {
                                $scope.sourceUploadInfo.contents[i][j] = row[key];
                            }
                        });
                    });
                }
            };

            $scope.changeSourceColumn = function () {
                if(!$scope.sourceUploadInfo.disabled) {
                    var metricCol = '';

                    angular.forEach($scope.sourceUploadInfo.columns, function (colSource, col) {
                        colSource.selected = false;
                        angular.forEach($scope.metricSourceFields, function (field, i) {
                            if(colSource.value.toString() === field.column.toString()) {
                                colSource.selected = true;
                                
                                if(field.name === 'Metric') {
                                    metricCol = parseInt(field.column);
                                }
                            }
                        });
                    });

                    // filter by Metric
                    var metricId = $scope.addMetric.metricID;
                    $scope.sourceUploadInfo.filteredContents = [];
                    angular.forEach($scope.sourceUploadInfo.contents, function(row, i) {
                        if(row[metricCol] === metricId) {
                            $scope.sourceUploadInfo.filteredContents.push(row);
                        }
                    });
                }
            };

            $scope.backToScope = function (index) {
                $scope.activePanelIndex = 10;
            };

            $scope.submitDataSources = function() {
                $scope.sourceUploadInfo.submitted = true;

                var valid = true, sourceData = [];

                for(var i=0; i<$scope.metricSourceFields.length; i++) {
                    if($scope.metricSourceFields[i].column === '') {
                        valid = false;
                        break;
                    }
                }

                if(valid) {
                    if($scope.sourceUploadInfo.filteredContents.length === 0) {
                        $scope.sourceUploadInfo.result = 'fail';
                    }
                    else {
                        angular.forEach($scope.sourceUploadInfo.filteredContents, function(row, i) {
                            sourceData[i] = {};
                            angular.forEach($scope.metricSourceFields, function(sourceField, k) {
                                sourceData[i][sourceField.name] = row[sourceField.column];
                            });
                        });
                        
                        var tagData = {
                            'metricId': $scope.addMetric._id,
                            'sourceData': sourceData
                        };

                        $scope.sourceUploadInfo.disabled = true;

                        TagService
                            .addTagData(tagData)
                            .then(function() {
                                $scope.sourceUploadInfo.result = 'success';
                                $scope.sourceUploadInfo.disabled = false;
                            }, function() {
                                $scope.sourceUploadInfo.result = 'fail';
                                $scope.sourceUploadInfo.disabled = false;
                            });
                    }
                } else {
                    $scope.sourceUploadInfo.result = false;
                }
            };

            /*
            * Pagination functions
            * goFirstpage, goPrevPage, goNextPage, goLastPage
            */

            $scope.goFirstPage = function() {
                if($scope.currentPage === 1) {
                    return ;
                }

                $scope.currentPage = 1;

                var searchKey = (!$scope.searchTag.name) ? '' : $scope.searchTag.name.trim();
                $scope.listFacilities(searchKey);
            };

            $scope.goPrevPage = function() {
                if($scope.currentPage <= 1) {
                    return ;
                }

                $scope.currentPage--;

                var searchKey = (!$scope.searchTag.name) ? '' : $scope.searchTag.name.trim();
                $scope.listFacilities(searchKey);
            };

            $scope.goNextPage = function() {
                if($scope.currentPage >= $scope.totalPage) {
                    return ;
                }

                $scope.currentPage++;

                var searchKey = (!$scope.searchTag.name) ? '' : $scope.searchTag.name.trim();
                $scope.listFacilities(searchKey);
            };

            $scope.goLastPage = function() {
                if($scope.currentPage === $scope.totalPage) {
                    return ;
                }

                $scope.currentPage = $scope.totalPage;

                var searchKey = (!$scope.searchTag.name) ? '' : $scope.searchTag.name.trim();
                $scope.listFacilities(searchKey);
            };

            $scope.init();            

            $scope.selectedAddNodeDevice = function(event, ui) {
                var scopeId = $scope.currentScope.deviceID;
                var company = $scope.nodeCompanyList[$scope.addNode.device]; //'webbox';
                TagService.getPossibleNodesMetricsByScope(scopeId, company)
                  .then(function(nodes) {
                      $scope.addNodeDeviceIDList = nodes.nodes;
                  })
                  .catch(function() {
                      $scope.addNodeDeviceIDList = [];
                  });
            };

            $scope.clearSearch = function($select) {
                //$event.stopPropagation();
                //to allow empty field, in order to force a selection remove the following line
                $select.selected = undefined;
                //reset search query
                $select.search = undefined;
                //focus and open dropdown
                $select.activate();
            };

            $scope.refreshAddNodeDeviceIDResults = function($select) {
                var search = $select.search;
                var list = [];
                if ($scope.addNodeDeviceIDList) {
                    list = angular.copy($scope.addNodeDeviceIDList);
                }

                list = list.filter(function(item) {
                    var itemLowercase = item.toLowerCase();
                    var searchLowercase = search.toLowerCase();
                    if (search) {
                        if (itemLowercase.indexOf(searchLowercase) !== -1) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                    return 1;
                });

                if (!search) {
                    $scope.clearSearch($select);
                    $select.items = list;
                }
                else {
                    var userInputItem = search;
                    $select.items = [userInputItem].concat(list);
                    $select.selected = userInputItem;
                }
            };

            $scope.refreshAddNode2DeviceIDResults = function($select) {
                var search = $select.search;
                var list = [];
                if ($scope.addNode2DeviceIDList) {
                    list = angular.copy($scope.addNode2DeviceIDList);
                }

                list = list.filter(function(item) {
                    var itemLowercase = item.toLowerCase();
                    var searchLowercase = search.toLowerCase();
                    if (search) {
                        if (itemLowercase.indexOf(searchLowercase) !== -1) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                    return 1;
                });

                if (!search) {
                    $scope.clearSearch($select);
                    $select.items = list;
                }
                else {
                    var userInputItem = search;
                    $select.items = [userInputItem].concat(list);
                    $select.selected = userInputItem;
                }
            };

            $scope.refreshAddMetricsDeviceIDResults = function ($select) {
                var search = $select.search;
                var list = [];
                if ($scope.addMetricsDeviceIdList) {
                    list = angular.copy($scope.addMetricsDeviceIdList);
                }

                list = list.filter(function(item) {
                    var itemLowercase = item.toLowerCase();
                    var searchLowercase = search.toLowerCase();
                    if (search) {
                        if (itemLowercase.indexOf(searchLowercase) !== -1) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                    return 1;
                });

                if (!search) {
                    $scope.clearSearch($select);
                    $select.items = list;
                }
                else {
                    var userInputItem = search;
                    $select.items = [userInputItem].concat(list);
                    $select.selected = userInputItem;
                }
            };

            $scope.$watch('activePanelIndex', function(oldVal, newVal) {
               if (newVal === 8) { //open add new node page
                   $scope.addNodeDeviceIDList = [];
               }
            });

            $scope.selectedAddNode2Device = function(event, ui) {
                var scopeId = $scope.scopeParent;
                var company = $scope.nodeCompanyList[$scope.addNode.device]; //'Webbox';

                TagService.getTagInfoById(scopeId)
                  .then(function(info) {
                      var scopeDeviceId = info.deviceID;
                      TagService.getPossibleNodesMetricsByScope(scopeDeviceId, company)
                        .then(function(nodes) {
                            $scope.addNode2DeviceIDList = nodes.nodes;
                        })
                        .catch(function() {
                            $scope.addNode2DeviceIDList = [];
                        });
                  });
            };
        }
    ]);