angular.module('blApp.components.services')

.service('notifyService', function () {
    this.errorNotify = function (message) {
        notyfy({
            text: '<strong>' + message + '</strong><br><div class="click-close">{Click this bar to Close}',
            type: 'error',
            dismissQueue: true
        });
    };

    this.successNotify = function (message) {
        notyfy({
            text: '<strong>' + message + '</strong><br><div class="click-close">{Click this bar to Close}',
            type: 'success',
            dismissQueue: true
        });
    };
});