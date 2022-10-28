angular.module('bl.analyze.solar.surface')
.service('SourceSelectionEventService',
  ['$rootScope', 'SocketIO', 'mainStageEventList',
    function($rootScope, SocketIO, mainStageEventList) {
      var listenCallbacks = [];

      this.broadcast = function(selectedFacilities, selectedScopes, selectedNodes) {

        SocketIO.emit('assurf:selectedsources', {
          'selectedFacilities': selectedFacilities,
          'selectedScopes': selectedScopes,
          'selectedNodes': selectedNodes
        });

        for (var idx = 0; idx < listenCallbacks.length; idx++) {
          listenCallbacks[idx].call(null, {
            facilities: selectedFacilities,
            scopes: selectedScopes,
            nodes: selectedNodes
          });
        }

        return this;
      };

      this.listen = function(callback) {
        for (var idx = 0; idx < listenCallbacks.length; idx++) {
          if (listenCallbacks[idx] === callback) {
            return false;
          }
        }

        listenCallbacks.push(callback);

        return this;
      };


      var mainStageEventListForChecking = {},
        mainStageListenCallbacks = [];
      var resetMSEventListForChecking = function () {
        for (var idx = 0; idx < mainStageEventList.length; idx++) {
          mainStageEventListForChecking[mainStageEventList[idx]] = 0;
        }
      };

      var checkTheyAllLoaded = function(eventName) {

        if (mainStageEventList.indexOf(eventName) > -1) {
          mainStageEventListForChecking[eventName] = 1;

          for (var i = 0; i < mainStageEventList.length; i++) {
            if (mainStageEventListForChecking[mainStageEventList[i]] === 0) {
              return false;
            }
          }

          // Finally MainStage is All Loaded;
          angular.forEach(mainStageListenCallbacks, function (cb) {
            cb();
          });
          resetMSEventListForChecking();

          return true;
        }
        return false;
      };

      resetMSEventListForChecking();
      for (var idx = 0; idx < mainStageEventList.length; idx ++) {
        (function (eventName) {
          SocketIO.watch(eventName, function () {
            checkTheyAllLoaded(eventName);
          });
        })(mainStageEventList[idx]);
      }

      this.resetMainStageChecking = resetMSEventListForChecking;

      this.listenMainStageLoaded = function (callback) {
        mainStageListenCallbacks.push(callback);
      };

    }]);