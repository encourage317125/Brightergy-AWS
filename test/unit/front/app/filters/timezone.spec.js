describe('Timezone filter', function () {

    var $filter;

    beforeEach(function () {
        module('bl.analyze.solar.surface');

        inject(function (_$filter_) {
            $filter = _$filter_;
        });
    });

    it('should display timezone full name', function () {
        //var today = new Date();
        /*var result = $filter('timezone')();
        var tz = new Date().getTimezoneOffset();
        expect(result).toEqual(tz);
        //expect(timezone()).toEqual(new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1]);*/
    });
});