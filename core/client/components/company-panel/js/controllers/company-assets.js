angular.module('blApp.components.companyPanel')
    .controller('CompanyAssetsController', ['$scope', '$element', '$rootScope', 
        '$compile', '$http', '$timeout', '$filter', 'AssetService', 
        function ($scope, $element, $rootScope, $compile, $http, $timeout, $filter, AssetService) {
            /**
             * Scope variables definition
             */

            $scope.assetType = 'general';
            $scope.assetsList = [];
            $scope.assetsGeneralList = [];
            $scope.assetsAccountList = [];
            $scope.assetsPresentationList = [];
            $scope.assetPermissions = {
                'general': {
                    'uploadGeneralAssets': $rootScope.permissions.uploadGeneralAssets, 
                    'uploadAccountAssets': false, 
                    'uploadPresentationAssets': false
                },
                'account': {
                    'uploadGeneralAssets': false, 
                    'uploadAccountAssets': $rootScope.permissions.uploadAccountAssets, 
                    'uploadPresentationAssets': false
                },
                'presentation': {
                    'uploadGeneralAssets': false, 
                    'uploadAccountAssets': false, 
                    'uploadPresentationAssets': $rootScope.permissions.uploadPresentationAssets
                }
            };
            $scope.assetPermission = $scope.assetPermissions.general;
            $scope.assetTitles = {
                'general': 'General Assets',
                'account': 'Account Assets',
                'presentation': 'Presentation Assets'
            };
            $scope.assetModalTitle = 'General Assets';
            $scope.showPresentation = $rootScope.presentationId !== undefined;
            $scope.assetAccounts = []; // GET /accounts/all_data/limit
            $scope.assetAccountId = '';
            $scope.assetUploadStatus = 'No file selected.';
            $scope.moreAssets= false;
            //$scope.assetReplaceURL = 'img/company-logo.png';
            /**
             * Retrieve google drive assets with specified asset type
             * @param  
             * @return
             */ 
            $scope.listAssets = function() {
                $scope.assetPermission = $scope.assetPermissions[$scope.assetType];
                $element.find('#assets-thumb').hide();
                switch($scope.assetType){
                    case 'general':
                        $scope.listGeneralAssets('*',8,true);
                    break;
                    case 'account':
                        $scope.listAccountAssets('*',8,true); 
                    break;
                    case 'presentation':
                        $scope.listPresentationAssets('*',8,true);  
                    break;
                }
                
                $scope.assetsList = [];
                $scope.assetsGeneralList = [];
                $scope.assetsAccountList = [];
                $scope.assetsPresentationList = [];
                $scope.moreAssets = false;
                
                $scope.$emit('reloadItems', {containerId:'assets-thumb'}); 
                $scope.$emit('reloadItems', {containerId:'assets-gallery'});
            };

            /**
             * Retrieve google drive assets with specified asset type
             * @param  
             * @return
             */ 
            $scope.listGeneralAssets = function(search, limit, link) {
                AssetService
                    .listGeneralAssets(search)
                    .then(
                        function (assets) {
                            $scope.assetsGeneralList = assets;
                            if(link) {
                                $scope.assetsList = assets;
                            }
                            if(assets.length > 8) {
                                $scope.moreAssets = true;
                            }
                        },
                        function (msg) {
                            $scope.notFoundAssets(msg);
                        }
                    );
            };

            /**
             * Retrieve google drive assets with specified asset type
             * @param  
             * @return
             */ 
            $scope.listAccountAssets = function(search, limit, link) {
                AssetService
                    .listAccountAssets($scope.assetAccountId,search, limit)
                    .then(
                    function (assets) {
                        $scope.assetsAccountList = assets;
                        if(link) {
                            $scope.assetsList = assets;
                        }
                        if(assets.length > 8) {
                            $scope.moreAssets = true;
                        }
                    }, function (msg) {
                        $scope.notFoundAssets(msg);
                    });
            };

            /**
             * Retrieve google drive assets with specified asset type
             * @param  
             * @return
             */ 
            $scope.listPresentationAssets = function(search, limit, link) {
                if ($rootScope.presentationId) {
                    AssetService
                        .listPresentationAssets($rootScope.presentationId, search, limit)
                        .then(function (assets) {
                            $scope.assetsPresentationList = assets;
                            if(link) {
                                $scope.assetsList = assets;
                            }
                            if(assets.length > 8) {
                                $scope.moreAssets = true;
                            }
                        }, function (msg) {
                            $scope.notFoundAssets(msg);
                        });
                } else {
                    $scope.notFoundAssets('Your Assets repository is empty now.');
                }
            };

            /**
             * Not found assetes
             * @param  
             * @return
             */ 
            $scope.notFoundAssets = function(errMsg) {
                console.error(errMsg);
                $scope.moreAssets = false;
            };   

            /**
             * Retrieve google drive assets with specified asset type
             * @param  
             * @return
             */ 
            $scope.listAccounts = function(limit) {
                AssetService.listAccounts(limit).then(function (accounts) {
                    $scope.assetAccounts = accounts.filter(function (account) {
                        return account.name !== 'BrightergyPersonnel';
                    });
                    if($scope.assetAccounts.length) {
                        $scope.assetAccountId = $scope.assetAccounts[0]._id;
                    }
                });
            };

            /**
             * Retrieve google drive assets with specified asset type
             * @param  
             * @return
             */ 
            $scope.uploadGeneralAsset = function(fileElement) {
                //var files = event.target.files;
                var files = fileElement.files;
                if(files.length === 0) {
                    return;
                }
                
                var data = new FormData();
               
                $.each(files, function(key, value) {
                    data.append('assetsFile', value);
                });
                
                $scope.assetUploadStatus = 'uploading...';
                $scope.togglePleaseWait();

                //console.log(data.serialize());
                AssetService
                    .uploadGeneralAssests(data)
                    .then(function (resp) {
                        // Init assets list
                        if(!Array.isArray($scope.assetsList)) {
                            $scope.assetsList = [];
                        }
                        if(Array.isArray(resp)) {
                            for(var i=0; i<resp.length; i++) {
                                $scope.assetsList.unshift(resp[i]);
                            }
                        } else {
                            $scope.assetsList.unshift(resp);
                        }

                        $scope.assetUploadStatus = 'Finish previous file upload.';
                        $scope.togglePleaseWait();
                        $scope.$emit('arrangeIso', {containerId:'assets-thumb'});
                    }, function () {
                        $scope.assetUploadStatus = 'Failed to file upload.';
                        $scope.togglePleaseWait();
                    });
            };

            /**
             * Retrieve google drive assets with specified asset type
             * @param  
             * @return
             */ 
            $scope.uploadAccountAsset = function(fileElement) {
                //var files = event.target.files;
                var files = fileElement.files;
                if(files.length === 0) {
                    return;
                }
                
                var data = new FormData();
               
                $.each(files, function(key, value) {
                    data.append('assetsFile', value);
                });

                $scope.assetUploadStatus = 'uploading...';
                $scope.togglePleaseWait();

                AssetService
                    .uploadAccountAssests(data,$scope.assetAccountId)
                    .then(function (resp) {
                        // Init assets list
                        if(!Array.isArray($scope.assetsList)) {
                            $scope.assetsList = [];
                        }

                        if(Array.isArray(resp)) {
                            for(var i=0; i<resp.length; i++) {
                                $scope.assetsList.unshift(resp[i]);
                            }
                        } else {
                            $scope.assetsList.unshift(resp);
                        }

                        $scope.assetUploadStatus = 'Finish previous file upload.';
                        $scope.togglePleaseWait();
                        $scope.$emit('arrangeIso', {containerId:'assets-thumb'});
                    }, function() {
                        $scope.assetUploadStatus = 'Faild to file upload.';
                        $scope.togglePleaseWait();
                    });
            };

            /**
             * Retrieve google drive assets with specified asset type
             * @param  
             * @return
             */ 
            $scope.uploadPresentationAsset = function(fileElement) {
                //var files = event.target.files;
                var files = fileElement.files;
                if(files.length === 0) {
                    return;
                }
                
                var data = new FormData();
               
                $.each(files, function(key, value) {
                    data.append('assetsFile', value);
                });

                $scope.assetUploadStatus = 'uploading...';
                $scope.togglePleaseWait();

                AssetService
                    .uploadPresentationAssests(data,$rootScope.presentationId)
                    .then(function (resp) {
                        // Init assets list
                        if (!Array.isArray($scope.assetsList)) {
                            $scope.assetsList = [];
                        }

                        if (Array.isArray(resp)) {
                            for (var i = 0; i < resp.length; i++) {
                                $scope.assetsList.unshift(resp[i]);
                            }
                        } else {
                            $scope.assetsList.unshift(resp);
                        }

                        $scope.assetUploadStatus = 'Finish previous file upload.';
                        $scope.togglePleaseWait();
                        $scope.$emit('arrangeIso', {containerId: 'assets-thumb'});
                    }, function() {
                        $scope.assetUploadStatus = 'Faild to file upload.';
                        $scope.togglePleaseWait();
                    });

            };

            /**
             * Delete aws assets with specified asset type
             * @param  
             * @return
             */ 
            $scope.deleteAsset = function (fileId) {
                var deleteIndex;
                
                event.stopPropagation();
                event.preventDefault();
                
                switch($scope.assetType){
                    case 'general':
                        $scope.deleteGeneralAsset(fileId);
                    break;
                    case 'account':
                        $scope.deleteAccountAsset(fileId);
                    break;
                    case 'presentation':
                        $scope.deletePresentationAsset(fileId);
                    break;
                }
                
                $.each($scope.assetsList, function(idx, image) {
                    if (image.id === fileId ) {
                        deleteIndex = idx;
                    }
                });
                $scope.assetsList.splice(deleteIndex, 1);
                $scope.$emit('arrangeIso', {containerId:'assets-thumb'});
                $scope.$emit('arrangeIso', {containerId:'assets-gallery'});
            };

            /**
             * Retrieve google drive assets with specified asset type
             * @param fileId
             * @return
             */ 
            $scope.deleteGeneralAsset = function (fileId) {
                AssetService.deleteGeneralAsset(fileId);
            };

            /**
             * Retrieve google drive assets with specified asset type
             * @param  
             * @return
             */ 
            $scope.deleteAccountAsset = function (fileId) {
                AssetService.deleteAccountAsset($scope.assetAccountId,fileId);
            };

            /**
             * Retrieve google drive assets with specified asset type
             * @param  
             * @return
             */ 
            $scope.deletePresentationAsset = function (fileId) {
                AssetService.deletePresentationAsset($rootScope.presentationId, fileId);
            };

            /**
             * Retrieve google drive assets with specified asset type
             * @param  
             * @return
             */ 
            $scope.onSelectedAccountChange = function(assetAccountId) {
                $scope.assetAccountId = assetAccountId;
                if($rootScope.isBrighterViewManager){
                    $scope.listAssets();
                    //$rootScope.retrieveAllImagesInFolder($scope.assetAccountId, 'client');
                }
            };

            /**
             * Retrieve google drive assets with specified asset type
             * @param  
             * @return
             */ 
            $scope.onOpenMoreAssetModal = function() {
                
                $scope.assetModalTitle = $scope.assetTitles[$scope.assetType];
                $('#more-asset-modal').modal()
                    .on('shown.bs.modal',function(){
                        //$timeout(function(){ $('#assets-gallery').isotope();}, 2500);
                        $('#assets-gallery').imagesLoaded(function(){
                            //$scope.$emit('refreshIso', {containerId: 'assets-gallery'});
                            $scope.$emit('arrangeIso', {containerId: 'assets-gallery'});
                        });
                    })
                    .on('hidden.bs.modal',function(){
                    
                    });
            };

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
             * Retrieve google drive assets with specified asset type
             * @param  
             * @return
             */ 
            $scope.isAvailableCRUD = function() {
                if($scope.assetType === 'presentation' || 
                    ($scope.assetType === 'account' && $rootScope.isAdmin) || 
                    $rootScope.isBrighterViewManager) {
                    return true;
                }
                
                return false;
            };

            /**
             * Retrieve google drive assets with specified asset type
             * @param  
             * @return
             */ 
            $scope.refreshIsotope = function() {
                $scope.$emit('refreshIso', {containerId: 'assets-thumb'});
                //$scope.$emit('arrangeIso', {containerId: 'assets-gallery'});
            };

            /**
             * Retrieve google drive assets with specified asset type
             * @param  
             * @return
             */ 
            $scope.arrangeIsotope = function() {
                $scope.$emit('arrangeIso', {containerId: 'assets-thumb'});
                $scope.$emit('arrangeIso', {containerId: 'assets-gallery'});
            };
            
            /**
             * Init function and entry point of Asset Section
             * @param  
             * @return
             */ 
            $scope.init = function() {
                var accounts = [];
                for(var i=0; i<$rootScope.BVAccounts.length; i++) {
                    if($rootScope.BVAccounts[i].name !== 'BrightergyPersonnel') {
                        accounts.push($rootScope.BVAccounts[i]);
                    }
                }
                $scope.assetAccounts = accounts;
                if($scope.assetAccounts.length) {
                    $scope.assetAccountId = $scope.assetAccounts[0]._id;
                }

                $scope.assetsGeneralList = angular.copy($rootScope.renderAssets);
                $scope.assetsList = angular.copy($rootScope.renderAssets);
                if($rootScope.renderAssets.length > 8) {
                    $scope.moreAssets = true;
                }
            };

            $rootScope.$on('addedNewAccount', function(message, options) {
                $scope.listAccounts();
            });

            $scope.$on('CPanelAssetsInit', function () {
                $scope.assetType = 'general';
                $scope.listAssets();
                $timeout(function() {$scope.refreshIsotope();}, 1000);
            });

            $scope.init();
        }
    ]);