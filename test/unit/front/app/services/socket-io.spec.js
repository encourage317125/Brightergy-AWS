describe('SERVICE - bl.analyze.solar.surface.SocketIO', function () {
  var SocketIO,
      mySocket,
      rootScope,
      scope;

  beforeEach(module('bl.analyze.solar.surface'));

  beforeEach(function () {
    module(function ($provide) {
      $provide.value('socketFactory', window.socketFactory);
    });
  });

  beforeEach(inject(function($injector) {

    rootScope = $injector.get('$rootScope');
    scope = rootScope.$new();
    SocketIO = $injector.get('SocketIO');
    mySocket = SocketIO._mySocket;
    sinon.spy(mySocket, 'on');
    sinon.spy(mySocket, 'emit');
  }));

  it('should be defined', inject(function(SocketIO) {
    expect(SocketIO).to.exist;
  }));

  describe('#watch method', function () {
    it('should invoke on method of socketFactory', function () {
      SocketIO.watch('assurf:sources', function () {});
      expect(SocketIO.processLoadingImageByResponse).to.have.been.call;
      expect(scope.$broadcast).to.have.been.call;
      expect(mySocket.on).to.have.been.called;
    });
  });
  describe('#emit method', function () {
    it('should invoke emit method of socketFactory', function () {
      SocketIO.emit('assurf:getpower', {});
      expect(SocketIO.resetMainStageResponseListArray).to.have.been.call;
      expect(scope.$broadcast).to.have.been.call;
      expect(mySocket.emit).to.have.been.called;
    });
  });
/*
  describe('#resetMainStageResponseListArray method', function () {
    it('should exist', function () {
      expect(SocketIO.resetMainStageResponseListArray).to.exist();
    });
    it('should reset main stage response list array', function () {
      expect(SocketIO.resetMainStageResponseListArray).to.have.been.called;
    });
  });
*/
});