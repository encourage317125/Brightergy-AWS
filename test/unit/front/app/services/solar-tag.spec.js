describe('SERVICE - bl.analyze.solar.surface.solarTagService', function () {
  var solarTagService, scope, rootScope, rawSolarTags;

  // Mock $window dependency to fake jade render values
  beforeEach(module('bl.analyze.solar.surface', function ($provide) {
    rawSolarTags = window.renderSolarTags;

    $provide.value('$window', {
      renderSolarTags: rawSolarTags,
      isSolarTagsCompressed: false
    });
  }));

  beforeEach(inject(function ($injector) {
    solarTagService = $injector.get('solarTagService');
    rootScope = $injector.get('$rootScope');
    scope = rootScope.$new();
  }));

  it('should be defined', function () {
    expect(solarTagService).to.exist;
  });

  describe('#watchWeatherHistory public method', function () {
    var promise;

    beforeEach(function () {
      promise = solarTagService.getAll();
    });

    it('should return promise', function () {
      expect(promise).to.have.property('then');
    });

    it('should return resolved promise with jade rendered solarTags', function (done) {
      var originalFacilityList = rawSolarTags.facilities;

      promise
        .then(function (facilityList) {
          expect(facilityList).to.be.instanceOf(Array);
          expect(facilityList.length).to.equal(originalFacilityList.length);
        })
        .finally(done);
      scope.$digest();
    });

    it('should return with must-need attribute initialized', function (done) {
      promise
        .then(function (facilityList) {
          var facility = facilityList.pop();
          expect(facility).to.have.property('percent');
          expect(facility).to.have.property('lastReportedValue');
          expect(facility).to.have.property('scopes');
          expect(facility).to.have.property('selected');
          expect(facility).to.have.property('displayName');
          expect(facility).to.have.property('commissioningDate');
          expect(facility).to.have.property('selected');

          if (facility.selected) {
            expect(facility).to.have.property('color');
          }
        })
        .finally(done);
      scope.$digest();
    });
  });

  describe('#getDisplayName method', function () {
    var promise;

    beforeEach(function () {
      promise = solarTagService.getAll();
    });

    it('should be defined', function () {
      expect(solarTagService.getSourceDetail).to.exist;
    });

    it('should return matching facility object with source id', function (done) {
      promise
        .then(function () {
          var inputSourceId = rawSolarTags.facilities[1].id,
            sourceDetail = solarTagService.getSourceDetail(inputSourceId);

          expect(sourceDetail).to.be.instanceOf(Object);
          expect(sourceDetail.id).to.equal(inputSourceId);
        })
        .finally(done);
      scope.$digest();
    });
  });

  describe('#getLastTotalCurrentPower method', function () {
    it('should be defined', function () {
      expect(solarTagService.getLastTotalCurrentPower).to.exist;
    });
  });
});