describe('blApp.components.companyPanel.CompanySourcesController', function () {

    beforeEach(module('blApp.components.companyPanel', 'blApp.components.services'));

    var scope,
        CompanySourcesController,
        TagService;

    beforeEach(inject(function ($injector) {
        var rootScope = $injector.get('$rootScope'),
            controller = $injector.get('$controller');

        TagService = $injector.get('TagService');

        scope = rootScope.$new();

        controller('CompanySourcesController', {
            $scope: scope,
            TagService: TagService
        });
    }));

    describe('#createFacility', function () {
        describe('initialization', function () {

            it('should expose createFacility() method to scope', function () {
                expect(scope.createFacility).to.exist();
                expect(scope.createFacility).to.be.instanceOf(Function);
            });

            /*it('should expose facilities array to scope', function () {
                expect(scope.facilities).to.exist();
                expect(scope.facilities).to.be.instanceof(Array);
                expect(scope.resultFacilities).to.exist();
                expect(scope.resultFacilities).to.be.instanceof(Array);
            });*/

            it('should expose createFacility() method to scope', function () {
                expect(scope.createFacility).to.exist();
                expect(scope.createFacility).to.be.instanceOf(Function);
            });
        });

        describe('createFacility() method', function () {
            var mockedForm = {
                $invalid: false
            };

            beforeEach(function () {
                sinon.spy(TagService, "createTag");
                sinon.stub(scope, "initializeFormValidation").returns(true);
            });

            it('should call the backend service', function () {
                scope.createFacility(mockedForm);
                expect(TagService.createTag).to.have.been.calledWith(scope.addFacility);
            });
        });
    });

    describe('#createNode', function () {
        describe('initialization', function () {

            it('should expose addNode object to scope', function () {
                expect(scope.addNode).to.exist();
            });

            it('should expose createNode() method to scope', function () {
                expect(scope.createNode).to.exist();
                expect(scope.createNode).to.be.instanceOf(Function);
            });

            it('should expose updateNode() method to scope', function () {
                expect(scope.updateNode).to.exist();
                expect(scope.updateNode).to.be.instanceOf(Function);
            });
            
        });

        describe('createNode() method', function () {
            var mockedForm = {
                $invalid: false
            };

            beforeEach(function () {
                sinon.spy(TagService, "createTag");
                sinon.stub(scope, "initializeFormValidation").returns(true);
            });

            it('should call the backend service', function () {
                scope.createNode(mockedForm);
                expect(TagService.createTag).to.have.been.calledWith(scope.addNode);
            });
        });
    });
});