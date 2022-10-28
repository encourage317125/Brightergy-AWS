/*(function (window, angular) {*/
  /*var callbackReturnDataRepo = {

  };

  var factory = {
    _invokeListenOneTime: function (eventName, data) {
      callbackReturnDataRepo[eventName] = data;
      return true;
    },
    on: function (eventName, callback) {
      if (eventName === 'connected') {
        callback({socketId: '123'});
        return;
      }
      if (callbackReturnDataRepo[eventName]) {
        callback(callbackReturnDataRepo[eventName]);
      }
      return true;
    },
    emit: function () {
      return true;
    }
  };*/
  window.socketFactory = function () {
    var callbackReturnDataRepo = {

    };

    return {
      _invokeListenOneTime: function (eventName, data) {
        callbackReturnDataRepo[eventName] = data;
        return true;
      },
      on: function (eventName, callback) {
        if (eventName === 'connected') {
          callback({socketId: '123'});
          return;
        }
        if (callbackReturnDataRepo[eventName]) {
          callback(callbackReturnDataRepo[eventName]);
        }
        return true;
      },
      emit: function () {
        return true;
      }
    };
  };
  /*angular.module('bl.analyze.solar.surface').constant('socketFactory', window.socketFactory);*/
/*})(window, angular);*/


