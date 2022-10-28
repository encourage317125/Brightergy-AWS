angular.module('blApp.components.companyPanel')
    .controller('CompanyPanelController', ['$scope', '$rootScope', '$timeout', 'tagFactory', 'TagService',
        function ($scope, $rootScope, $timeout, tagFactory, TagService) {
            $rootScope.searchedMembers= {};

            $scope.settingTabSliderCompanyPanel = {
                tabHandle: '.btn-cpanel-handler', //class of the element that will be your tab
                tabLocation: 'right',             //side of screen where tab lives, top, right, bottom, or left
                speed: 200,                       //speed of animation
                action: 'click',                  //options: 'click' or 'hover', action to trigger animation
                topPos: '0px',                    //position from the top

            fixedPosition: true,

            onSlideOut: function() {
                $('.company-panel-main .btn-cpanel-handler')
                    .css('background-color', 'rgba(255, 255, 255, 0);');
            },
            onSlideIn: function() {
                $('.company-panel-main .btn-cpanel-handler')
                    .css('background-color', 'rgba(255, 255, 255, 1);');
            },
            renderAfter: function() {
                $('.btn-cpanel-close').on('click', function() {
                    $('.btn-cpanel-handler').click();
                });
            }
        };

        $scope.initSource = function () {
            $scope.$broadcast('CPanelSourceInit');
        };
        $scope.initAccount = function () {
            $rootScope.activeAccount = true;
            $scope.$broadcast('CPanelAccountInit');
        };
        $scope.initTeam = function () {
            $rootScope.activeAccount=false;
            $scope.$broadcast('CPanelUserInit');
        };
        $scope.initECMs = function () {
            $scope.$broadcast('CPanelECMInit');
        };
        $scope.initGroup = function () {
            $scope.$broadcast('CPanelGroupInit');
        };

        $scope.initAsset = function() {
            $scope.$broadcast('CPanelAssetsInit');
        };

        $scope.renderCompanyData = function (accounts, users, admins, userTags, assets, otherCompanyData) {
            //load accounts
            if (accounts.length > 0) {
                angular.forEach(accounts, function(member, index){
                    member.index = index;
                    member.profileImg = $rootScope.baseCDNUrl + '/assets/img/company-logo.png';
                });
                $rootScope.BVAccounts = accounts;
            }
            //load users and admins
            $rootScope.allMembers = users;
            $rootScope.searchedMembers = angular.copy(users);
            $rootScope.masterManagers = admins;

            //load tags
            tagFactory.addAccessibleTags(userTags, $rootScope.currentUser._id);

            //load assets
            $rootScope.renderAssets = assets;

            //load other company data
            $rootScope.enphaseURL = otherCompanyData.enphaseUrl;
            $rootScope.timeZoneList = otherCompanyData.timeZoneList;
            $rootScope.timeZone = otherCompanyData.timezone;
        };

       /* $scope.renderCompanyData(renderAccounts, renderFoundUsers, renderAdmins, renderUserTags, renderAssets,
            renterOtherCompanyData);*/

        $scope.init = function() {
             TagService
                    .listAccessibleTagsByUser($rootScope.currentUser._id)
                    .then(function (tags) {
                        if (!tags || !tags.length) {                            
                            return ;
                        }
                        
                        renderUserTags = tags;

                        $scope.renderCompanyData(renderAccounts, renderFoundUsers, renderAdmins, renderUserTags,
                                                    renderAssets,renterOtherCompanyData);
                    });
        };

        $scope.init();
    }
]);