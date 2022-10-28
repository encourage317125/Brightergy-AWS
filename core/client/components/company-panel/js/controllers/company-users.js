angular.module('blApp.components.companyPanel')
    .controller('CompanyUsersController', ['$scope', '$rootScope', '$compile', '$http', '$timeout',
        '$filter', '$q', 'utilService', 'TagService', 'EditorService', 'UserService', 'tagFactory',
        function ($scope, $rootScope, $compile, $http, $timeout, $filter, $q, 
            utilService, TagService, EditorService, UserService, tagFactory) {

            $rootScope.addMM = false;
            $rootScope.isChangeMM = false;
            $scope.editUser = {'defaultApp': null};
            $scope.userNameInvalid = false;

            $scope.appPermissions = [
                {'name': 'Present', 'class': 'brighter-view'},
                {'name': 'Analyze', 'class': 'datasense'},
                {'name': 'Classroom', 'class': 'brighter-savings'},
                {'name': 'Verify', 'class': 'verified-savings'},
                {'name': 'Respond', 'class': 'load-response'},
                {'name': 'Utilities', 'class': 'utility-manager'},
                {'name': 'Projects', 'class': 'programs-projects'},
                {'name': 'Connect', 'class': 'energy-portfolio'}
            ];

            $scope.treedata = [];
            $scope.expandedNodes = [];
            $scope.isExpanded = true;
            $scope.accessibleTags = [];

            $scope.allTags = [];
            $scope.specUserDataSource = []; //=dashboardSegments

            $scope.readyAllDataSource = false;
            $scope.readyUserDataSource = false;
            $scope.readySpecUserDataSource = false;

            $scope.allowAutoActivate = true;
            $scope.levelTagMap = {
                1: 'Metric',
                2: 'Node',
                3: 'Scope',
                4: 'Facility'
            };
            $scope.searchUserTimer = null;
            $scope.isSearchUser = false;
            $scope.searchUserRequest = null;
            $scope.linkedSocialAccounts = [];
            $scope.linkedSocialAccountsErr = '';
            $scope.submitted = false;

            function initializeFormValidation (isAddForm) {
                $scope.submitted = false;
                if (isAddForm) {
                    $scope.addUserForm.$setPristine();
                } else {
                    $scope.editUserForm.$setPristine();
                }
            }

            /**
             * Entry point of this controller
             * @param {string}
             * @return {object}
             */
            $scope.init = function () {
                TagService.listAccessibleTagsByUser($rootScope.currentUser._id).then(function(tags) {
                    $scope.allNodes = $filter('filter')(tags, {tagType: 'Node'});
                });
            };

            /**
             * Load accounts and members data
             * @param {string} accountIndex
             * @return {object}
             */
            $rootScope.loadUsersData = function (accountIndex) {
                UserService
                    .listAllAccounts()
                    .then(function (members) {
                        $rootScope.allMembers = members;
                        $rootScope.searchedMembers = angular.copy(members);
                        //Allocate related Master managers
                        if (accountIndex !== 'init') {
                            $rootScope.selectedAccountMembers = [];
                            for (var i=0; i<$rootScope.allMembers.length; i++) {
                                if ($rootScope.allMembers[i].accounts[0] === $scope.selectedAccount._id) {
                                    $rootScope.selectedAccountMembers.push($rootScope.allMembers[i]);
                                }
                            }
                        }
                        //$rootScope.$apply();
                    });

                UserService
                    .listAllAdmins()
                    .then(function (admins) {
                        $rootScope.masterManagers = admins;
                    });
            };

            /**
             * Open user list panel
             * @param {string}
             * @return {object}
             */
            $scope.openListUser = function () {
                initializeFormValidation(true);
                $('.users-panel').removeClass( 'active' );
                $('#user-list').addClass('active');
            };

            /**
             * Close user list panel
             * @param {string}
             * @return {object}
             */
            $scope.returnViewUser = function (userId) {
                initializeFormValidation(false);
                $('.users-panel').removeClass( 'active' );
                $('#user-view').addClass('active');
            };

            /**
             * Open user datasources panel
             * @param {string}
             * @return {object}
             */
            $scope.openPermissionSources = function () {
                $('.users-panel').removeClass( 'active' );
                $('#permission-sources-view').addClass('active');
            };

            /**
             * Open app permission panel
             * @param {string}
             * @return {object}
             */
            $scope.openPermissionApp = function () {
                $('.users-panel').removeClass( 'active' );
                $('#permission-app-view').addClass('active');
            };

            /**
             * Give app permission to specified user
             * @param {string}
             * @return {object}
             */
            $scope.activePermissionApp = function (e, appName, type) {
                var liObject = $(e.target).parents('li');
                var userRow = $.grep($rootScope.allMembers, function(e){ return e._id === $scope.editUser._id;})[0];
                var tempUser = {};

                liObject.removeClass('highlight');
                angular.copy(userRow, tempUser);

                if(type === 1) {
                    for (var i = tempUser.apps.length - 1; i >= 0; i--) {
                        if(tempUser.apps.indexOf(appName) >= 0) {
                            tempUser.apps.splice(i, 1);
                        }
                    }
                }
                else {
                    tempUser.apps.push(appName);
                }

                UserService.updateUser({user: tempUser}).then(function (resp) {
                    $rootScope.loadUsersData('init');
                    angular.forEach($scope.editUser.apps, function(app, index){
                        if (appName === app.name) {
                            app.visible = !type;
                        }
                    });
                    liObject.addClass('highlight');
                });
            };

            /**
             * Open user details panel
             * @param {string}
             * @return {object}
             */
            $rootScope.openViewUser = function (userId) {
                $scope.selectedUserId = userId;
                $scope.editUserForm.$setPristine();
                var rawUser = $.grep($rootScope.allMembers, function(e){ return e._id === userId;})[0];
                var accountId = rawUser.accounts[0];
                var account = $.grep($rootScope.BVAccounts, function(e){ return e._id === accountId;})[0];

                $scope.editUser = {};

                $('.users-panel').removeClass( 'active' );

                if (rawUser.middleName === null) {
                    rawUser.middleName = '';
                }

                angular.extend($scope.editUser, {
                    '_id': rawUser._id,
                    'defaultApp': rawUser.defaultApp ? rawUser.defaultApp : 'Present',
                    'name': [rawUser.firstName, rawUser.middleName, rawUser.lastName].join(' '),
                    'companyName': rawUser.companyName,
                    'email': rawUser.email,
                    'phone': utilService.parsePhoneNum(rawUser.phone),
                    'presentationIds': rawUser.presentationIds,
                    'nodes': rawUser.nodes,
                    'role': rawUser.role === 'TM' ? 'Team Member' : rawUser.role,
                    'accountName': account.name,
                    'accessibleTags': rawUser.accessibleTags,
                    'apps': $scope.appPermissions.map(function(app) {
                            return angular.extend({visible:rawUser.apps.indexOf(app.name)>-1?1:0
                        }, app);}),
                    'sfdcContactURL': rawUser.sfdcContactURL
                });

                $scope.loadDataSourceTree(userId);
                
                $scope.linkedSocialAccounts = [];
                $scope.linkedSocialAccountsErr = '';
                $scope.loadSocialAccounts(userId);
                
                angular.element('#user-view').addClass('active');
            };

            /**
             * Reset user's input field
             * @param {string}
             * @return {object}
             */
            $scope.initUserField = function() {
                angular.element('#addUserName').val('');
                angular.element('#addUserPhone').val('');
                angular.element('#addUserEmail').val('');
            };

            /**
             * Select user from userList
             */
            $scope.openEditUser = function() {
                $scope.submitted = false;
                angular.element('.users-panel').removeClass( 'active' );
                angular.element('#user-edit').addClass('active');
            };


            /**
             * Open Add User tab/panel
             * @param {string}
             * @return {object}
             */
            $rootScope.openAddUser = function(accountIndex) {
                $scope.submitted = false;
                accountIndex = accountIndex || 0;
                if ($rootScope.activeAccount) {
                    var account = $rootScope.BVAccounts[accountIndex];

                    $scope.addUser.accountName = account.name;
                    $scope.accountId = account._id;
                    $scope.changeAccountId(account._id);
                    $scope.addUser.addAccountIds = account._id;
                }

                $scope.accountIndex = accountIndex;
                $scope.initUserField();

                $scope.treedata = [];
                $scope.buildAllDataSourceTree();

                angular.element('.users-panel').removeClass( 'active' );
                angular.element('#user-add').addClass('active');
            };

            /**
             * Submit user data to create new user
             * @param {string}
             * @return {object}
             */
            $rootScope.commitAddUser = function (form) {
                if (form.$invalid) {
                    $scope.submitted = true;
                    return false;
                }
                initializeFormValidation(false);
                var userNameStr = $('#addUserName').val();
                var userName = utilService.parseName(userNameStr);
                if (userName[0] === '' || userName[2] === '') {
                    $scope.userNameInvalid = true;
                    return false;
                } else {
                    $scope.userNameInvalid = false;
                }

                var userPhone = $('#addUserPhone').val();
                var userEmailStr = $('#addUserEmail').val();
                var email = utilService.parseEmail(userEmailStr);
                var addAccountIds = ($rootScope.activeAccount) ? $scope.accountId :  $scope.addUser.addAccountIds;
                var nodes = $scope.addUser.nodes;
                var apps = ['Present', 'Analyze', 'Classroom', 'Verify', 'Respond', 'Utilities', 'Projects', 'Connect'];
                var userObj = {
                    'firstName': userName[0],
                    'middleName': userName[1],
                    'lastName': userName[2],
                    'email': email[0],
                    'emailUser': email[1],
                    'emailDomain': email[2],
                    'phone': userPhone,
                    'role': $scope.addUser.role,
                    'accounts': [addAccountIds],
                    'nodes': nodes,
                    'apps': apps,
                    'defaultApp': 'Present',
                    'tokens': []
                };
                userObj.accessibleTags = $scope.accessibleTags;
                var account = $.grep($rootScope.BVAccounts, function(e){ return e._id === addAccountIds;})[0];

                $rootScope.ajaxLoading = true;

                var data = {
                    'sfdcAccountId': account.sfdcAccountId,
                    'user': userObj
                };

                console.log(data);

                UserService.createUser(data).then(function (newUser) {
                    var newUserId = newUser._id;
                    $scope.addUserToAccount(newUserId, addAccountIds);
                });
            };

            /**
             * Add user to account
             * @param {string}
             * @return {object}
             */
            $scope.addUserToAccount = function (userId, accountId) {
                if ($rootScope.activeAccount) {
                    $scope.selectedAccount = $rootScope.BVAccounts[$scope.accountIndex];
                } else {
                    var account = $.grep($rootScope.BVAccounts, function(e){ return e._id === accountId;})[0];
                    $scope.selectedAccount = $rootScope.BVAccounts[account.index];
                }

                $rootScope.loadUsersData($scope.accountIndex);

                if ($rootScope.activeAccount) {
                    $scope.goAccountSection();
                    $scope.openListUser();
                } else {
                    $('.users-panel').removeClass( 'active' );
                    $('#user-list').addClass('active');
                }

                $rootScope.ajaxLoading = false;
            };

            /**
             * Edit an user
             * @param {string}
             * @return {object}
             */
            $scope.commitEditUser = function (userId, form) {
                if (form && form.$invalid) {
                    $scope.submitted = true;
                    return false;
                }
                initializeFormValidation(false);
                var userRow = $.grep($rootScope.allMembers, function(e){ return e._id === userId;})[0];
                var userNameArray = utilService.parseName($scope.editUser.name);
                if (userNameArray[0] === '' || userNameArray[2] === '') {
                    $scope.userNameInvalid = true;
                    return false;
                } else {
                    $scope.userNameInvalid = false;
                }
                var userEmailArray = utilService.parseEmail($scope.editUser.email);

                userRow.firstName = userNameArray[0];
                userRow.middleName = userNameArray[1];
                userRow.lastName = userNameArray[2];
                userRow.email = userEmailArray[0];
                userRow.emailUser = userEmailArray[1];
                userRow.emailDomain = userEmailArray[2];
                userRow.phone = utilService.parsePhoneNum($scope.editUser.phone);
                userRow.nodes = $scope.editUser.nodes;
                userRow.defaultApp = $scope.editUser.defaultApp;
                console.log('Saving Default App: ' + $scope.editUser.defaultApp);

                $rootScope.ajaxLoading = true;

                UserService.updateUser({user: userRow}).then(function () {
                    $rootScope.loadUsersData('init');
                    $timeout(function() {
                        //$scope.returnViewUser();
                        $rootScope.openViewUser(userId);
                    }, 300);
                    $rootScope.ajaxLoading = false;
                });
            };

            /**
             * Connect BP user to SFDC user
             * @param {object} user object being edited
             * @return {object} saved user object
             */
            $scope.connectBPUserToSFDC = function(userObj) {
                var showMessage = function () {
                    $('.connect-sfdc-link .anchor').hide();
                    $('.connect-sfdc-link .note').fadeIn('slow', 'swing');
                    $timeout(function() {
                        $('.connect-sfdc-link .note').fadeOut('fast', 'swing', function () {
                            $('.connect-sfdc-link .anchor').show();
                        });
                    }, 2000);
                    $rootScope.ajaxLoading = false;
                };

                if (userObj.role !== 'BP') {
                    return false;
                }

                $scope.msgConnectSFDC = '';
                $rootScope.ajaxLoading = true;

                UserService.connectBPUserToSFDC(userObj._id).then(function(resp) {
                    var sfdcContactURL = resp.sfdcContactURL;
                    if (typeof sfdcContactURL !== 'undefined' && sfdcContactURL !== null) {
                        $scope.msgConnectSFDC = 'Connected to SFDC successfully!';
                        $scope.editUser.sfdcContactURL = sfdcContactURL;
                    }
                    else {
                        $scope.msgConnectSFDC = 'Failed to connect to SFDC, please try again later!';
                    }
                    showMessage();
                }, function(error) {
                    $scope.msgConnectSFDC = 'Failed to connect to SFDC, please try again later!';
                    showMessage();
                });
            };

            /**
             * Delete a member
             * @param {string}
             * @return {object}
             */
            $scope.deleteMember = function (userId) {
                var userRow = $.grep($rootScope.allMembers, function(e){ return e._id === userId;})[0];
                if(userRow.role === 'Admin') {
                    $rootScope.confirmedRemoveUserId = userId;
                    var errorMessage = '<strong>WARNING. </strong>You are about to delete a Master Manager. ' +
                        'This will also delete all Client Managers created by this Master Manager. Proceed?<br>' +
                        '<div class="click-close">' +
                        '<span ng-click="deleteUser(confirmedRemoveUserId)">Delete</span>' +
                        '&nbsp;&nbsp;&nbsp;&nbsp;Cancel</div>';
                    var errorMessageCompile = $compile(errorMessage)($rootScope);
                    notyfy({
                        text: errorMessageCompile,
                        type: 'error',
                        dismissQueue: false
                    });
                }
                else{
                    $rootScope.deleteUser(userId);
                }
            };

            /**
             * Delete an user
             * @param {string}
             * @return {object}
             */
            $rootScope.deleteUser = function (userId) {
                $rootScope.ajaxLoading = true;

                UserService.deleteUser(userId).then(function() {
                    $rootScope.loadUsersData('init');
                    $timeout(function() {
                        if ($rootScope.activeAccount) {
                            $scope.goAccountSection();
                        } else {
                            $scope.openListUser();
                        }
                    }, 300);
                    $rootScope.ajaxLoading = false;
                });
            };

            /**
             * Send reset password link to the email of edit user
             * @param {string} email address
             * @return {object} status
             */
            $scope.sendResetPwdLink = function(userObj) {
                var showMessage = function () {
                    $('.pwd-reset-link .anchor').hide();
                    $('.pwd-reset-link .note').fadeIn('slow', 'swing');
                    $timeout(function() {
                        $('.pwd-reset-link .note').fadeOut('fast', 'swing', function () {
                            $('.pwd-reset-link .anchor').show();
                        });
                    }, 2000);
                    $rootScope.ajaxLoading = false;
                };

                $scope.msgResetPwdLink = '';
                $rootScope.ajaxLoading = true;

                UserService.sendResetPwdLink(userObj.email).then(function(result) {
                    $scope.msgResetPwdLink = 'Reset password link has been sent!';
                    showMessage();
                }, function(error) {
                    $scope.msgResetPwdLink = 'Error occurred!';
                    showMessage();
                });
            };

            /**
             * Get user information by name
             * @param {string}
             * @return {object}
             */
            $scope.getUsersInfoByName = function (){
                if ($scope.searchUserTimer !== null) {
                    $timeout.cancel($scope.searchUserTimer);
                    $scope.searchUserTimer = null;
                }
                if ($scope.searchUser.trim() !== '') {
                    $rootScope.ajaxLoading= true;
                    $scope.showUtilityResults = false;
                    $scope.noMatch = false;

                    if ($scope.isSearchUser) {
                        $scope.searchUserRequest.cancel();
                        $scope.isSearchUser = false;
                    }

                    $scope.searchUserTimer = $timeout(function() {
                        $scope.isSearchUser = true;
                        $scope.searchUserRequest = UserService.searchUser($scope.searchUser);
                        $scope.searchUserRequest.promise.then(function(members) {
                            $scope.isSearchUser = false;
                            $scope.searchedMembers = members;
                            $rootScope.ajaxLoading= false;
                            $scope.showUtilityResults = true;
                            if($scope.searchedMembers.length === 0) {
                                $scope.noMatch = true;
                            }
                        });
                    }, 1000);
                } else {
                    $rootScope.ajaxLoading= false;
                    $scope.showUtilityResults = false;
                    $rootScope.searchedMembers = angular.copy($rootScope.allMembers);
                }
            };
            /**
             * Search accounts for typeahead
             * @auth Kornel Dembek / Oct 17 2014
             */
            $scope.getUsersInfoByNameForTypeahead = function (searchKeyword){
                if ($scope.searchUserTimer !== null) {
                    $timeout.cancel($scope.searchUserTimer);
                    $scope.searchUserTimer = null;
                } else {
                    $scope.searchUserPromise = $q.defer();
                }
                if (searchKeyword.trim() !== '') {

                    if ($scope.isSearchUser) {
                        $scope.searchUserRequest.cancel();
                        $scope.isSearchUser = false;
                    }

                    $scope.searchUserTimer = $timeout(function() {
                        $scope.isSearchUser = true;
                        $scope.searchUserRequest = UserService.searchAccounts(searchKeyword, 10);
                        $scope.searchUserRequest.promise.then(function(resp) {
                            $scope.isSearchUser = false;
                            $scope.searchUserPromise.resolve( resp.map(function(item){
                                item.fullName = item.firstName + (item.middleName? ' ' + 
                                    item.middleName: '' ) + ' ' + item.lastName;
                                item.profilePicture = item.profilePictureUrl ? item.profilePictureUrl : 
                                    $rootScope.baseCDNUrl + '/assets/img/mm-picture.png';
                                return item;
                            }));
                            $scope.searchUserTimer = null;
                        }, function (reason) {
                            $scope.searchUserPromise.reject(reason);
                            $scope.searchUserTimer = null;
                        });
                    }, 1000);
                } else {
                    $scope.searchUserPromise.reject('Input more than one charactor.');
                }
                return $scope.searchUserPromise.promise;
            };

            /**
             * Event handler for search blur
             * @param {string}
             * @return {object}
             */
            $scope.searchBlur = function () {
                $timeout(function() {
                    $scope.showUtilityResults = false;
                }, 100);
            };

            /**
             * Show flip confimration panel when delete an user
             * @param {string} type
             * @return {object}
             */
            $scope.toggleDeleteUser = function (type){
                var animationAction;

                if(type === 'show') {
                    animationAction = 'flipInX';
                } else {
                    animationAction = 'fadeOutLeftBig';
                }

                $('.error-panel').removeClass(animationAction+' animated')
                    .addClass(animationAction + ' animated')
                    .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 
                        function(){
                            $(this).removeClass(animationAction+' animated');
                        }
                    );
            };

            /**
             * Show account section
             * @param {string}
             * @return {object}
             */
            $scope.goAccountSection = function () {
                initializeFormValidation(true);
                $('#sub-navigation-company-panel #tab-company-users').removeClass('active in');
                $('#sub-navigation-company-panel #tab-company-account').addClass('active in');
                $rootScope.activeAccount = false;
            };

            /**
             * Set default app for user with specified appName
             * @param {string} appName
             * @return {object}
             */
            $scope.setUserDefaultApp = function(appName) {
                $scope.editUser.defaultApp = appName;
                console.log('[USERS] Default app: ' + $scope.editUser.defaultApp);
            };

            /**
             * Check whether or not the app is favorite of user
             * @param {string} appName
             * @return {object}
             */
            $scope.checkFavorite = function(appName) {
                if ($scope.editUser.defaultApp === appName) {
                    return true;
                } else {
                    return false;
                }
            };

            /**
             * Building new tree based on current user's accessible tag list, 
             * it is using recurive procedure for configuring tree
             * @param {string}
             * @return {object}
             */
            $scope.buildAllDataSourceTree = function() {
                var deferred = $q.defer();

                TagService.listAccessibleTagsByUser($rootScope.currentUser._id).then(function(tags) {
                    var datasources = tags;

                    $scope.userDataSource = datasources;
                    $scope.treedata = [];
                    $scope.expandedNodes.splice(0, $scope.expandedNodes.length);

                    angular.forEach(datasources, function(childDataSource, index){
                        $scope.recursiveAllDataSourceProc(childDataSource, '', $scope.treedata);
                    });

                    $scope.readyUserDataSource = true;

                    return deferred.resolve(datasources);
                }, function(error) {
                    return deferred.reject(error);
                });

                return deferred.promise;
            };

            /**
             * List specified user tags based on TagService
             * @param {string}
             * @return {object}
             */
            $scope.listSpecUserDataSources = function(userId) {
                var deferred = $q.defer();
                $scope.readySpecUserDataSource = false;
                $scope.specUserDataSource = [];

                TagService.listAccessibleTagsByUser(userId).then(function (tags) {
                    $scope.specUserDataSource = tags;
                    $scope.readySpecUserDataSource = true;
                    deferred.resolve(tags);
                }, function(error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            };

            /**
             * Recursive procedure for building new tree based on specified user's datasource
             * @param {string} rootId Current User ID
             * @return {object}
             */
            $scope.recursiveSpecUserProc = function(datasource, callback) {
                var childs = [];

                //callback(datasource);

                $scope.specUserDataSourceIds.push(datasource._id);

                if (datasource.childTags === 'Metric' || !childs.length) {
                    return true;
                }

                angular.forEach(datasource.childTags, function(childDataSource, index){
                    $scope.recursiveSpecUserProc(childDataSource);
                });

                return false;
            };

            /**
             * Recursive procedure for building new tree based on current user's datasource
             * @param {string}
             * @return {object}
             */
            $scope.recursiveAllDataSourceProc = function(datasource, parentId, parentObj) {
                var childs = [];
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

                //if($scope.isExpanded)
                //    $scope.expandedNodes.push(treeitem);

                if(datasource.tagType.toLowerCase() === 'metric' || !childs.length) {
                    return true;
                }

                angular.forEach(childs, function(childDataSource, index){
                    $scope.recursiveAllDataSourceProc(childDataSource, datasource._id, treeitem.children);
                });

                return false;
            };

            /**
             * get Object from object list by specified key field
             * @param id         : search keyword
             * @param objects    : object array
             * @param idField    : keyword field name
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
             * Set active stats. this proc is similar to setVisibleStats.
             * Only the difference is to set stats by comparing ids with given 'stats' array
             * @param {string} rootId Current User ID
             * @return {object}
             */
            $scope.setVisibleStatsWith = function(treedata, stats) {
                if(!treedata.children) {
                    return true;
                }

                treedata.visible = (stats.indexOf(treedata._id) === -1) ? false : true ;

                angular.forEach(treedata.children, function(treeitem, index){
                    $scope.setVisibleStatsWith(treeitem, stats);
                });

                return false;
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

                treedata.visible = visible ;
                if (!visible) {
                    if ($scope.getObjById(treedata._id, $scope.editUser.accessibleTags, 'id') !== undefined ) {
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
                    parentStat = parentStat && $scope.autoVisibleStats(treeitem, parentStat);
                });

                treedata.visible = parentStat;

                return treedata.visible;
            };

            /**
             * Process active/deactive stats on segment tree by setting visible flag
             * @param {string} segmentId Selected Segment ID
             * @return {object}
             */
            $scope.processActiveDataSource = function(segmentId) {
                var specUserDatass = $scope.specUserDataSource;

                $scope.specUserDataSourceIds = [];

                angular.forEach(specUserDatass, function(specUserDatas, index){
                    $scope.recursiveSpecUserProc(specUserDatas);
                });

                var stats = $scope.specUserDataSourceIds;

                angular.forEach($scope.treedata, function(treeitem, index){
                    $scope.setVisibleStatsWith(treeitem, stats);
                });

            };

            /**
             * Load active/deactive status for selected segment's datasources
             * @param {string}
             * @return {object}
             */
            $scope.loadActiveDataSource = function() {
                $scope.processActiveDataSource();

                if ($scope.allowAutoActivate) {
                    angular.forEach($scope.treedata, function(treeitem, index){
                        $scope.autoVisibleStats(treeitem, true);
                    });
                }
            };

            /**
             * Update active/deactive status for event taget
             * @param {string} rootId Current User ID
             * @return {object}
             */
            $scope.activateDataSource = function(e, source) {
                e.stopPropagation();
                var visible = !source.visible;
                $scope.accessibleTags = [];

                $scope.setVisibleStats(source, visible);

                if($scope.allowAutoActivate) {
                    angular.forEach($scope.treedata, function(treeitem, index){
                        $scope.autoVisibleStats(treeitem, true);
                        $scope.getAccessibleTags(treeitem);
                    });
                }

                $scope.processRequestQueue();
            };

            /**
             * Get actived tagBindings
             * @param tag data
             * @return {object}
             */
            $scope.getAccessibleTags = function(tag) {
                var tagType;
                if(tag.visible === true) {
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
                    $scope.accessibleTags.push(newTag);
                    return true;
                } else {
                    if(!tag.children) {
                        return true;
                    }
                    angular.forEach(tag.children, function(child, index){
                        $scope.getAccessibleTags(child);
                    });
                }

                return false;
            };

            /**
             * Processing update datasource request with TagService
             * @param {string} rootId Current User ID
             * @return {object}
             */
            $scope.processRequestQueue = function() {
                var request = {
                    'userId': $scope.editUser._id,
                    'accessibleTags': $scope.accessibleTags
                };
                TagService
                    .updateUserAccessableTag(request)
                    .then(function(resp) {
                        $rootScope.$emit('UpdatePresentationEditor');
                        var userRow = $.grep($rootScope.allMembers, function(e){ 
                            return e._id === $scope.editUser._id;
                        })[0];

                        userRow.accessibleTags = $scope.editUser.accessibleTags = 
                            angular.copy(resp.accessibleTags);

                        angular.forEach($scope.treedata, function(treeitem){
                            $scope.renderVisibleStats(treeitem, false, false);
                        });
                    });
            };

            /**
             * Entry point of this controller, will be bootstraped when presentation initialization event triggered
             * @param {string}
             * @return {object}
             */
            $scope.loadDataSourceTree = function (userId) {
                $scope.buildAllDataSourceTree().then(function(result){
                    $scope.listSpecUserDataSources(userId).then(function(result) {
                        angular.forEach($scope.treedata, function(treeitem, index){
                            $scope.renderVisibleStats(treeitem, false, true);
                        });
                    });
                });
            };


            /**
             * Load social accounts
             * @param {string}
             * @return {object}
             */
            $scope.loadSocialAccounts = function (userId) {
                UserService.listSocialAccounts(userId).then(function (accounts) {
                    $scope.linkedSocialAccounts = accounts;
                    $scope.linkedSocialAccountsErr = '';
                }, function(error) {
                    $scope.linkedSocialAccountsErr = 'You are not linked social network with your account';
                });
            };

            // when change account list, 

            $scope.changeAccountId = function(accountId) {
                var account = $.grep($rootScope.BVAccounts, function(e){ return e._id === accountId;})[0];
                $scope.addUser.accountName = account.name;
                if ($scope.addUser.accountName === 'BrightergyPersonnel') {
                    $scope.addUser.role = 'BP';
                } else {
                    $scope.addUser.role = 'Admin';
                }
            };

            /**
             * When create datasource, build data sources tree again for user.
             */
            $rootScope.$on('DataSourceUpdated', function() {
                if (typeof $scope.selectedUserId !== 'undefined' && $scope.selectedUserId !== null) {
                    $scope.loadDataSourceTree($scope.selectedUserId);
                }
            });

            /**
             * When user's information updated update user's info and accessible tags list.
             */
            $rootScope.$on('UpdateUserAccessibleTags', function ( event, userinfo ) {
                var matchUsers = $.grep($rootScope.allMembers, function(e){ return e._id === userinfo._id;});
                if (matchUsers.length === 1) {
                    matchUsers[0].accessibleTags = angular.copy(userinfo.accessibleTags);
                    if (userinfo._id === $scope.editUser._id) {
                        $scope.editUser.accessibleTags = matchUsers[0].accessibleTags;

                        angular.forEach($scope.treedata, function(treeitem, index){
                            $scope.renderVisibleStats(treeitem, false, false);
                        });
                    }
                }
            });

            $scope.$on('CPanelUserInit', function (){
                $scope.openListUser();
            });

            $scope.init();

        }
    ]);