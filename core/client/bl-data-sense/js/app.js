'use strict';

angular.module('blApp.dataSense.controllers', ['blApp.components.services']);
angular.module('blApp.dataSense.directives', ['blApp.components.services']);
angular.module('blApp.dataSense.services', ['blApp.components.services']);

var dependencies = [
  'ui.select',
  'ngRoute',
  'ngSanitize',
  'nvd3ChartDirectives',
  'ngTable',
  'ngAnimate',
  'ngImgCrop',
  'ngClipboard',
  'treeControl',
  'blApp.dataSense.controllers',
  'blApp.dataSense.directives',
  'blApp.dataSense.services',
  'blApp.components.companyPanel',
  'blApp.components.navigationBar',
  'blApp.components.directives',
  'blApp.components.services',
  'flow',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'ui.autocomplete',
  'ng-context-menu'
];

angular.module('blApp.dataSense', dependencies)

.constant('ANALYZE_CONFIG', {
    'WidgetInstancePadding': 3
})
.constant('ANALYZE_CONSTS', {
    DATA_SENSE_WIDGET_TYPES: {
        Timeline: 'Timeline',
        Bar: 'Bar',
        Pie: 'Pie',
        Image: 'Image',
        Equivalencies: 'Equivalencies',
        Table: 'Table',
        Kpi: 'Kpi',
        Boilerplate: 'Boilerplate'
    },
    DIMENSIONS: {
        COUNT_OF_DATAPOINTS: 'Count of Datapoints',
        INTERVAL: 'Interval',
        COUNTRY: 'Country',
        STATE: 'State',
        CITY: 'City',
        ZIP_CODE: 'Zip code',
        //ACCOUNT: 'Account',
        ACCESS_METHOD: 'Access Method',
        //LATITUDE: 'Latitude',
        //LONGITUDE: 'Longitude',
        //USES_IN_DASHBOARD: 'Uses in Dashboard',
        //USES_IN_PRESENTATION: 'Uses in Presentation',
        //USES_IN_BRIGHTERLINK: 'Uses in BrighterLink',
        //SOURCE_TYPE: 'Source Type',
        //MANUFACTURER: 'Manufacturer',
        //DEVICE: 'Device',
        //TEAM_MEMBER_WITH_ACCESS: 'Team Members with Access',
        MINUTE_INDEX: 'Minute Index',
        HOUR_INDEX: 'Hour Index',
        DAY_INDEX: 'Day Index',
        WEEK_INDEX: 'Week Index',
        MONTH_INDEX: 'Month Index',
        MINUTE: 'Minute',
        HOUR: 'Hour',
        DATE: 'Date',
        WEEK: 'Week',
        MONTH: 'Month',
        YEAR: 'Year',
        MINUTE_OF_HOUR: 'Minute of the Hour',
        HOUR_OF_DAY: 'Hour of the Day',
        DAY_OF_WEEK: 'Day of the Week',
        DAY_OF_MONTH: 'Day of the Month',
        WEEK_OF_YEAR: 'Week of the Year',
        MONTH_OF_YEAR: 'Month of the Year'
    }
})
.config(function ($routeProvider, $provide, $stateProvider, $urlRouterProvider, $locationProvider, ngClipProvider,
                  flowFactoryProvider) {

    flowFactoryProvider.defaults = {
        singleFile: true,
        withCredentials: true
    };

    $provide.value('WidgetInstancePadding', 3);

    $urlRouterProvider.otherwise('/');
    $locationProvider.hashPrefix('!');
    $stateProvider
        .state('dashboard', {
            url: '/:dashboardId',
            views: {
                'routerView': {
                    template: '<div></div>',
                    controller: 'DatasenseRouterCtrl'
                }
            }
        });
})
.run(function ($rootScope, configuration) {
    $rootScope.baseCDNUrl = configuration('cdn').env === 'production' ? '//' + configuration('cdn').domain : '';
});
