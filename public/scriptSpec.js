describe('---Testing controllers in MEAN-CRUD-REST application---', function() {
  // Instantiate a new version of my module before each test
  beforeEach(module('meanRestApp'));

  var myctrl;
  var backendMock;
  var anArray = [
                {tech: 'Java', description: 'Oracle Sun Language'},
                {tech: 'JavaScript', description: 'ECMAScript5'}
                ];

  // Before each unit test, instantiate a new instance
  // of the controller
  beforeEach(inject(function($controller, $httpBackend) {
    backendMock = $httpBackend;
    backendMock.expectGET('/api/tech').respond(anArray);

    myctrl = $controller('consoleController');
  }));

  
  it('---testing readAll through $httpBackend---- ', function() {
    expect(myctrl.techRecords.length).toEqual(0);
    backendMock.flush();
    expect(myctrl.techRecords.length).toEqual(2);
    expect(myctrl.techRecords[0].tech).toEqual('Java');
    //expect(myctrl.message).toEqual(true);
  }); //it 

  afterEach(function() {
    // Ensure that all expects set on the $httpBackend
    // were actually called
    backendMock.verifyNoOutstandingExpectation();

    // Ensure that all requests to the server
    // have actually responded (using flush())
    backendMock.verifyNoOutstandingRequest();
  });

});
