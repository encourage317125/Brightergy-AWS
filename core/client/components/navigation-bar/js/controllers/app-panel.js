angular.module('blApp.components.navigationBar')
.controller('AppPanelController',
    ['$scope', '$rootScope', '$compile', '$http', '$timeout', 'UserService','notifyService',
    function ($scope, $rootScope, $compile, $http, $timeout, UserService, notifyService) {
        $rootScope.addMM = false;
        $rootScope.isChangeMM = false;
        $rootScope.mmProjects = [];
        $rootScope.ajaxLoading = false;
        $scope.activePanel = false;

        $scope.loadData = function (accountIndex) {
            $scope.appPermissions = [
                {
                    'name': 'Present',
                    'class': 'brighter-view',
                    'visible' : 1,
                    'url' : $rootScope.Applications['Present']
                },
                {
                    'name': 'Analyze',
                    'class': 'datasense',
                    'visible' : 1,
                    url : $rootScope.Applications['Analyze']
                },
                {
                    'name': 'Classroom',
                    'class': 'brighter-savings',
                    'visible' : 1,
                    url : $rootScope.Applications['Classroom']
                },
                {
                    'name': 'Verify',
                    'class': 'verified-savings',
                    visible : 1,
                    url : $rootScope.Applications['Verify']
                },
                {
                    'name': 'Control',
                    'class': 'load-response',
                    visible : 1,
                    url : $rootScope.Applications['Control']
                },
                {
                    'name': 'Utilities',
                    'class': 'utility-manager',
                    visible : 1,
                    url : $rootScope.Applications['Utilities']
                },
                {
                    'name': 'Projects',
                    'class': 'programs-projects',
                    visible : 1,
                    url : $rootScope.Applications['Projects']
                },
                {
                    'name': 'Connect',
                    'class': 'energy-portfolio',
                    visible : 1,
                    url : $rootScope.Applications['Connect']
                },
                {
                    'name': 'Help & Updates',
                    'class': 'help-and-updates',
                    visible : 1,
                    url : $rootScope.Applications['Help & Updates']
                }
            ];
            if ($rootScope.currentUser.role !== 'BP') {
                angular.forEach( $scope.appPermissions, function(app, index){
                    if ($rootScope.currentUser.apps.indexOf(app.name) >= 0) {
                        app.visible = 1;
                    } else {
                        app.visible = 0;
                    }
                });
            }
        };

        /**
         * Go to app
         * @param {string} app URL
         * @return
         */
        $scope.goToApp = function (appName, appUrl) {
            $scope.activePanel = false;
            $timeout(function() {

                var aWin;
                if (window.parent.location !== window.location) {
                    aWin = window.open('about:self', '_self');
                } else {
                    aWin = window.open('about:blank', '_blank');
                }

                if(appName === 'Utilities') {
                    UserService.energyCapAuth().then(function(result) {
                        aWin.location.href = result.redirectUrl;
                    }, function(error) {
                        notifyService.errorNotify(error.data.message);
                    });
                } else {
                    aWin.location.href = appUrl;
                }
            }, 100);
        };

        $scope.loadData();
    }
]);
