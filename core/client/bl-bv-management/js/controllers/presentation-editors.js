'use strict';
angular.module('blApp.management.controllers').controller('PresentationEditorsController', [
    '$scope',
    '$rootScope',
    '$compile',
    '$http',
    '$timeout',
    '$filter',
    'EditorService',
    'notifyService',
    'TagService',
    function ($scope, $rootScope, $compile, $http, $timeout, $filter, EditorService, notifyService, TagService) {
            $scope.openEditor = false;

            $scope.editorDataSources = [];
            $scope.editorRootDataSourceIds = [];
            $scope.editorAllDataSourceIds = [];

            $scope.presentationDataSources = [];
            $scope.presentationRootDataSourceIds = [];
            $scope.presentationAllDataSourceIds = [];

            $scope.readyEditorDataSources = false;
            $scope.readyPresentationDataSources = false;
            
            $scope.diffDataSourceIds = [];
            $scope.diffDataSources = [];

            $scope.treedata = [];
            $scope.isExpanded = true;
            $scope.expandedNodes = [];

            
            $scope.init = function(){
                $scope.allUsers = renderPresentUsers;
                $scope.editors = [];
            };
            /**
            * List all editors based on EditorService
            * @param {string}
            * @return {object}
            */
            $scope.listEditors = function( isFetchPresentationUsers ) {
                EditorService
                    .getAllUsersEx({roles: ['Admin', 'TM'], apps: ['BrighterView']})
                    .then(function (users) {
                        $scope.allUsers = users;
                        $scope.editors = [];
                        if (isFetchPresentationUsers) {
                            $scope.refreshActiveEditors();
                        }
                    });
            };

            /**
            * List all editors based on EditorService
            * @param {string}
            * @return {object}
            */
            $scope.filterRootDataSourceIds = function(datasource, rootDataSourceIds) {
                angular.forEach(datasource, function(childDataSource, index){
                    rootDataSourceIds.push(childDataSource._id);
                });

                return rootDataSourceIds;
            };

            /**
            * List all editors based on EditorService
            * @param {string}
            * @return {object}
            */
            $scope.filterAllDataSourceIds = function(datasource, allDataSourceIds) {

                allDataSourceIds.push(datasource._id);

                if (typeof datasource.childTags === 'undefined' ){
                    console.log(datasource);
                    return true;
                }

                if(datasource.dataSourceType === 'Metric' || !datasource.childTags.length) {
                    return true;
                }
                
                angular.forEach(datasource.childTags, function(childDataSource) {
                    $scope.filterAllDataSourceIds(childDataSource, allDataSourceIds);
                });

                return false;
            };

            /**
            * List all editors based on EditorService
            * @param {string}
            * @return {object}
            */
            $scope.checkDiffDataSourceIds = function(datasourcesA, datasourcesB) {
                var diffs = [];

                if($.contains(datasourcesA, datasourcesB)) {
                    return null;
                }

                angular.forEach(datasourcesB, function(datasource, index) {
                    if(datasourcesA.indexOf(datasource) < 0) {
                        diffs.push(datasource);
                    }
                });
               
                return diffs;
            };
            /**
            *
            *
            */
            $scope.existInTaglist = function (tagList, id) {
                for (var i = 0; i < tagList.length; i++) {
                    if (tagList[i].id === id) {
                        return true;
                    }
                }
                return false;
            };
            /**
            * Mark on different data sources by presentation TagBindings  $scope.addEditor.accessibleTags,
            *    $rootScope.presentationDetails.tagBindings
            * @param {string}
            * @return {object}
            */
            $scope.fetchDiffDataSources = function ( datasources, isParentSrcActive, isParentDstActive ) {
                //
                var hasDifference = false;
                var childHasDifference = false;

                angular.forEach( datasources, function( datasource, index ) {
                    childHasDifference = false;
                    if (isParentSrcActive
                        || $scope.existInTaglist($scope.addEditor.accessibleTags, datasource._id)) {
                        datasource.isSrcActive = true;
                    } else {
                        datasource.isSrcActive = false;
                    }

                    if (isParentDstActive
                        || $scope.existInTaglist($rootScope.presentationDetails.tagBindings, datasource._id)) {
                        datasource.isDstActive = true;
                    } else {
                        datasource.isDstActive = false;
                    }

                    if ( datasource.isSrcActive && datasource.isDstActive ) {
                        datasource.visible = false;
                    } else {
                        datasource.childHasDifference = $scope.fetchDiffDataSources( datasource.childTags,
                            datasource.isSrcActive, datasource.isDstActive )        ;
                        if (datasource.childHasDifference) {
                            datasource.visible = true;
                            hasDifference = true;
                        } else {
                            datasource.visible = (datasource.isSrcActive !== datasource.isDstActive);
                            hasDifference = hasDifference || datasource.visible;
                        }
                    }
                });
                return hasDifference;
                /*
                var diffs = [];

                $scope.diffDataSources = [];
                
                angular.forEach($scope.presentationDataSources, function(datasource, index) {
                    if($scope.diffDataSourceIds.indexOf(datasource._id) != -1)
                        diffs.push(datasource);
                });
               
                $scope.diffDataSources = diffs;
                
                return diffs;
                */
            };

            /**
            * List all editors based on EditorService
            * @param {string}
            * @return {object}
            */
            $scope.buildDiffDataSourcesTree = function() {
                $scope.treedata = [];
                
                angular.forEach($scope.editorDataSources, function(datasource, index) {
                    $scope.recursiveDataSourceProc(datasource,'', $scope.treedata);
                });
            };

            /**
            * Recursive procedure for building new tree based on given datasource
            * @param {string}
            * @return {object}
            */
            $scope.recursiveDataSourceProc = function(datasource, parentId, parentObj) {
                var childs;
                var treeitem = {};

                treeitem.id = datasource.tagType.toLowerCase() + '_' + datasource._id;
                treeitem.name = datasource.name;
                treeitem.visible = datasource.visible;
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

                if($scope.isExpanded) {
                    $scope.expandedNodes.push(treeitem);
                }

                angular.forEach(childs, function(childDataSource){
                    $scope.recursiveDataSourceProc(childDataSource, datasource._id, treeitem.children);
                });

                return false;
            };

            /**
            * List all editors based on EditorService
            * @param {string}
            * @return {object}
            */
            $scope.createEditor = function () {
                EditorService
                    .addPresentationEditor($scope.addEditor._id, $rootScope.presentationId)
                    .then(function(resp) {
                        $scope.listEditors(true);
                        $('#open-create-editor').hide();
                        $rootScope.$emit('UpdateUserAccessibleTags', resp);
                    });
            };

            /**
            * Delete an editor based on EditorService
            * @param {string}
            * @return {object}
            */
            $scope.deleteEditor = function (editor) {
                EditorService.deletePresentationEditor(editor._id, $rootScope.presentationId).then(function(resp) {
                    $('.editor-'+editor._id).slideUp('slow', function() {
                        $scope.listEditors(true);
                    });
                    $rootScope.$emit('UpdateUserAccessibleTags', resp);
                });
            };

            /**
            * Open editor panel to create an editor
            * @param {string}
            * @return {object}
            */
            $scope.openCreateEditor = function (e, user) {
                if (!$rootScope.Bvmodifyable) {
                    notifyService.errorNotify('Presentation is locked. You don\'t have permission to update.');
                    return false;
                }
                var offsetTop = parseInt($(e.target).parent().offset().top);
                var top;
                if (offsetTop > 580) {
                    top = offsetTop - 580 - 61;
                    console.log(top);
                    $('#open-create-editor').css('top', top + 'px');
                } else {
                    top = offsetTop - 61;
                    console.log(top);
                    $('#open-create-editor').css('top', top + 'px');
                }

                $scope.addEditor = user;
                $scope.diffDataSourceIds = [];
                
                $scope.editorDataSources = [];
                $scope.editorRootDataSourceIds = [];
                $scope.editorAllDataSourceIds = [];

                $scope.presentationDataSources = [];
                $scope.presentationRootDataSourceIds = [];
                $scope.presentationAllDataSourceIds = [];

                $scope.readyEditorDataSources = false;
                $scope.readyPresentationDataSources = false;

                console.log(user);
                console.log($scope.addEditor);
                TagService.listAccessibleTagsByUser($scope.currentUser._id).then(function (tags) {
                    $scope.editorDataSources = tags;
                    $scope.fetchDiffDataSources($scope.editorDataSources, false, false);
                    $scope.buildDiffDataSourcesTree();
                });
                $('#open-create-editor').show();
            };

            /**
            * Close opened editor panel
            * @param {string}
            * @return {object}
            */
            $scope.closeEditor = function () {
                $('#open-create-editor').hide();
            };

            /**
            * Launch confirmation dialog when delete an editor
            * @param {string}
            * @return {object}
            */
            $scope.toggleDeleteEditor = function (editor, showType) {
                if (!$rootScope.Bvmodifyable) {
                    notifyService.errorNotify('Presentation is locked. You don\'t have permission to update.');
                    return false;
                }
                var animationAction;
                if(showType === 'show') {
                    animationAction = 'flipInX';
                    editor.toggleDelete = true; 
                } else {
                    animationAction = 'fadeOutLeftBig';
                    animationAction = 'flipInX';
                    editor.toggleDelete = false; 
                }
                $('.editor-'+editor._id+' .delete-box')
                    .removeClass(animationAction+' animated')
                    .addClass(animationAction+' animated')
                    .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                        $(this).removeClass(animationAction+' animated');
                    });
            };

            $scope.refreshActiveEditors = function () {
                EditorService
                    .getPresentationEditors($rootScope.presentationId)
                    .then(function (editors) {
                        $scope.editors = editors;
                        $scope.unEditors = [];
                        angular.forEach($scope.allUsers, function(user){
                            var checkUser = $filter('filter')($scope.editors, {_id: user._id})[0];
                            if (typeof checkUser === 'undefined') {
                                $scope.unEditors.push(user);
                            }
                        });
                        console.log('undefined users');
                        console.log($scope.unEditors);
                        if (!$scope.editors.length && !$scope.unEditors.length) {
                            $scope.noUsers = true;
                        }
                    });
            };

            /**
             * A presentation loaded successfully.
             */
            $rootScope.$on('PresentationDetailsLoaded', function() {
                $scope.refreshActiveEditors();
            });

            /**
             * When editor's accessible Tags are changed.
             */
            $rootScope.$on('UpdatePresentationEditor', function() {
                $scope.listEditors(true);
            });

            /**
             * When presentation's Tags are changed.
             */
            $rootScope.$on('PresentationTagsUpdated', function() {
                $scope.refreshActiveEditors();
            });


            /**
             * Entry point of this Controller
             */

            $scope.init();
        }
    ]);