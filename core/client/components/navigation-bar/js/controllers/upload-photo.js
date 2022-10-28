angular.module('blApp.components.navigationBar')
    .controller('UploadPhotoController', ['$scope', '$uibModalInstance',
        function ($scope, $uibModalInstance) {
            $scope.images = {
                myOriginalImage: '',
                myCroppedImage: ''
            };
            $scope.isFileSelected = false;

            $scope.setFileHandler = function() {
                angular.element(document.querySelector('#fileInput')).on('change', $scope.handleFileSelect);
                angular.element(document.querySelector('#bl-modal-upload-photo')).on('click', $scope.modalBodyClicked);
            };

            $scope.handleFileSelect = function(evt) {
                $scope.isFileSelected = true;
                var file = evt.currentTarget.files[0];
                var reader = new FileReader();
                reader.onload = function (evt) {
                    if (!$scope.$$phase) {
                        $scope.$apply(function ($scope) {
                            $scope.images.myOriginalImage = evt.target.result;
                        });
                    }
                };
                reader.readAsDataURL(file);
            };

            $scope.modalBodyClicked = function(evt) {
                evt.stopPropagation();
            };

            $scope.selectFileClicked = function () {
                angular.element(document.querySelector('#fileInput')).click();
            };

            $scope.saveProfilePicture = function () {
                $uibModalInstance.close($scope.images.myCroppedImage);
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }
    ]);
