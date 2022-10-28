angular.module('blApp.components.directives')
    .directive('isotopeContainer', ['$rootScope', '$timeout',
        function ($rootScope, $timeout) {
            return {
                restrict: 'A',
                controller: function ($scope, $element, $attrs) {
                    $scope.elems = [];

                    $scope.setIsoElement = function (iElem, last) {
                        $element.append(iElem).isotope('appended', iElem);
                        // if(last)
                        //    $element.isotope('layout');
                    };

                },
                link: function (scope, element, attrs, ctrl) {

                    $timeout(function () {
                        element.isotope({
                            itemSelector: '.isotope-item'
                        });
                    }, 10);

                    scope.$on('refreshIso', function (message, options) {
                        if (attrs.id === options.containerId) {
                            $timeout(function () {
                                element.isotope();
                            }, 10);
                        }
                    });

                    scope.$on('arrangeIso', function (message, options) {
                        if (attrs.id === options.containerId) {
                            //$timeout(function(){ element.isotope('reloadItems').isotope();}, 1000);
                            element.ready(function () {
                                $timeout(function () {
                                    element.imagesLoaded(function () {
                                        element.isotope('reloadItems').isotope();
                                    });
                                }, 50);
                            });
                        }
                    });

                    scope.$on('reloadItems', function (message, options) {
                        if (attrs.id === options.containerId) {
                            $timeout(function () {
                                element.isotope('reloadItems');
                                element.fadeIn(200);

                                $timeout(function () {
                                    element.isotope();
                                }, 100);
                            }, 1500);
                        }
                    });

                    scope.$on('assetsList', function () {
                        console.log('asstts changed');
                    });

                    return element;
                }

            };
        }
    ])
    .directive('isotopeItem', ['$rootScope', '$timeout',
        function ($rootScope, $timeout) {
            return {
                restrict: 'A',
                require: '^isotopeContainer',
                scope: false,
                link: function (scope, element, attrs, ctrl) {
                    //scope.setIsoElement(element,scope.$last);

                    scope.$on('$destroy', function (message) {
                        //$rootScope.$broadcast(topics.MSG_REMOVE, element);
                    });

                    if (attrs.ngRepeat && true === scope.$last) {
                        element.ready(function () {
                            $timeout(function () {
                                // var container = element.parent();
                            }, 100);
                        });
                    }

                    return element;
                }
            };
        }
    ]);