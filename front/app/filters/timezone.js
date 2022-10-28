'use strict';

angular.module('bl.analyze.solar.surface')
    .filter('timezone', ['$filter','tznames', function ($filter, tznames) {
      return function() {
        var OSName='Unknown OS';
        if (navigator.appVersion.indexOf('Win') !== -1) {
          OSName = 'Windows';
        }

        var ret = '';
        if (OSName === 'Windows'){
          ret = new Date().toLocaleString('en-Us',
              {hour12:false, hour:'2-digit', timeZoneName: 'long'}
          ).replace(/^\d\d/, '').trim();
        }
        else{
          var tz = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];
          var offset = new Date().getTimezoneOffset();
          ret = tznames[tz];
          if (typeof ret === 'object') {
            ret = ret[offset];
          }
        }

        return ret;
      };
    }]);