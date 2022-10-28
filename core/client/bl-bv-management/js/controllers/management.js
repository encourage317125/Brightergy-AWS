'use strict';

angular.module('blApp.management.controllers').controller(
    'ManagementController',
    ['$scope', '$rootScope', '$location', '$compile', '$http', '$timeout', 'presentationService', 'widgetService',
        'toggleService', 'projectService', 'notifyService',
        function ($scope, $rootScope, $location, $compile, $http, $timeout, presentationService, widgetService,
                  toggleService, projectService, notifyService) {

            $rootScope.errors = null;
            $rootScope.permissions = null;
            $rootScope.currentUser = null;
            $rootScope.isBP = null;
            $rootScope.isBrighterViewManager = null; //for now
            $rootScope.isAdmin = null;
            $rootScope.isTM = null;
            $rootScope.presentationId = '';
            $rootScope.tempPresentationDetails = {};
            $rootScope.presentationDetails = {};
            $rootScope.isCanvasPlaying = false;
            $rootScope.selectedAccountId = '';
            $rootScope.Bvmodifyable = true;

            $scope.imgUrl = $rootScope.baseCDNUrl + '/bl-bv-management/assets/img/';
            $scope.presentationBackgroundImage = {'inputField': 'backgroungImage_presentation'};
            $scope.widgetBackgroundImage = {'inputField': 'backgroungImage'};
            $scope.imageUrl = {'inputField': 'imageURL'};
            $scope.videoUrl = {'inputField': 'videoURL'};
            $scope.logo = {'inputField': 'presentation_logo'};
            $scope.togglePanel = false;
            $scope.copyLabel = '';
            //widgetService.getAvailableWidgets($rootScope);
            $scope.init = function(errors, permissions, currentUser) {
                toggleService.showPleaseWait();
                $rootScope.errors = errors;
                $rootScope.permissions = permissions;
                $rootScope.currentUser = currentUser;
                $rootScope.managementId = $rootScope.currentUser.lastEditedPresentation;
                if (!$rootScope.managementId) {
                    presentationService.getLastPresentation().then(function (lastPresentationId) {
                        $rootScope.managementId = lastPresentationId;
                        $scope.goToPresentation($rootScope.managementId);
                    });
                } else {
                    $scope.goToPresentation($rootScope.managementId);
                }
                $rootScope.isBP = (currentUser.role === 'BP');
                $rootScope.isBrighterViewManager = (currentUser.role === 'BP'); //for now
                $rootScope.isAdmin = (currentUser.role === 'Admin');
                $rootScope.isTM = (currentUser.role === 'TM');

                console.log(' ** presentationId ** ', $rootScope.managementId);

                $scope.file = {
                    'uploadGeneralAssets': $rootScope.permissions.uploadGeneralAssets,
                    'uploadAccountAssets': $rootScope.permissions.uploadAccountAssets,
                    'uploadPresentationAssets': $rootScope.permissions.uploadPresentationAssets
                };
                $scope.file1 = {
                    'uploadGeneralAssets': $rootScope.permissions.uploadGeneralAssets,
                    'uploadAccountAssets': false,
                    'uploadPresentationAssets': false
                };
                $scope.file2 = {
                    'uploadGeneralAssets': false,
                    'uploadAccountAssets': $rootScope.permissions.uploadAccountAssets,
                    'uploadPresentationAssets': false
                };
                $scope.file3 = {
                    'uploadGeneralAssets': false,
                    'uploadAccountAssets': false,
                    'uploadPresentationAssets': $rootScope.permissions.uploadPresentationAssets
                };

            };

            // Start Presentation Function
            $scope.playPresentation = function (screenWidth, screenHeight, newWindow) {
                if ($rootScope.presentationDetails.tagBindings.length > 0) {
                    var startPointMin = $('.timenav-line').attr('minute');
                    var startPointSecond = $('.timenav-line').attr('second');
                    var startMin, startSec;
                    if (startPointMin === undefined) {
                        startMin = 0;
                        startSec = 0;
                    } else {
                        startMin = parseInt(startPointMin);
                        startSec = parseInt(startPointSecond);
                    }
                    if (screenWidth > $scope.windowWidth) {
                        notifyService.errorNotify('The target View Mode is larger than your screen\'s resolution.');
                    } else if (newWindow) {
                        window.open(['/presentation?id=',$rootScope.presentationId,
                            '&startMin=',startMin,'&startSec=',startSec].join(''));
                    } else {
                        window.open(['/presentation?id=',$rootScope.presentationId,
                            '&startMin=',startMin,'&startSec=',startSec].join(''),
                            '_blank', ['width=',screenWidth,', height=',screenHeight].join(''));
                        //aWin.document.body.clientWidth = screenWidth;
                        //aWin.document.body.clientHeight = screenHeight;
                        //window.open('https://c.cs8.visual.force.com/apex/BV_Presentation?id=' +
                        // $rootScope.presentationId + '&startMin=' + startMin + '&startSec=' + startSec, '_blank',
                        // 'width=' + screenWidth + ', height=' + screenHeight);
                    }
                } else {
                    notifyService.errorNotify('Use the \'data\' section of the panel on the left to add ' +
                    'data sources to your presentation.');
                }
            };

            $rootScope.playCanvas = function () {
                $rootScope.isCanvasPlaying = true;
                var diffTimesArr = ($('.time-representation').text()).split(':');
                var diffTimes = parseInt(diffTimesArr[0], 10) * 60 + parseInt(diffTimesArr[1], 10);
                var startTime = diffTimes;
                var buildMarkers = timenav.getMarkers();
                var lastEndTime = 0;
                var lastMakerIdx = 0;
                $.each(buildMarkers, function (idx, maker) {
                    var d = new Date(maker.endtime);
                    var min = d.getMinutes();
                    var sec = d.getSeconds();
                    var endTime = min * 60 + sec;
                    if (lastEndTime < endTime) {
                        lastEndTime = endTime;
                        lastMakerIdx = idx;
                    }
                });

                var firstWidgetDuration = parseInt(buildMarkers[2].duration, 10);
                var firstMarkerWidth = parseInt(buildMarkers[2]['pos_right'], 10) -
                    parseInt(buildMarkers[2]['pos_left'], 10);
                var vcoWidth = $('.vco-navigation').width() / 2;
                var animationLeft = 0 - (parseInt(buildMarkers[lastMakerIdx]['pos_right'], 10) - vcoWidth);
                var animationDuration = (lastEndTime - diffTimes) * 1000;
                var stepPx = parseFloat(firstMarkerWidth / firstWidgetDuration);
                var timelineStartPoisition = 43198;
                var videoElm = null;
                $rootScope.solarShowSteps = true;
                $rootScope.initHDSW();
                var solarDrawed = [];
                $('.timenav').animate({
                    left: animationLeft
                },{
                    duration: animationDuration,
                    easing: 'linear',
                    step: function (now, fx) {
                        if (stepPx * startTime < ((0 - now) - timelineStartPoisition + vcoWidth)) {
                            startTime++;
                            var representationSec = parseInt(startTime) % 60;

                            if (representationSec < 10) {
                                representationSec = '0' + representationSec;
                            }
                            var representationMin = parseInt(startTime / 60);

                            if (representationMin < 10) {
                                representationMin = '0' + representationMin;
                            }
                            var representation = representationMin + ':' + representationSec;
                            $('.time-representation').text(representation);

                            $('.presentationBody .widget').each(function (e) {
                                var startPoint = $(this).attr('data-startpoint');
                                var duration = parseInt($(this).attr('data-duration'), 10);
                                var transitionIn = $(this).attr('data-transitionIn') + ' animated';
                                var transitionOut = $(this).attr('data-transitionOut') + ' animated';
                                var elementId = $(this).attr('id');
                                var widgetId = elementId.substring(6);

                                var startPointArr = startPoint.split(':');
                                var itemStartPoint = parseInt(startPointArr[0]) * 60 + parseInt(startPointArr[1]);
                                var itemEndPoint = itemStartPoint + duration;

                                if (startTime === itemStartPoint) {
                                    $(this)
                                      .removeClass(transitionIn)
                                      .addClass(transitionIn)
                                      .one(['webkitAnimationEnd', 'mozAnimationEnd', 'MSAnimationEnd',
                                          'oanimationend', 'animationend'].join(' '),
                                      function () {
                                          $(this).removeClass(transitionIn);
                                      });

                                    if ($('videogular', this).length > 0) {
                                        $rootScope.videoAPI[widgetId][1].play();
                                        console.log('playing video.............');
                                    }
                                }

                                if (startTime > itemStartPoint && startTime <= itemEndPoint) {

                                    if ($(this).find('.ng-scope').hasClass('how-does-solar-widget')) {
                                        var child = $(this).find('.how-does-solar-widget');
                                        var steponeduration = child.attr('data-first-duration');
                                        var steptwoduration = child.attr('data-second-duration');
                                        var stepthreeduration = child.attr('data-third-duration');
                                        var stepfoururation = child.attr('data-fourth-duration');

                                        var steponecontent = child.attr('data-first-content');
                                        var steptwocontent = child.attr('data-second-content');
                                        var stepthreecontent = child.attr('data-third-content');
                                        var stepfourcontent = child.attr('data-fourth-content');

                                        var isDrawed = false;

                                        for (var sd = 0; sd < solarDrawed.length; sd++) {
                                            if (solarDrawed[sd] === elementId) {
                                                isDrawed = true;
                                            }
                                        }

                                        if (!isDrawed) {
                                            $rootScope.initHDSW();
                                            $rootScope.sunAnimation();
                                            $rootScope.solarDurationStep1(steponeduration, steptwoduration,
                                                stepthreeduration, stepfoururation, steponecontent, steptwocontent,
                                                stepthreecontent, stepfourcontent, elementId);
                                            solarDrawed.push(elementId);
                                            $scope.solarDrawed = solarDrawed;
                                        }

                                        if (startTime === (itemEndPoint - 1)) {
                                            solarDrawed.pop();
                                            $scope.initHDSW();
                                            $scope.$apply();
                                        }
                                    }

                                    $(this).show();

                                    if ($('videogular', this).length > 0) {
                                        videoElm = $rootScope.videoAPI[widgetId][1];
                                        if (startTime >= (itemEndPoint - 1)) {
                                            if (videoElm.currentState === 'play') {
                                                videoElm.stop();
                                                console.log('pausing video.............');
                                            }
                                        } else {
                                            if (videoElm.currentState !== 'play') {
                                                videoElm.play();
                                                console.log('playing video.............');
                                            }
                                        }
                                    }

                                    if (startTime === (itemEndPoint - 1)) {
                                        $(this)
                                            .removeClass(transitionOut)
                                            .addClass(transitionOut)
                                            .one(['webkitAnimationEnd','mozAnimationEnd','MSAnimationEnd',
                                                'oanimationend','animationend'].join(' '),
                                            function () {
                                                $(this).removeClass(transitionOut);
                                            });
                                    }
                                } else {
                                    $(this).hide();
                                }
                            });
                        }
                    }
                });
            };

            $scope.stopCanvas = function () {
                $rootScope.isCanvasPlaying = false;
                $('.timenav').stop();
                $('.presentationBody .widget').each(function (e) {
                    var elementId = $(this).attr('id');
                    var widgetId = elementId.substring(6);
                    if ($('videogular', this).length > 0) {
                        $rootScope.videoAPI[widgetId][1].stop();
                        console.log('pausing video.............');
                    }
                });
            };

            $scope.clonePresentation = function () {
                var aWin = window.open('about:blank', '_blank');
                aWin.document.write('<p>Please wait one second for loading the cloned presentation...</p>');
                var apiUrl = '/present/presentations/clone/' + $rootScope.presentationId;
                $http.post(apiUrl).then(function(newPresentationId) {
                    aWin.location.href = '/management?id=' + newPresentationId;
                });
            };

            //Yakov
            $scope.toggleSharePanel = function (event) {
                $scope.togglePanel = !($scope.togglePanel);
                $scope.emailError = '';
                $scope.copyLabel = '';
                $rootScope.presentationLink = $location.protocol() + '://' + $location.host() + ':' +
                $location.port() + '/presentation?id=' + $rootScope.presentationId;
                $scope.presentationLink = $location.protocol() + '://' + $location.host() + ':' +
                $location.port() + '/presentation?id=' + $rootScope.presentationId;
                if (window.clipboardData && window.clipboardData.setData) {
                    window.clipboardData.setData('text', $scope.presentationLink);
                }
                event.stopPropagation();
            };
            window.onclick = function(event) {
                var parent = event.srcElement;
                var inClick = false;
                if (parent) {
                        while (parent.parentElement) {
                        parent = parent.parentElement;
                        if (parent.localName === 'share-dialog') {
                            inClick = true;
                            event.stopPropagation();
                            break;
                        }
                    }
                }
                if ($scope.togglePanel && !inClick) {
                    $scope.togglePanel = false;
                    $scope.copyLabel = '';
                    $scope.$apply();
                }
            };


            $scope.setTempPresentationDetails = function (id) {
                var project = $.grep($rootScope.allPresentations, function (e) {
                    return e._id === id;
                })[0];
    
                if (typeof project !== 'undefined' && project !== null) {
                    $rootScope.tempPresentationDetails = angular.copy(project);
                }
            };

            $scope.setPresentationDetail = function () {
                var project = $.grep($rootScope.allProjects, function (e) {
                    return e.projectId === $rootScope.tempPresentationDetails.projectId;
                })[0];
                console.log(project);
                if (typeof project !== 'undefined' && project !== null) {
                    $('#detail_name').val(project.accountName);
                    if (project.latitude) {
                        $rootScope.tempPresentationDetails.Latitude = project.latitude;
                    }
                    if (project.longitude) {
                        $rootScope.tempPresentationDetails.Longitude = project.longitude;
                    }
                    if (project.systemSize) {
                        $rootScope.tempPresentationDetails.systemSize = project.systemSize;
                    }
                    if (project.webbox) {
                        $rootScope.tempPresentationDetails.webBox = project.webbox;
                    }
                }
            };
            // End Presentation Function

            $rootScope.retrieveAllImagesInFolder = function(parentId, assetType) {
                var apiUrl;
                switch(assetType) {
                    case 'general':
                        apiUrl = '/general/assets?searchKey=';
                        $http.get(apiUrl).then(function(assets) {
                            console.log('general assets find success');
                            $rootScope.generalAssets = assets;
                        });
                        break;
                    case 'client':
                        apiUrl = '/accounts/' + parentId + '/assets?searchKey=';
                        $http.get(apiUrl).then(function(assets) {
                            console.log('account retrieved assets');
                            $rootScope.clientAssets = assets;
                        });
                        break;
                    case 'presentation':
                        apiUrl = '/general/assets/presentation/find/' + parentId + '/*';
                        $http.get(apiUrl).then(function(assets) {
                            $rootScope.presentationAssets = assets;
                        });
                        break;
                }
            };

            $rootScope.onPresntationDetailAccountChange = function(selectedAccountId) {
                $rootScope.selectedAccountId = selectedAccountId;
                if($rootScope.isBrighterViewManager){
                    $rootScope.retrieveAllImagesInFolder(selectedAccountId, 'client');
                }
                else if($rootScope.isAdmin) {
                    $rootScope.selectedAccountId = $rootScope.currentUser.accounts[0];
                    $rootScope.retrieveAllImagesInFolder($rootScope.selectedAccountId, 'client');
                }
            };

            $scope.checkCopy = function ($event) {
                console.log($event.keyCode);
            };

            $scope.copyLink = function () {
                $scope.copyLabel = 'Copied!';
            };

            $scope.sendLink = function () {

                var pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
                var message = 'default';
                var subject = 'Brightergy Client Portal Presentation';
                if(!pattern.test($scope.recipientEmail)) {
                    $scope.emailError = 'Invaild Email';
                    return false;
                } else {
                    $scope.emailError = '';
                }
                if ($scope.recipientEmailSubject){
                    subject = $scope.recipientEmailSubject;
                }
                if ($scope.recipientEmailMessage){
                    message = $scope.recipientEmailMessage;
                }
                $scope.sendingLink = 'Sending...';
                var apiUrl = '/notifications/email/presentationlink';
                var jsonData = {
                    'email' : $scope.recipientEmail,
                    'link' : $rootScope.presentationLink,
                    'subject' : subject,
                    'message' : message,
                    'presentationName' : $rootScope.presentationDetails.name
                };
                $http
                    .post(apiUrl, jsonData)
                    .then(function() {
                        notifyService.successNotify('Successfully Sent!');
                        $scope.sendingLink = 'Send a Link';
                        $scope.togglePanel = false;
                    }, function () {
                        $scope.sendingLink = 'Send a Link';
                    });
            };
            $rootScope.routeToPresentation = function (presentationId, isChangeLocation) {
                if (!presentationId) {
                    if (isChangeLocation) {
                        $location.path('/').replace();
                    }
                    return;
                }
                if (isChangeLocation) {
                    $location.path('/' + presentationId).replace();
                }
            };
            /**
             * @author Kornel
             * @date Oct 18 2014
             * @description
             *     Created to remove inline javascript
             */
            $scope.settingTabSliderFormattingPanel2 = {
                tabHandle: '.handle-button2',        //class of the element that will be your tab
                tabLocation: 'right',                //side of screen where tab lives, top, right, bottom, or left
                speed: 500,                          //speed of animation
                action: 'click',                     //options: 'click' or 'hover', action to trigger animation
                topPos: '0px',                       //position from the top
                fixedPosition: false,                //options: true makes it stick(fixed position) on scroll
                onSlideOut: function() {
                    $('.handle-button2').removeClass('handle-selected2');
                    $('.handle-button2').addClass('handle-selected2');
                },
                onSlideIn: function() {
                    $('.handle-button2').removeClass('handle-selected2');
                },
                renderAfter: function() {
                    $('.slide-formatting-panel2').css('height', 'auto');
                    $('.slide-formatting-panel2').css('left', 'initial');
                    $('a[data-toggle=\'tab\']').on('shown.bs.tab', function (e) {
                        console.log(e.target); // activated tab
                        var hash = e.target.hash;
                        console.log(hash);
                        if (hash.indexOf('client_assets') > -1) {
                            alert(1);
                        } else if (hash.indexOf('common_assets') > -1) {
                            alert(2);
                        } else if (hash.indexOf('present_assets') > -1) {
                            alert(3);
                        }
                    });
                }
            };
            /**
             * @author Kornel
             * @date Oct 18 2014
             * @description
             *     Created to remove inline javascript
             */
            $scope.settingTabSliderFormattingPanel = {
                tabHandle: '.handle-button',              //class of the element that will be your tab
                tabLocation: 'right',                     //side of screen where tab lives, top, right, bottom, or left
                speed: 500,                               //speed of animation
                action: 'click',                          //options: 'click' or 'hover', action to trigger animation
                topPos: '0px',                            //position from the top
                fixedPosition: false,                     //options: true makes it stick(fixed position) on scroll
                onSlideOut: function() {
                    $('.handle-button').removeClass('handle-selected2');
                    $('.handle-button').addClass('handle-selected2');
                },
                onSlideIn: function() {
                    $('.handle-button').removeClass('handle-selected2');
                },
                renderAfter: function() {
                    $('.slide-formatting-panel').css('height', 'auto');
                    $('.slide-formatting-panel').css('left', 'initial');
                }
            };

            $scope.goToPresentation = function (presentationId) {
                $location.path('/' + presentationId).replace();
            };

            $scope.init(renderErrors, renderPermissions, renderCurrentUser);
        }

    ]);
   
