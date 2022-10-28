describe('blApp.components.services.TagService', function () {

    beforeEach(module('blApp.components.services'));

    var TagService,
        rootScope,
        $httpBackend;

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        TagService = $injector.get('TagService');

        rootScope = $injector.get('$rootScope');
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('#createTag', function () {
        it('should exist', function () {
            expect(TagService.createTag).to.exist();
        });

        it('should make a POST request to the backend API with the provided tag object', function () {
            var tag = {
                name: 'Jedunn Commerce',
                tagType: 'Facility'
            };

            $httpBackend.expectPOST('/v1/tags', tag).respond(200, angular.extend({_id: 'new tag id'}, tag));
            TagService.createTag(tag);
            $httpBackend.flush();
        });

        it('should make a POST request to the backend API with the node tag object having nodeType property', function () {
            var tag = {
                name: 'Barretts Elementary: Inverter C',
                tagType: 'Node',
                nodeType: 'Solar'
            };

            expect(tag).to.have.property('nodeType');
            $httpBackend.expectPOST('/v1/tags', tag).respond(200, angular.extend({_id: 'new tag id'}, tag));
            TagService.createTag(tag);
            $httpBackend.flush();
        });

        it('should trigger event [DataSourceUpdated] with empty object', function () {
            var spy = sinon.stub(rootScope, '$broadcast', rootScope.$broadcast);

            var tag = {
                name: 'Jedunn Commerce',
                tagType: 'Facility'
            };

            var response = {
                success: 1,
                message: angular.extend({_id: 'new tag id'}, tag)
            };

            rootScope.$on('DataSourceUpdated', function (event, data) {
                expect(data).to.be.an('object');
                expect(data).to.be.empty();
            });

            $httpBackend.when('POST', '/v1/tags').respond(200, response);
            TagService.createTag(tag);
            $httpBackend.flush();

            expect(spy).to.have.been.called;
        });
        describe('#createTag', function () {
            it('should exists', function () {
                expect(TagService.createTag).to.exist();
            });
            it('should make a POST request to backend with providen tag object',function(){
               var tag = {
                   name: 'Jedunn Commerce',
                   tagType: 'Facility'
               };
                $httpBackend.expectPOST('/v1/tags',tag).respond(200);
                TagService.createTag(tag);
                $httpBackend.flush();
            });
        });

    });




    /*describe('#getAccessibleUsersByTag', function () {
        it('exists', function () {
            expect(TagService.getAccessibleUsersByTag).to.exist();
        });
    });
    describe('#listAllManufacturers', function () {
        it('exists', function () {
            expect(TagService.listAllManufacturers).to.exist();
        });
    });
    describe('#listAllDevices', function () {
        it('exists', function () {
            expect(TagService.listAllDevices).to.exist();
        });
    });
    describe('#createTag', function () {
        it('exists', function () {
            expect(TagService.createTag).to.exist();
        });
    });
    describe('#updateTag', function () {
        it('exists', function () {
            expect(TagService.updateTag).to.exist();
        });
    });
    describe('#deleteTag', function () {
        it('exists', function () {
            expect(TagService.deleteTag).to.exist();
        });
    });
    describe('#checkTagDeletable', function () {
        it('exists', function () {
            expect(TagService.checkTagDeletable).to.exist();
        });
    });*/
});