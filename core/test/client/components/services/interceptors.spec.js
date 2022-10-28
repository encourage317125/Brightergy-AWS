describe('blApp.components.services.interceptors', function () {

    var httpProvider,
        httpRequestInterceptor,
        httpResponseInterceptor;

    beforeEach(module('blApp.components.services'));

    beforeEach(function () {
        module('blApp.components.services', function ($httpProvider) {
            httpProvider = $httpProvider;
        });

        inject(function ($injector) {
            httpBackend = $injector.get('$httpBackend');
        });
    });

    describe('#httpRequestInterceptor', function () {

        beforeEach(inject(function ($injector) {
            httpRequestInterceptor = $injector.get('httpRequestInterceptor');
        }));

        var configAPI = configuration('api'),
            originalUrl = '/tags',
            newUrl = configAPI.host + '/' + configAPI.version + originalUrl;

        it('should be defined', function () {
            expect(httpRequestInterceptor).to.exist();
            expect(httpProvider.interceptors).to.contain('httpRequestInterceptor');
        });

        it('should properly append api entry point for backend api request', function () {
            var config  = httpRequestInterceptor.request({url: originalUrl});
            expect(config.url).to.be.equal(newUrl);
        });

        it('should append withCredentials=true to request config for backend api request', function () {
            var config  = httpRequestInterceptor.request({url: originalUrl});
            expect(config.withCredentials).to.be.equal(true);
        });

        it('should return original url for asset request', function () {
            var config  = httpRequestInterceptor.request({url: '/assets/css/general.min.css'});
            expect(config.url).to.be.equal('/assets/css/general.min.css');
        });
    });

    describe('#httpResponseInterceptor', function () {
        beforeEach(inject(function ($injector) {
            httpResponseInterceptor = $injector.get('httpResponseInterceptor');
        }));

        it('should be defined', function () {
            expect(httpResponseInterceptor).to.exist();
            expect(httpProvider.interceptors).to.contain('httpResponseInterceptor');
            expect(httpResponseInterceptor.response).to.exist();
        });
    });
});