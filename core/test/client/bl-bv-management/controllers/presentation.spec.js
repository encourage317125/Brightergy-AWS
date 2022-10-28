describe('blApp.management.controllers.PresentationPanelController', function () {

    beforeEach(module('blApp.management.controllers', 'blApp.management.directives', 'blApp.components.services'));

    var scope,
        root,
        ManagementController,
        PresentationService,
        WidgetService,
        ToggleService, 
        ProjectService, 
        NotifyService;

    beforeEach(inject(function ($injector) {
        var rootScope = $injector.get('$rootScope'),
            controller = $injector.get('$controller');

        PresentationService = $injector.get('presentationService');
        WidgetService = $injector.get('widgetService');
        ProjectService = $injector.get('projectService');
        NotifyService = $injector.get('notifyService');

        scope = rootScope.$new();

        controller('PresentationPanelController', {
            $scope: scope,
            $rootScope: rootScope,
            presentationService: PresentationService,
            widgetService: WidgetService,
            projectService: ProjectService,
            notifyService: NotifyService
        });
    }));

    describe('#goPresentation', function () {
        describe('initialization', function () {

            it('should expose goPresentation object to scope', function () {
                expect(scope.goPresentation).to.exist();
            });

            it('should expose goPresentation() method to scope', function () {
                expect(scope.goPresentation).to.exist();
                expect(scope.goPresentation).to.be.instanceOf(Function);
            });
        });
    });

    describe('#savePresentDetail', function () {
        describe('initialization', function () {

            it('should expose savePresentDetail object to scope', function () {
                expect(scope.savePresentDetail).to.exist();
            });

            it('should expose savePresentDetail() method to scope', function () {
                expect(scope.savePresentDetail).to.exist();
                expect(scope.savePresentDetail).to.be.instanceOf(Function);
            });
        });

        describe('savePresentDetail() method', function () {

            var mockedPresentationDetails = {
                IsNewPresentation: false,
                Latitude: null,
                Logo: "https://cdn-core.brighterlink.io/CustomAssets/presentationAssets/NLRtHqbzd/xf2v9Jz6clh-D-GK.png",
                Longitude: null,
                __v: 0,
                _id: "545e61f0649db6140038fc61",
                awsAssetsKeyPrefix: "NLRtHqbzd",
                bpLock: false,
                createdDate: "2014-11-08T18:33:20.000Z",
                creator: "54135f90c6ab7c241e28095e",
                creatorName: "Daniel Keith",
                creatorRole: "BP",
                description: "test",
                duration: "0",
                generatingSinceView: false,
                isTemplate: true,
                lastUpdatedView: true,
                name: "new Presentation",
                parameters: {
                    backgroundColor: "cc6235",
                    endDate: null,
                    fifthColor: {
                        color: null,
                        isVisible: false,
                        label: null
                    },
                    fourthColor: {
                        color: null,
                        isVisible: false,
                        label: null
                    },
                    headerFont: {
                        color: "9c649c",
                        content: null,
                        label: "Header",
                        name: "BentonSans, sans-serif",
                        size: 5,
                        visible: true
                    },
                    normal1Font: {
                        color: null,
                        content: null,
                        label: null,
                        name: "BentonSans, sans-serif",
                        size: null,
                        visible: false
                    },
                    normal2Font: {
                        color: null,
                        content: null,
                        label: null,
                        name: "BentonSans, sans-serif",
                        size: null,
                        visible: false
                    },
                    primaryColor: {
                        color: null,
                        isVisible: true,
                        label: "Title Background Color"
                    },
                    secondaryColor: {
                        color: null,
                        isVisible: false,
                        label: null
                    },
                    seventhColor: {
                        color: null,
                        isVisible: false,
                        label: null
                    },
                    sixthColor: {
                        color: null,
                        isVisible: false,
                        label: null
                    },
                    startDate: "2014-11-08T18:00:00.000Z",
                    subHeaderFont: {
                        color: "db764b",
                        content: null,
                        label: null,
                        name: "BentonSans, sans-serif",
                        size: 1.9,
                        visible: true
                    },
                    tertiaryColor: {
                        color: null,
                        isVisible: false,
                        label: null
                    }
                },
                reimbursementRate: null,
                systemSize: null,
                systemSizeView: true,
                tagBindings: new Array(),
                titleView: false,
                webBox: null
            };

            it('should save presentation details', function () {
                expect(function(){PresentationService.savePresentation(JSON.stringify(mockedPresentationDetails), scope)}).to.not.throw(Error);
            });
        });
    });
});