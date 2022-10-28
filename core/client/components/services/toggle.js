angular.module('blApp.components.services')
    .service('toggleService', function() {
        this.togglePleaseWait = function() {
            if ($('.blockUI').length === 0) {
                $.blockUI({
                    message: '<div id="loader"></div>',
                    css: {
                        cursor: 'arrow',
                        height: 'auto',
                        width: 'auto',
                        margin: '-85px 0 0 -85px',
                        padding: '0',
                        top: '50%',
                        left: '50%',
                        border: '0',
                        background: 'transparent'
                    },
                    applyPlatformOpacityRules: false,
                    fadeIn: 0,
                    fadeOut: 150
                });
            } else {
                $.unblockUI();
            }
        };
        this.showPleaseWait = function() {
            if ($('.blockUI').length === 0) {
                $.blockUI({
                    message: '<div id="loader"></div>',
                    css: {
                        cursor: 'arrow',
                        height: 'auto',
                        width: 'auto',
                        margin: '-85px 0 0 -85px',
                        padding: '0',
                        top: '50%',
                        left: '50%',
                        border: '0',
                        background: 'transparent'
                    },
                    applyPlatformOpacityRules: false,
                    fadeIn: 0,
                    fadeOut: 150
                });
            }
        };
        this.hidePleaseWait = function() {
            if ($('.blockUI').length !== 0) {
                $.unblockUI();
            }
        };
    });

