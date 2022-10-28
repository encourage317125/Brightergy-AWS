'use strict';

angular.module('blApp.test.controllers')
    .controller('TestController',
        ['$scope', '$rootScope', '$http', '$timeout', '$location', 
        function ($scope, $rootScope, $http, $timeout, $location) {
            $scope.panelData = {
			    'user': {
			        '_id': '54590cc2fcbf7357005117cf',
			        'firstName': 'Petro',
			        'lastName': 'Lysenko',
			        'email': 'petro.lysenko@brightergy.com',
			        'emailUser': 'petro.lysenko',
			        'emailDomain': 'brightergy.com',
			        '__v': 0,
			        'accounts': ['54927f9da60298b00cd95fd2'],
			        'collections': [],
			        'accessibleTags': [],
			        'profilePictureUrl': '/assets/img/mm-picture.png',
			        'sfdcContactId': null,
			        'defaultApp': null,
			        'apps': [],
			        'previousEditedDashboardId': null,
			        'lastEditedDashboardId': null,
			        'previousEditedPresentation': null,
			        'lastEditedPresentation': null,
			        'role': 'BP',
			        'enphaseUserId': '4d6a49784e7a67790a',
			        'socialToken': null,
			        'phone': null,
			        'middleName': '',
			        'name': 'Petro Lysenko',
			        'sfdcContactURL': null,
			        'id': '54590cc2fcbf7357005117cf'
			    },
			    'menu': 'account'
			};

			$rootScope.apiDomain = '';
        }
    ]);