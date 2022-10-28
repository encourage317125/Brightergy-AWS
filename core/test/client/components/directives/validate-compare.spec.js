describe('blApp.components.directives.directives', function () {
    beforeEach(module('blApp.components.directives'));
    describe('#ngPhoneNumber directive', function () {
        var scope, element;
        beforeEach(inject(function($rootScope, $compile) {
            scope = $rootScope;

            element = angular.element(
                '<form name="form">' +
                '<input ng-model="model.phone" name="phone" ng-phone-number/>' +
                '</form>'
            );
            scope.model = {phone: null};
            $compile(element)(scope);
            scope.$digest();
        }));

        it('should have error when phone number is in incorrect format', function () {
            element.find('input').val('wrong phone number').triggerHandler('input');
            scope.$apply();
            expect(element.find('input').hasClass('ng-invalid')).to.be.equal(true);
        });

        it('should have success when phone number is in correct format', function () {
            element.find('input').val('1-816-866-0555').triggerHandler('input');
            scope.$apply();
            expect(element.find('input').hasClass('ng-valid')).to.be.equal(true);
        });
    });
});