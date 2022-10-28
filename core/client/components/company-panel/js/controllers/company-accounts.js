angular.module('blApp.components.companyPanel')
    .controller('CompanyAccountsController', ['$scope', '$rootScope', '$compile', 
        '$http', '$timeout', 'utilService', 'accountService', 'notifyService',
        function ($scope, $rootScope, $compile, $http, $timeout, utilService, accountService, notifyService) {
            $rootScope.addMM = false;
            $rootScope.isChangeMM = false;
            $rootScope.ajaxLoading = false;
            
            $scope.hasParsedBilling = false;
            $scope.hasParsedShipping = false;

            $scope.searchAccount = '';
            $scope.submitted = false;

            function initializeFormValidation (isAddForm) {
                $scope.submitted = false;
                if (isAddForm) {
                    $scope.addForm.$setPristine();
                } else {
                    $scope.editForm.$setPristine();
                }
            }

            $scope.loadData = function () {
                accountService.getAllAccounts().then(function (accounts) {
                    $rootScope.BVAccounts = accounts.map(function (member, index){
                        member.index = index;
                        member.profileImg = $rootScope.baseCDNUrl + '/assets/img/company-logo.png';
                        return member;
                    });
                });
            };

            //open Account Details page
            $scope.openViewAccount = function (accountIndex){
                $('.account-panel').removeClass( 'active' );
                $('#account-view').addClass( 'active' );

                //Align current bv account
                $scope.selectedAccount = $rootScope.BVAccounts[accountIndex];
                $scope.currentCname = $scope.selectedAccount.cname;
                console.log($scope.selectedAccount);


                //Allocate related members
                $rootScope.selectedAccountMembers = [];
                for (var i=0; i<$rootScope.allMembers.length; i++) {
                    if ($rootScope.allMembers[i].accounts[0] === $scope.selectedAccount._id) {
                        $rootScope.selectedAccountMembers.push($rootScope.allMembers[i]);
                    }
                }
            };

            //Return Account View page
            $scope.returnViewAccount = function () {
                initializeFormValidation(false);
                //angular.copy($scope.editAccount, $scope.selectedAccount);
                $('.account-panel').removeClass( 'active' );
                $('#account-view').addClass( 'active' );
            };

            //Return Account List page
            $scope.openListAccount =  function () {
                initializeFormValidation(true);
                $('.account-panel').removeClass( 'active' );
                $('#accounts').addClass( 'active' );
                if (!$('#tab-company-account').hasClass('active') && $rootScope.activeAccount) {
                    $('#sub-navigation-company-panel #tab-company-account').addClass('active in');
                    $('#sub-navigation-company-panel #tab-company-users').removeClass('active in');
                }
            };
            //Add Account page
            $scope.openAddAccount = function (accountId){
                $scope.initAccountField();
                $scope.currentStatus = 'add';
                $('.account-panel').removeClass( 'active' );
                $('#account-add').addClass( 'active' );
                $scope.cnameNotify = false;
                $scope.editAccount.sfdcAccountId = '';
            };
            // init account field
            $scope.initAccountField = function() {
                $scope.accountPresentationIds = [];
                $scope.editAccount = {
                    'webSite' : '',
                    'tickerSymbol' : null,
                    'shippingStreet' : '',
                    'shippingState' : '',
                    'shippingPostalCode' : '',
                    'shippingCountry' : '',
                    'shippingCity' : '',
                    'sfdcAccountURL' : '',
                    'dunsNumber' : null,
                    'name' : '',
                    'phone': '',
                    'email': '',
                    'billingStreet' : '',
                    'billingState' :  '',
                    'billingPostalCode' :  '',
                    'billingCountry' :  '',
                    'billingCity' :  ''
                };
                angular.element('#add_sfdc_name').val('');
            };

            // when edit/crate accoutn, check BP account

            $scope.checkBPAccount = function () {
                if($scope.editAccount.name === 'BrightergyPersonnel') {
                    var message = 'Sysetm should have only one BP account.';
                    notifyService.errorNotify(message);
                    return false;
                }
            };

            $scope.commitAddAccount = function (form) {
                if (form.$invalid) {
                    $scope.submitted = true;
                    return;
                }
                initializeFormValidation(true);
                $scope.checkBPAccount();
                $rootScope.ajaxLoading = true;
                $scope.addAccount = true;
                $scope.parseAddress();
            };

            $scope.commitAccountAdd = function () {
                if ($scope.hasParsedBilling && $scope.hasParsedShipping) {
                    console.log('Committing Account Add...');

                    var userNameStr = $('#add_sfdc_name').val();
                    var userName = utilService.parseName(userNameStr);
                    var emailStr = $('#add_sfdc_email').val();
                    var email = utilService.parseEmail(emailStr);

                    $scope.sfdcSccount= {
                        'firstName' : userName[0],
                        'middleName' : userName[1],
                        'lastName' : userName[2],
                        'phone' : $('#add_sfdc_phone').val(),
                        'email' : email[0],
                        'emailUser' : email[1],
                        'emailDomain' : email[2],
                        'role': 'Admin',
                        'tokens': []
                    };

                    if($scope.editAccount.sfdcAccountId === '') {
                        //Create New Account with SFDC Account
                        delete $scope.editAccount.sfdcAccountId;
                        accountService
                            .createAccountWithSF($scope.editAccount, $scope.sfdcSccount)
                            .then(function () {
                                $scope.loadData();
                                $rootScope.loadUsersData('init');
                                $scope.selectedAccount = null;
                                $timeout(function () {
                                    $('.account-panel').removeClass('active');
                                    $('#accounts').addClass('active');
                                }, 300);
                                //$rootScope.$apply();

                                //broadcast to notify account added
                                $rootScope.$broadcast('addedNewAccount', {});
                            })
                            .finally(function() {
                                $rootScope.ajaxLoading = false;
                            });
                    } else {
                        //Create New Account
                        accountService
                            .createAccount($scope.editAccount, $scope.sfdcSccount)
                            .then(function (resp) {
                                $scope.loadData();
                                $rootScope.loadUsersData('init');
                                $scope.selectedAccount = null;
                                $timeout(function () {
                                    $('.account-panel').removeClass('active');
                                    $('#accounts').addClass('active');
                                }, 300);
                                $rootScope.$broadcast('addedNewAccount', {});
                            })
                            .finally(function() {
                                $rootScope.ajaxLoading = false;
                            });
                    }

                    $scope.hasParsedBilling = false;
                    $scope.hasParsedShipping = false;
                    $scope.addAccount = false;
                }
            };

            //Edit Account page
            $scope.openEditAccount = function (){
                $scope.editAccount = angular.copy($scope.selectedAccount);
                $scope.currentStatus = 'edit';
                $('.account-panel').removeClass( 'active' );
                $('#account-edit').addClass( 'active' );
                $scope.cnameNotify = false;
            };


            $scope.commitAccountChanges = function () {
                if ($scope.hasParsedBilling && $scope.hasParsedShipping) {
                    console.log('Committing Account Changes...');

                    accountService
                        .updateAccount($scope.editAccount)
                        .then(function () {
                            $scope.selectedAccount = angular.copy($scope.editAccount);
                            $scope.loadData();
                            $timeout(function() {
                                $('.account-panel').removeClass( 'active' );
                                $('#account-view').addClass( 'active' );
                            }, 100);
                        })
                        .finally(function () {
                            $rootScope.ajaxLoading = false;
                        });
                    
                    $scope.hasParsedBilling = false;
                    $scope.hasParsedShipping = false;
                    $scope.updateAccount = false;
                }

            };

            $scope.commitEditAccount = function ( form ) {
                if (form.$invalid) {
                    $scope.submitted = true;
                    return;
                }
                initializeFormValidation(false);
                $scope.checkBPAccount();
                $rootScope.ajaxLoading = true;
                $scope.updateAccount = true;
                $scope.parseAddress();
            };


            $scope.parseAddress = function() {
                var addressToParse = $scope.editAccount.shippingAddress;
                if (!addressToParse || addressToParse === null) {
                    addressToParse = '';
                }
                if (addressToParse.length > 0) {
                    addressToParse = addressToParse.trim();
                    
                    accountService
                        .liveAddress(addressToParse)
                        .then(function (bAddress) {
                            if (bAddress.length > 0) {
                                $scope.editAccount.shippingStreet = bAddress[0]['delivery_line_1'];
                                $scope.editAccount.shippingCity = bAddress[0].components['city_name'];
                                $scope.editAccount.shippingCountry = 'US';
                                $scope.editAccount.shippingState = bAddress[0].components['state_abbreviation'];
                                $scope.editAccount.shippingPostalCode = bAddress[0].components['zipcode'];
                            }
                            $scope.hasParsedShipping = true;
                            if ($scope.addAccount) {
                                $scope.commitAccountAdd();
                            }
                            if ($scope.updateAccount) {
                                $scope.commitAccountChanges();
                            }
                        }, function(resp){
                            $scope.hasParsedShipping = true;
                            if ($scope.addAccount) {
                                $scope.commitAccountAdd();
                            }
                            if ($scope.updateAccount) {
                                $scope.commitAccountChanges();
                            }
                        });
                } else {
                    $scope.editAccount.shippingStreet = '';
                    $scope.editAccount.shippingCity = '';
                    $scope.editAccount.shippingCountry = '';
                    $scope.editAccount.shippingState = '';
                    $scope.editAccount.shippingPostalCode = '';
                    $scope.hasParsedShipping = true;
                    if ($scope.addAccount) {
                        $scope.commitAccountAdd();
                    }
                    if ($scope.updateAccount) {
                        $scope.commitAccountChanges();
                    }
                }

                var addressToParse2 = $scope.editAccount.billingAddress;
                if (!addressToParse2 || addressToParse2 === null) {
                    addressToParse2 = '';
                }
                if (addressToParse2.length > 0) {
                    addressToParse2 = addressToParse2.trim();
                    //addressToParse2 = addressToParse2.replace(' ', '+');

                    accountService.liveAddress(addressToParse2).then(function (bAddress2) {
                        if (bAddress2.length > 0) {
                            $scope.editAccount.billingStreet = bAddress2[0]['delivery_line_1'];
                            $scope.editAccount.billingCity = bAddress2[0].components['city_name'];
                            $scope.editAccount.billingCountry = 'US';
                            $scope.editAccount.billingState = bAddress2[0].components['state_abbreviation'];
                            $scope.editAccount.billingPostalCode = bAddress2[0].components['zipcode'];
                        }
                        $scope.hasParsedBilling = true;
                        if ($scope.addAccount) {
                            $scope.commitAccountAdd();
                        }
                        if ($scope.updateAccount) {
                            $scope.commitAccountChanges();
                        }
                    }, function(resp){
                        console.log(resp);
                        $scope.hasParsedBilling = true;
                        if ($scope.addAccount) {
                            $scope.commitAccountAdd();
                        }
                        if ($scope.updateAccount) {
                            $scope.commitAccountChanges();
                        }
                    });
                }
                else {
                    $scope.editAccount.billingStreet = '';
                    $scope.editAccount.billingCity = '';
                    $scope.editAccount.billingCountry =  '';
                    $scope.editAccount.billingState = '';
                    $scope.editAccount.billingPostalCode = '';
                    $scope.hasParsedBilling = true;
                    if ($scope.addAccount) {
                        $scope.commitAccountAdd();
                    }
                    if ($scope.updateAccount) {
                        $scope.commitAccountChanges();
                    }
                }
            };


            $scope.goTeamTab = function () {
                $('#sub-navigation-company-panel #tab-company-account').removeClass('active in');
                $('#sub-navigation-company-panel #tab-company-users').addClass('active in');
                $rootScope.activeAccount = true;
            };

            $scope.verifyCname = function () {
                $scope.cnameVerifyMessage = '';
                if (typeof $scope.editAccount.cname === 'undefined' || $scope.editAccount.cname === '') {
                    $scope.cnameVerifyMessage = 'Please input Custom URL.';
                    $scope.cnameVerify = false;
                    $scope.cnameNotify = true;
                    return false;
                }   else if($scope.currentStatus === 'edit' && $scope.currentCname === $scope.editAccount.cname) {
                    $scope.cnameVerifyMessage = 'This is your existing Custom URL.';
                    $scope.cnameVerify = true;
                    $scope.cnameNotify = true;
                    return false;
                } 
                $scope.showLoadingBtn = true;
                $scope.cnameVerifiedName = $scope.editAccount.cname;
                accountService
                    .verifyCname($scope.editAccount.cname)
                    .then(function (resp) {
                        if (resp) {
                            $scope.cnameVerify = true;
                            $scope.cnameVerifyMessage = 'This Custom URL is available!';
                        } else {
                            $scope.cnameVerify = false;
                            $scope.cnameVerifyMessage = 'That Custom URL is already taken.';
                        }
                        $scope.cnameNotify = true;
                        $scope.showLoadingBtn = false;
                    });
            };
            $scope.$watch('editAccount.cname', function(newVal, oldVal) {
                if ($scope.cnameNotify) {
                    if (newVal !== $scope.cnameVerifiedName) {
                        $scope.cnameNotify = false;
                    }
                }
            });
            /**
             * function for get sfdc accounts list
             * @param 
             * @return {object} sfdc account objects
             */
            $scope.getSFDCAccounts = function (request, response) {
                accountService
                    .getSFDCAccounts(request.term)
                    .then(function(acs) {
                        var accounts = [];
                        if (!acs.length) {
                            accounts.push({
                                label: 'Not Found',
                                value: ''
                            });
                        } else {
                            accounts = acs.map(function(u) {
                                return {
                                    label: u.companyName,
                                    value: u.companyName,
                                    id : u.accountId
                                };
                            });
                        }
                        response(accounts);
                    });
            };

            $scope.$on('CPanelAccountInit', function () {
                $scope.openListAccount();
                $scope.initAccountField();
            });

            // After copying custom-url to clipboard, auto-highlight the text
            $scope.highlightCustomURL = function(evt) {

                var element = document.getElementById('custom-url-text'),
                    tag = (element.tagName || '').toLowerCase(),
                    sel, range;
                if (tag === 'textarea' || tag === 'input') {
                    try {
                        element.select();
                    } catch (e) {
                        // Maybe disabled or not selectable
                    }
                } else if (window.getSelection) { // Not IE
                    sel = window.getSelection();
                    range = document.createRange();
                    range.selectNodeContents(element);
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else if (document.selection) { // IE
                    document.selection.empty();
                    range = document.body.createTextRange();
                    range.moveToElementText(element);
                    range.select();
                }

                // Show "Custom URL copied" confirmation message
                $('.custom-url .anchor').hide();
                $('.custom-url .note').fadeIn('slow', 'swing');
                $timeout(function() {
                    $('.custom-url .note').fadeOut('fast', 'swing', function () {
                        $('.custom-url .anchor').show();
                    });
                }, 2000);

                evt.preventDefault();
            };
        }
    ]);