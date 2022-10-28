angular.module('blApp.components.companyPanel')
    .controller('CompanyGroupsController', ['$scope', '$rootScope', '$compile', 
        '$http', '$timeout', '$filter', 'TagService', 'GroupService', 'utilService', 'fileReader', '$q',
        function($scope, $rootScope, $compile, $http, $timeout, $filter, TagService, 
            GroupService, utilService, fileReader, $q) {

            $scope.groupExpanded = [];
            $scope.activePanelIndex = 0;
            $scope.groupList = [];
            $scope.relatedSources = [];
            $rootScope.currentGroupId = '';
            $scope.childrens = [];
            $scope.addGroup = {};
            $scope.editGroup = {};
            $scope.tags = [];
            $scope.allSources = [];


            $scope.listGroups = function(groups) {
                var groupItem = {};
                if (!groups.length) {
                    $scope.tags = [];
                    return ;
                }
                angular.forEach(groups, function(group) {
                    groupItem = {};
                    groupItem.text = group.name;
                    groupItem.type = 'Group';
                    groupItem.id = group._id;
                    groupItem.information = group.information;
                    groupItem.related = [];
                    angular.forEach(group.children, function(children) {
                        groupItem.related.push({text: children.name, type: children.sourceType, id: children.id});
                    });
                    $scope.groupList.push(groupItem);
                    $scope.relatedSources.push(groupItem.related);
                    $scope.groupExpanded.push(false);
                });
            };

            $scope.listAvailableGroups = function(groups) {
                $scope.allSources = [];
                var sourceItem = {};
                angular.forEach(groups, function(source) {
                    sourceItem = {};
                    sourceItem.text = source.name;
                    sourceItem.id = source._id;
                    if (source.tagType) {
                        sourceItem.type = source.tagType;
                    } else {
                        sourceItem.type = 'Group';
                    }
                    $scope.allSources.push(sourceItem);
                });
            };

            $scope.init = function (){
                $scope.groupList = [];
                $scope.relatedSources = [];
                GroupService.listGroups().then(function(groups) {
                    $scope.getGroups(groups);
                });
                GroupService.availableGroups().then(function (groups) {
                    $scope.getAvailableGroups(groups);
                });
            };
            $scope.loadTags = function(query, groupId) {
                var deferred = $q.defer();
                var items = [];
                for (var i = 0; i < $scope.allSources.length; i++) {
                    if (($scope.allSources[i].text.indexOf(query) > -1) && ($scope.allSources[i].id !== groupId)) {
                        items.push($scope.allSources[i]);
                    }
                }
                deferred.resolve(items);
                return deferred.promise;
            };

            $scope.$on('CPanelGroupInit', function () {
                //$scope.init();
                $scope.backToSearchResult();
            });

            $scope.backToSearchResult = function() {
                $scope.activePanelIndex = 0;
                $scope.groupExpanded = [];
                $timeout(function() {
                    angular.element('#search-box').focus();
                }, 100);
            };

            $scope.expandDetail = function(groupIndex, groupId) {
                if ($scope.groupExpanded[groupIndex]) {
                    $scope.groupExpanded[groupIndex] = false;
                } else {
                    $scope.groupExpanded = [];
                    $scope.groupExpanded[groupIndex] = true;
                    $rootScope.currentGroupId = groupId;
                }
            };

            $scope.openCreateGroup = function() {
                $scope.oldPanelIndex = $scope.activePanelIndex;
                $scope.activePanelIndex = 1;
                $scope.tags = [];
                $scope.childrens = [];
                $rootScope.currentGroupId = '';
                $scope.addGroup = {};
            };

            $scope.openEditGroup = function() {
                $scope.oldPanelIndex = $scope.activePanelIndex;
                $scope.activePanelIndex = 2;
                $scope.childrens = [];
                $scope.editGroup = {};
                $scope.editGroup = $filter('filter')($scope.groupList, {id:$scope.currentGroupId})[0];
                $scope.editGroup.name = $scope.editGroup.text;
                angular.forEach($scope.editGroup.related, function(children){
                    $scope.childrens.push({id: children.id, 
                            text: children.text, type: children.type});
                });
            };

            $scope.createGroup = function(){
                var inputJson = $scope.addGroup;
                inputJson.children = $scope.childrens;
                GroupService.AddGroup(inputJson).then(function(group){
                    var groupItem = {};
                    groupItem.text = group.name;
                    groupItem.type = 'Group';
                    groupItem.id = group._id;
                    groupItem.information = group.information;
                    groupItem.related = [];
                    angular.forEach(group.children, function(children) {
                        var temp = $filter('filter')($scope.allSources, {id: children.id})[0];
                        groupItem.related.push({text: temp.text, type: children.sourceType, id: children.id});
                    });
                    $scope.groupList.push(groupItem);
                    $scope.relatedSources.push(groupItem.related);
                    $scope.groupExpanded.push(false);
                    $scope.$broadcast('CPanelGroupInit');
                });
            };

            $scope.EditGroup = function(){
                var inputJson = $scope.editGroup;
                console.log($scope.childrens);
                angular.forEach($scope.childrens, function(children){
                    delete children['sourceType'];
                    children.sourceType = children.type;
                });
                inputJson.children = $scope.childrens;
                GroupService.EditGroup(inputJson).then(function(result){
                    $scope.$broadcast('CPanelGroupInit');
                    $scope.init();
                });
            };

            $scope.toggleDeleteGroup = function(source, type, showType, $event) {
                if (showType === 'show') {
                    source.toggleDelete = true;
                } else {
                    source.toggleDelete = false;
                }
            };

            $scope.deleteGroup = function (groupId) {
                GroupService.deleteGroup(groupId).then(function(resp) {
                    $('.group-' + groupId).slideUp('slow');
                    for (var i = 0; i < $scope.relatedSources.length; i++) {
                        $scope.relatedSources[i] =
                            $filter('filter')($scope.relatedSources[i], {id: '!'+groupId});
                    }
                    $scope.allSources =
                        $filter('filter')($scope.allSources, {id: '!'+groupId});
                });
            };

            $rootScope.$on('CompanyGroupAdded', function(data) {
                if (($scope.activePanelIndex === 1)){
                    $scope.childrens.push({id: data.currentScope.newSourceId, 
                        sourceType: data.currentScope.newSourceType});
                    return false;
                } else if ($scope.activePanelIndex === 2) {
                    return false;
                } 
                var inputJson = {groupId:$rootScope.currentGroupId, sourceId:data.currentScope.newSourceId, 
                                sourceType:data.currentScope.newSourceType};
                GroupService.AddGroupSource(inputJson).then(function(result){
                    console.log(result);
                });
            });

            $rootScope.$on('CompanyGroupRemoved', function(data) {
                if ($scope.activePanelIndex === 2) {
                    return false;
                }
                var inputJson = {groupId:$rootScope.currentGroupId, sourceId:data.currentScope.removeSourceId,
                                sourceType:data.currentScope.removeSourceType};
                GroupService.RemoveGroupSource(inputJson).then(function(result){
                    console.log(result);
                });
            });

            //$scope.init();
            $scope.listGroups(renderGroups);
            $scope.listAvailableGroups(renderAvailableGroups);
        }
    ]).config(function(tagsInputConfigProvider) {
        tagsInputConfigProvider
            .setDefaults('tagsInput', {
                placeholder: 'Type here...',
                addOnEnter: true,
                addOnBlur: false,
                allowLeftoverText: true,
                addFromAutocompleteOnly: true
            })
            .setDefaults('autoComplete', {
                highlightMatchedText: true,
                minLength: 1,
                maxResultsToShow: 50
            })
            .setActiveInterpolation('tagsInput', {
                placeholder: true,
                removeTagSymbol: true,
                addOnEnter: true,
                allowLeftoverText: true,
                maxTags: true,
                minTags: true,
                type: true
            });
    });