'use strict';

describe('Controller: MainCtrl', function() {

  // ===============================================================================
  // MOCKS
  // ===============================================================================

  beforeEach(module('UserAdminApp'));

  var MainCtrl, $scope, $location, RestNetwork;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $injector) {
    $scope = $injector.get('$rootScope');
    $location = $injector.get('$location');


    RestNetwork = {
      query: function () {
        return [1,2,3];
      }
    };

    spyOn(RestNetwork, 'query').andCallThrough();

    MainCtrl = $controller('MainCtrl', {
      $scope: $scope,
      $location: $location,
      RestNetwork: RestNetwork,
      CookieStorage: {
        get: function () {
          return 'foo@bar.com';
        },
        add: function () {}
      }
    });
  }));

  // ===============================================================================
  // TESTS
  // ===============================================================================

  it('Networks should have 3 items', function() {
    expect($scope.networks.length).toBe(3);
  });

  it('There should be 4 pages', function () {
    expect($scope.pages.length).toBe(4);
  });

  it('The first page should be domains, and should be selected', function () {
    expect($scope.pages[0].name).toBe('Allowed Domains');
    expect($scope.pages[1].name).toBe('Individual Access');
    expect($scope.pages[0].selected).toBeTruthy();
  });

  it ('Should change the selected page when routeChange events are fired', function () {
    expect($scope.pages[0].selected).toBeTruthy();
    $location.path('/individual');
    $scope.$emit('$routeChangeSuccess');
    expect($scope.pages[0].selected).toBeFalsy();
    expect($scope.pages[1].selected).toBeTruthy();
  });

  it ('Should request networks associated with the user read from the cookie', function () {
    expect(RestNetwork.query).toHaveBeenCalledWith({ user: 'foo@bar.com' });
  });

});
