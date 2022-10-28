'use strict';

angular.module('blComponents.platformPanel')

.filter('nameInitial', function () {
  return function (fullName) {
    if (!fullName) { return ''; }
    var firstName = fullName.split(' ').slice(0, -1).join(' ').toUpperCase(),
        lastName = fullName.split(' ').splice(-1).join(' ').toUpperCase();

    return firstName.substr(0,1) + lastName.substr(0,1);
  };
});