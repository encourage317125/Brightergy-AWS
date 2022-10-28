angular.module('blApp.components.directives')
    .directive('ngDifferentWith', function () {
        return {
            require: 'ngModel',
            link: function (scope, currentEl, attrs, ctrl) {
                var comparefield = document.getElementsByName(attrs.ngDifferentWith)[0],  //getting first element
                    compareEl = angular.element(comparefield);


                //current field key up
                currentEl.on('change', function () {
                    if (compareEl.val() !== '') {
                        var isMatch = currentEl.val() !== compareEl.val();
                        ctrl.$setValidity('differentWith', isMatch);
                        scope.$digest();
                    }
                });

                //Element to compare field key up
                compareEl.on('change', function () {
                    if (currentEl.val() !== '') {
                        var isMatch = currentEl.val() !== compareEl.val();
                        ctrl.$setValidity('differentWith', isMatch);
                        scope.$digest();
                    }
                });
            }
        };
    }).directive('ngFullName', function () {
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
    }).directive('ngPhoneNumber', function () {
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
    }).directive('ngRfcEmail', function () {
        return {
            require: 'ngModel',
            link: function (scope, currentEl, attrs, ctrl) {

                var str = '^(?:[a-z0-9\\u00A0-\\uD7FF\\uF900-\\uFFEF!#$%&\'*+/=?^_`{|}~-]+' +
                    '(?:\\.[a-z0-9\\u00A0-\\uD7FF\\uF900-\\uFFEF!#$%&\'*+/=?^_`{|}~-]+)*|"' +
                    '(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x20\\x21\\x23-\\x5b\\x5d-\\x7f]|' +
                    '\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*")' +
                    '@(?:(?:[a-z0-9\\u00A0-\\uD7FF\\uF900-\\uFFEF]' +
                    '(?:[a-z0-9\\u00A0-\\uD7FF\\uF900-\\uFFEF-]*[a-z0-9\\u00A0-\\uD7FF\\uF900-\\uFFEF])?\\.)*' +
                    '[a-z0-9\\u00A0-\\uD7FF\\uF900-\\uFFEF](?:[a-z0-9\\u00A0-\\uD7FF\\uF900-\\uFFEF-]*' +
                    '[a-z0-9\\u00A0-\\uD7FF\\uF900-\\uFFEF])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}' +
                    '(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\u00A0-\\uD7FF\\uF900-\\uFFEF]|' +
                    '\\\\[\\u00A0-\\uD7FF\\uF900-\\uFFEF])+)\\])$';
                var reValidEmail = new RegExp(str);

                currentEl.on('input change', function() {
                    var emailAddress = currentEl.val().trim();
                    if (currentEl.val() !== emailAddress) {
                        ctrl.$setValidity('rfcEmail', false);
                    } else if (emailAddress !== '') {
                        if (reValidEmail.test(emailAddress)) {
                            ctrl.$setValidity('rfcEmail', true);
                        } else {
                            ctrl.$setValidity('rfcEmail', false);
                        }
                    } else {
                        ctrl.$setValidity('rfcEmail', true);
                    }
                    scope.$digest();
                });

            }
        };
    });