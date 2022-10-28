angular.module('blApp.components.directives')
    .directive('sourceUploader', function($compile) {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: '/components/company-panel/views/source-uploader.html',
            scope: false,
            link : function ($scope, element, attrs, controller) {
                element.bind('change', function (e) {
                    $scope.sourceUploadStatus = '';
                    $scope.sourceUploadInfo = {
                        tag: '',
                        file: null,
                        name: '',
                        type: '',
                        contents: [],
                        filteredContents: [],
                        columns: [],
                        rawData: null,
                        submitted: false,
                        result: false
                    };

                    var uploadedFile = (e.srcElement || e.target).files[0];
                    
                    if(uploadedFile.name.indexOf('.csv') > 0) {
                        $scope.sourceUploadInfo.type = 'CSV';
                    } 
                    else if (uploadedFile.name.indexOf('.json') > 0) {
                        $scope.sourceUploadInfo.type = 'JSON';
                    }
                    else {
                        $scope.sourceUploadStatus = 'Please upload file with types .csv or .json';
                        $scope.$apply();

                        return;
                    }

                    if ($scope.sourceUploadInfo.type !== '') {
                        $scope.sourceUploadInfo.file = uploadedFile;
                        $scope.sourceUploadInfo.name = uploadedFile.name;
                        $scope.sourceUploadInfo.tag = attrs.info;
                        
                        $scope.parseUploadedFile();
                    }

                    (e.srcElement || e.target).files = [];
                    (e.srcElement || e.target).value = '';
                });
                    
            }
        };
    });