'use strict';

angular.module('blApp.test.controllers', ['blApp.components.services']);

var dependencies = [
  'blApp.test.controllers',
  'blApp.components.directives',
  'blComponents.platformPanel'
];

angular.module('blApp.test', dependencies)

.constant('ANALYZE_CONFIG', {
    'WidgetInstancePadding': 3
})
.config(function ($provide, $locationProvider) {
	$provide.value('WidgetInstancePadding', 3);

    $locationProvider.hashPrefix('!');
});
