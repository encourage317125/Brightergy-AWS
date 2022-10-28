'use strict';

angular.module('blApp.presentation.services')
    .service('socketService', ['$http', 'utilService', '$rootScope', 'blSocket',
        function($http, utilService, $rootScope, blSocket) {

            $rootScope.socketRequest = {request:{}, data:{socketId:null}};
            $rootScope.socketId = null;
            $rootScope.widgets = {};
            $rootScope.socketCallbacks = {
                'getPresentationData' : null
            };

            blSocket.on('init', function(data){
                console.log('INIT WEB SOCKET');
            });

            blSocket.on('connect', function(data){
                console.log('SOCKET CONNECT EVENT');
            });

            blSocket.on('connected', function(data){
                console.log('SOCKET CONNECTED.....................');
                console.log(data.socketId);
                if (data.socketId){
                    $rootScope.socketId = data.socketId;
                    $rootScope.$emit('socketConnected', data);
                    
                    $rootScope.socketRequest.data.socketId = data.socketId;
                    
                    blSocket.emit($rootScope.socketRequest.request, $rootScope.socketRequest.data);
                }
                //$rootScope.socketRequest = null;
            });

            blSocket.on('disconnect', function(data) {
                $rootScope.socketId = null;
                $rootScope.$emit('socketDisconnected', data);
            });
            blSocket.on('presentationData', function(data) {
                console.log('socket widget data............');
                console.log(data.message);

                if (data.message.widgetData){
                    angular.forEach($rootScope.widgets, function(widget){
                        if (widget._id === data.message.widgetId){
                            $rootScope.$emit('PresentDataReceived', {'widget':widget, 'socketData': data.message});
                        }
                    });
                } else {
                    console.log('no received data.');                        
                }
            });

            this.socketGetWidgetsData = function (presentation, callback) {
                // $rootScope.socketCallbacks['getDashboardData'] = callback;
                
                this.initWidgetData(presentation);
                console.log('socketGetWidgetsData.............');
                console.log($rootScope.socketId);

                $rootScope.socketRequest = {
                    request: 'getPresentationData', 
                    data: {
                        'presentations': [presentation._id]
                    }
                };

                if($rootScope.socketId !== null) {
                    console.log('EMIT PRESENT SOCKET CONNECT EVENT');
                    console.log(presentation._id);
                    blSocket.emit('getPresentationData',
                        {'socketId': $rootScope.socketId, 'presentations': [presentation._id]},
                        function() {
                            console.log('==WEB SOCKET EMIT CALLBACK==', arguments);
                        });
                }
            };
            this.initWidgetData = function(presentation) {
                $rootScope.widgets = presentation.widgets;
            };
        }
    ]);