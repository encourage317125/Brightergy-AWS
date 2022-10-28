'use strict';

angular.module('blApp.dataSense.services')
    .factory('blSocket', ['socketFactory', function (socketFactory) {
        console.log('socketFactory');
        return socketFactory();
    }]);