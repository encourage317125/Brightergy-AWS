'use strict';

angular.module('blComponents.platformPanel')
.directive('ngFullName', function () {
  return {
    require: 'ngModel',
    link: function (scope, currentEl, attrs, ctrl) {
      var nameArray, firstName, lastName, username;
      currentEl.on('input change', function() {
        username = currentEl.val().trim();
        if (username !== '') {
          nameArray = username.split(' ');
          if (nameArray.length === 1) {
            firstName = nameArray[0];
            lastName = '';
          } else if (nameArray.length === 2) {
            firstName = nameArray[0];
            lastName = nameArray[1];
          } else if (nameArray.length === 3) {
            firstName = nameArray[0];
            lastName = nameArray[2];
          } else {
            firstName = '';
            lastName = '';
          }
          if (firstName === '' || lastName === '') {
            ctrl.$setValidity('fullname', false);
          } else {
            ctrl.$setValidity('fullname', true);
          }
        } else {
          ctrl.$setValidity('fullname', true);
        }
      });
    }
  };
})
.directive('ngPhoneNumber', function () {
  return {
    require: 'ngModel',
    link: function (scope, currentEl, attrs, ctrl) {
      var str = '^\\d\\d\\d([-.\\s]?)\\d\\d\\d\\1\\d\\d\\d\\d$|' +
        '^(:?(:?\\(\\d\\d\\d\\))?\\s*\\d\\d)?\\d[-.\\s]?\\d\\d\\d\\d$';
      var PHONE_REGEXP = new RegExp(str);
      var PHONE_REGEXP2 = /^(?:\+?1([-.\s]?))?\d\d\d\1\d\d\d\1\d\d\d\d$/;

      // var PHONE_REGEXP = /^[0-9]{1}-[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
      //   /^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/;
      //   /^(?:\+?1[-. ]?)?(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})$/;
      currentEl.on('input change', function() {
        var value = currentEl.val().trim();
        if (value !== '') {
          if (PHONE_REGEXP.test(value) || PHONE_REGEXP2.test(value)) {
            ctrl.$setValidity('phonenumber', true);
          } else {
            ctrl.$setValidity('phonenumber', false);
          }
        } else {
          ctrl.$setValidity('phonenumber', true);
        }
      });
    }
  };
});