'use strict';

angular.module('blApp.management.controllers').controller(
    'PresentationDataSensorController',
        ['$scope', '$rootScope', '$compile', '$http', '$timeout', '$q', '$filter', '$cookieStore',
         'TagService', 'notifyService',
        function ($scope, $rootScope, $compile, $http, $timeout, $q, $filter, $cookies,
                  TagService, notifyService) {

            $scope.treedata = [];
            $scope.expandedNodes = [];
            $scope.isExpanded = true;

            $scope.userDataSource = [];
            $scope.presentationDataSource = []; //=dashboardSegments

            $scope.readyUserDataSource = false;
            $scope.readyPresentationDataSource = false;

            $scope.allowAutoActivate = true;

            $scope.levelTagMap = {
                1: 'Metric',
                2: 'Node',
                3: 'Scope',
                4: 'Facility' 
            };
            $scope.tagBindings = [];

            /* Pagination Variables */
            $scope.totalPage = 4;
            $scope.currentPage = 1;
            $scope.limit = 30;
            $scope.offset = 0;
            $scope.totalCount = 0;

            $scope.searchDebounce = 350;
            $scope.searchNode = [];
            $scope.searchNode.name = $cookies.get('searchNodeKey');

            /**
            * Building new tree based on current user's datasource, it is using recurive procedure for configuring tree
            * @param {string}
            * @return {object}
            */
            $scope.buildUserDataSourceTree = function(filter) {
                var deferred = $q.defer();

                var searchKey = (!filter) ? '' : filter.trim();
                $scope.nodeLoading = true;
                TagService
                    .listAccessibleTagsByUser($rootScope.currentUser._id, $scope.limit,
                         ($scope.currentPage - 1) * $scope.limit, searchKey)
                    .then(function (datasources) {
                        $scope.nodeLoading = false;
                        $scope.totalCount = parseInt(datasources._responseHeader_['x-total-count']);
                        $scope.totalPage =  Math.floor($scope.totalCount / $scope.limit) + 
                                                    ($scope.totalCount % $scope.limit > 0 ? 1 : 0);

                        $scope.userDataSource = datasources;
                        $scope.treedata = [];
                        $scope.expandedNodes.splice(0, $scope.expandedNodes.length);

                        angular.forEach(datasources, function (childDataSource) {
                            $scope.recursiveUserDataSourceProc(childDataSource, '', $scope.treedata,
                                $scope.userDataSource);
                        });

                        $scope.readyUserDataSource = true;

                        deferred.resolve(datasources);
                    }, function () {
                        deferred.reject('The requested api call has faild');
                    });

                return deferred.promise;
            };

            /**
            * Recursive procedure for building new tree based on current user's datasource
            * @param {string}
            * @return {object}
            */
            $scope.recursiveUserDataSourceProc = function(datasource, parentId, parentObj) {
                var childs;
                var treeitem = {};

                treeitem.id = datasource.tagType.toLowerCase() + '_' + datasource._id;
                treeitem.name = datasource.name;
                treeitem.visible = false;
                treeitem._id = datasource._id;
                treeitem.children = [];
                treeitem['parent_id'] = parentId;

                switch(datasource.tagType.toLowerCase()) {
                    case 'facility':
                        treeitem.type = 'facility';
                        treeitem.level = 4;
                        break;
                    case 'scope':
                        treeitem.type = 'scope';
                        treeitem.level = 3;
                        break;
                    case 'node':
                        treeitem.type = 'node';
                        treeitem.level = 2;
                        break;
                    case 'metric':
                        treeitem.type = 'dmetric';
                        treeitem.level = 1;
                        break;
                }
                childs = datasource.childTags;

                parentObj.push(treeitem);

                if(datasource.tagType.toLowerCase() === 'metric' || !childs.length) {
                    return true;
                }

                angular.forEach(childs, function(childDataSource, index){
                    $scope.recursiveUserDataSourceProc(childDataSource, datasource._id, treeitem.children);
                });

                return false;
            };
            /**
             * get Object from object list by specified key field
             * @param id         : search keyword
             * @param objects    : object array
             * @param idField    :
             * @returns {*}
             */
            $scope.getObjById = function( id, objects, idField) {
                var i;
                if (!objects.length) {
                    return;
                }
                for(i = 0; i < objects.length; i++) {
                    if (objects[i][idField] === id) {
                        return objects[i];
                    }
                }
                return;
            };

            /**
            * Set active stats (in tree, it means set visible flag) in sub tree.
            * Every child's active stat will depends on the parent's stat
            * @param {string} rootId Current User ID
            * @return {object}
            */
            $scope.setVisibleStats = function(treedata, visible) {
                if(!treedata.children) {
                    return true;
                }

                treedata.visible = visible;

                angular.forEach(treedata.children, function(treeitem, index){
                    $scope.setVisibleStats(treeitem, visible);
                });

                return false;
            };
            /**
             * Render active stats (in tree, it means set visible flag) in sub tree.
             * Every child's active stat will depends on the parent's stat
             * @param {string} rootId Current User ID
             * @return {object}
             */
            $scope.renderVisibleStats = function(treedata, visible, requireExpand) {
                var isChildExpanded = false;
                var isSelectedDS = false;

                treedata.visible = visible;
                if (!visible) {
                    if($scope.getObjById(treedata._id, $rootScope.presentationDetails.tagBindings, 'id') !== undefined){
                        treedata.visible = true;
                        isSelectedDS = true;
                    }
                }

                angular.forEach(treedata.children, function(treeitem, index){
                    if ($scope.renderVisibleStats(treeitem, treedata.visible, requireExpand) ) {
                        isChildExpanded = true;
                    }
                });
                if ( isChildExpanded && requireExpand ) {
                    $scope.expandedNodes.push(treedata);
                }
                return isChildExpanded || isSelectedDS;
            };
            /**
            * Auto merging active status through specified subtree (or all tree) with treedata
            * If all children activated, the parent will be active as well. 
            * Otherwise, in case of all deactivated, will work vise-versa
            * @param {obj} treedata Current User ID
            * @param {parentStat} parentStat Current User ID
            * @return {object}
            */
            $scope.autoVisibleStats = function(treedata, parentStat) {

                if(!treedata.children.length) {
                    return treedata.visible;
                }

                parentStat = true;
                angular.forEach(treedata.children, function(treeitem, index){
                    parentStat = parentStat && $scope.autoVisibleStats( treeitem, parentStat );
                });

                treedata.visible = parentStat;

                return treedata.visible;
            };

            /**
            * Update active/deactive status for event taget
            * @param {string} rootId Current User ID
            * @return {object}
            */
            $scope.activateDataSource = function(e, source) {
                if (!$rootScope.Bvmodifyable) {
                    notifyService.errorNotify('Presentation is locked. You don\'t have permission to update.');
                    return false;
                }
                e.stopPropagation();
                var visible = !source.visible;
                /*var method = visible ? 'POST' : 'DELETE';*/
                $scope.tagBindings = [];

                $scope.setVisibleStats(source, visible);

                if($scope.allowAutoActivate) {
                    angular.forEach($scope.treedata, function(treeitem, index){
                        $scope.autoVisibleStats(treeitem, true);
                        $scope.getTagBindings(treeitem);
                    });
                }
                //$scope.processRequest(source, method);
                $scope.processRequestQueue();
            };


            /**
             * Get actived tagBindings
             * @param tag data
             * @return {object}
             */
            $scope.getTagBindings = function(tag) {
                var tagType;
                if(tag.visible) {
                    switch(tag.type) {
                        case 'facility':
                            tagType = 'Facility';
                            break;
                        case 'scope':
                            tagType = 'Scope';
                            break;
                        case 'node':
                            tagType = 'Node';
                            break;
                        case 'dmetric':
                            tagType = 'Metric';
                            break;
                    }

                    var newTag = {
                        'tagType': tagType,
                        'id': tag._id
                    };
                    $scope.tagBindings.push(newTag);
                    return true;
                } else {
                    if(!tag.children) {
                        return true;
                    }
                    angular.forEach(tag.children, function(child){
                        $scope.getTagBindings(child);
                    });
                }

                return false;
            };
            /**
             * Processing update datasource request with TagService
             * @return {object}
             */
            $scope.processRequestQueue = function() {
                var request = {
                    'presentationId': $rootScope.presentationId,
                    'tagBindings': $scope.tagBindings
                };

                TagService
                    .updatePresentationDataSourceWithTag(request)
                    .then(function(resp) {
                        $rootScope.$emit('PresentationTagsUpdated');
                        $rootScope.presentationDetails.tagBindings = angular.copy(resp.tagBindings);
                        angular.forEach($scope.treedata, function(treeitem){
                            $scope.renderVisibleStats(treeitem, false, false);
                        });
                    });
            };
            /**
            * Processing add/delete datasource request with TagService
            * @param {string} rootId Current User ID
            * @return {object}
            */
            $scope.processRequest = function(source, method) {
                var request;
                var tag = angular.copy(source);
                tag.id = tag._id;
                request = {
                    'presentationId': $rootScope.presentationId,
                    'tagBinding': tag
                };
                /*$scope.tagBindings*/

                if(method === 'POST') {
                    TagService
                        .createPresentationDataSourceWithTag(request)
                        .then(function(resp) {
                            $rootScope.presentationDetails.tagBindings = angular.copy(resp.tagBindings);
                            angular.forEach($scope.treedata, function(treeitem){
                                $scope.renderVisibleStats(treeitem, false, false);
                            });
                        });
                } else {
                    TagService
                        .deletePresentationDataSourceWithTag(request)
                        .then(function(resp) {
                            $rootScope.presentationDetails.tagBindings = angular.copy(resp.tagBindings);
                            angular.forEach($scope.treedata, function (treeitem) {
                                $scope.renderVisibleStats(treeitem, false, false);
                            });
                        });
                }
            };

            /**
            * Entry point of this controller, will be bootstraped when presentation initialization event triggered
            * @param {string}
            * @return {object}
            */
            $scope.init = function () {
                var searchKey = (!$scope.searchNode.name) ? '' : $scope.searchNode.name.trim();
                $scope.buildUserDataSourceTree(searchKey).then(function(result){
                });
            };

            /**
             * When create datasource, build data sources tree again.
             */
            $rootScope.$on('DataSourceUpdated', function() {
                var searchKey = (!$scope.searchNode.name) ? '' : $scope.searchNode.name.trim();
                $scope.buildUserDataSourceTree(searchKey).then(function(result){
                    if ($rootScope.presentationDetails && $rootScope.presentationDetails._id) {
                        angular.forEach($scope.treedata, function(treeitem){
                            $scope.renderVisibleStats(treeitem, false, true);
                        });
                    }
                });
            });

            /**
             * When current presentation changed.
             */

            $rootScope.$on('PresentationDetailsLoaded', function() {
                $scope.expandedNodes.splice(0, $scope.expandedNodes.length);
                angular.forEach($scope.treedata, function(treeitem){
                    $scope.renderVisibleStats(treeitem, false, true);
                });
            });

            /*
            * Update Data source Tree
            */
            $scope.updateUserDataTree = function () {
                var searchKey = (!$scope.searchNode.name) ? '' : $scope.searchNode.name.trim();
                $scope.buildUserDataSourceTree(searchKey).then(function(result){
                    if ($rootScope.presentationDetails && $rootScope.presentationDetails._id) {
                        angular.forEach($scope.treedata, function(treeitem){
                            $scope.renderVisibleStats(treeitem, false, true);
                        });
                    }
                });
            };

            /*
            * Start search node when input search box
             */
            $scope.searchNodeCallBack = function() {
                $scope.currentPage = 1;
                $cookies.put('searchNodeKey', $scope.searchNode.name);
                $scope.buildUserDataSourceTree($scope.searchNode.name);
            };

            var inputChangedPromise;
            $scope.startSearchNode = function () {
                if(inputChangedPromise){
                    $timeout.cancel(inputChangedPromise);
                }
                inputChangedPromise = $timeout($scope.searchNodeCallBack, $scope.searchDebounce);
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

                $scope.updateUserDataTree();
            };

            $scope.goPrevPage = function() {
                if($scope.currentPage <= 1) {
                    return ;
                }

                $scope.currentPage--;

                $scope.updateUserDataTree();
            };

            $scope.goNextPage = function() {
                if($scope.currentPage >= $scope.totalPage) {
                    return ;
                }

                $scope.currentPage++;

                $scope.updateUserDataTree();
            };

            $scope.goLastPage = function() {
                if($scope.currentPage === $scope.totalPage) {
                    return ;
                }

                $scope.currentPage = $scope.totalPage;

                $scope.updateUserDataTree();
            };

            $scope.init();
        }
]);