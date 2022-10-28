angular.module('bl.analyze.solar.surface')

.factory('SocketIO', ['$rootScope', '$q', '$timeout',  'toastrConfig', 'toastr',
      'socketFactory', 'wsEntryPoint', 'wsConfig', 'firstLoadEventList',
  function ($rootScope, $q, $timeout, toastrConfig, toastr, socketFactory, wsEntryPoint, wsConfig, firstLoadEventList) {
    var myIoSocket, mySocket, mySocketId;
    var initialLoadEvent = angular.copy(firstLoadEventList);
    var defer = $q.defer();
    var watchCallbacks = {};
    var cbUniqueId = -1;

    wsEntryPoint = wsEntryPoint || 'http://localhost:3000';  // it should be loaded from jade

    myIoSocket = io.connect(wsEntryPoint, wsConfig);
    mySocket = socketFactory({
      ioSocket: myIoSocket
    });

    function sendRequest(eventName, data, socketId) {
      var requestData = angular.extend(data, {
        'socketId': socketId
      });
      mySocket.emit(eventName, requestData);
    }

    function decompressResponse(response) {
      if (response instanceof ArrayBuffer) {
        var binData = new Uint8Array(response),
            plain = pako.ungzip(binData, {to: 'string'});
        return angular.fromJson(plain);
      } else {
        return response;
      }
    }

    function countInitialLoadEvent(eventName) {
      if (!initialLoadEvent.length) {
        return ;
      }
      if (initialLoadEvent.indexOf(eventName) > -1) {
        initialLoadEvent.splice(initialLoadEvent.indexOf(eventName), 1);
        $rootScope.initialDataLoadedPercent =
          Math.ceil((firstLoadEventList.length - initialLoadEvent.length + 1) /
                    (firstLoadEventList.length + 1) * 100);
        console.log('Percentage goes here:', $rootScope.initialDataLoadedPercent);
      }
    }

    // Remove assurf:viewertzoffset from socket-io.js
    /*function emitClientTimezoneToServer (socketId) {
      var eventName = 'assurf:viewertzoffset',
        requestData = {
          viewerTZOffset: new Date().getTimezoneOffset() * -1
        };

      console.log('Socket Request on [%s] channel:', eventName, requestData);
      sendRequest(eventName, requestData, socketId);
    }*/

    // Get Socket ID;
    mySocket.on('connected', function (data) {
      data = decompressResponse(data);

      if (data.socketId) {
        mySocketId = data.socketId;
        console.log('SocketIO get socketId:', mySocketId);


        // Send client timezone to server as soon as Socket is connected
        // Remove assurf:viewertzoffset from socket-io.js
        //emitClientTimezoneToServer(mySocketId);

        defer.resolve(mySocketId);
      } else {
        console.log('Socket Channel[%s] Error: %s', 'connected', data.message);
      }
    });

    // Catch when lost connection

    mySocket.on('disconnect', function () {
      console.log('Socket is disconnected, please check your network connection and try again');
    });

    return {
      _mySocket: mySocket,
      _getSocketId: function () {
        return mySocketId;
      },
      emit: function (eventName, data) {
        // Check if we have socketId;
        if (mySocketId) {
          console.log('Socket Request on [%s] channel:',eventName, data);
          sendRequest(eventName, data, mySocketId);
        } else {
          defer.promise.then(function (socketId) {
            sendRequest(eventName, data, socketId);
          });
        }
      },
      watch: function (eventName, callback) {
        cbUniqueId++;
        if (watchCallbacks[eventName] && Object.keys(watchCallbacks[eventName]).length) {
          watchCallbacks[eventName][cbUniqueId] = callback;
          return cbUniqueId;
        } else {
          watchCallbacks[eventName] = {};
          watchCallbacks[eventName][cbUniqueId] = callback;
        }

        mySocket.on(eventName, function (data) {
          data = decompressResponse(data);
          console.log('Socket Response on [%s] channel:',eventName, data);

          angular.element(document.querySelector('#toast-container')).html('');
          angular.element(document.querySelector('#loading-welcome-msg small')).css('display', '');
          toastrConfig.timeOut = 0;
          toastrConfig.extendedTimeOut = 0;
          toastrConfig.allowHtml = true;
          toastrConfig.positionClass = 'toast-bottom-full-width';
          toastrConfig.autoDismiss = true;
          toastrConfig.maxOpened = 1;
          toastrConfig.tapToDismiss = false;

          if (!data.success){
            console.log('Socket Channel[%s] Error: %s', eventName, data.message);
            $timeout(function() {
              angular.element(document.querySelector('#loading-welcome-msg small')).css('display', 'none');
              toastr.error('<b>Critical Error</b>: There was an error retrieving your data.' +
                ' Your BrighterLink support team is aware of the issue and is working hard to resolve it.' +
                '<span class="toastr-refresh">' +
                '<a href="mailto:services@brightergy.com">Let us know about this.</a> &nbsp;' +
                '<a href="javascript:location.reload();">' +
                '<img src="dist/img/reload_icon.png" width="15" height="13"/>' +
                '</a></span>', '', {
                iconClass: 'toastr-icon-error'
              });
            }, 0);
            return;
          }

          $rootScope.$apply(function () {
            countInitialLoadEvent(eventName);
            angular.forEach(watchCallbacks[eventName], function (callback) {
              callback.call(mySocket, data.message);
            });
          });
        });

        return cbUniqueId;
      },
      unwatch: function (eventName, cbUniqueId) {
        if (typeof watchCallbacks[eventName] === 'object'
          && Object.keys(watchCallbacks[eventName]).indexOf(cbUniqueId) > -1) {
          delete watchCallbacks[eventName][cbUniqueId];
          return;
        }

        watchCallbacks[eventName] = undefined;
        mySocket.removeAllListeners(eventName);
      },
      removeAllListeners: function () {
        mySocket.removeAllListeners();
      }
    };
  }
]);