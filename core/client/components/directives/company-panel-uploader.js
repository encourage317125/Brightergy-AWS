angular.module('blApp.components.directives')
    .directive('companyPanelUploader', function() {
        return {
            restrict: 'E',
            scope: {
                uploaderInfo: '=info'
            },
            link: function(scope) {
                
            },
            templateUrl: '/components/directives/templates/company-panel-uploader.html'
        };
    });