'use strict';

var host = document.location.host; 
var baseUrl = "../";
if (_.contains([ 'university.atlassian.com' ], host)) {
  baseUrl = "/3.0/";
}

/*
 * Module definition and dependencies
 */
 angular.module('UserAdminApp', [ 'ngResource', 'Storage' ])


/*
 * Configuration & Routing
 */
 .config(function ($routeProvider, $httpProvider) {

  $routeProvider
  .when('/domains', {
   templateUrl: baseUrl + '/views/domains.html',
   controller: 'DomainCtrl'
 })
  .when('/individual', {
   templateUrl: baseUrl + '/views/individual.html',
   controller: 'IndividualCtrl'
 })
  .when('/licenses', {
    templateUrl: baseUrl + '/views/licenses.html',
    controller: 'LicenseCtrl'
  })
  .when('/users', {
   templateUrl: baseUrl + '/views/users.html',
   controller: 'UserCtrl'
 })
  .when('/visual', {
    templateUrl: baseUrl + '/views/visual.html',
    controller: 'VisualCtrl'
  })
  .otherwise({
    redirectTo: '/licenses'
  });

    // $locationProvider.html5Mode(true);

  })

// ***
// For inline edit control seen on networks page
// ***

// On esc event
.directive('onEsc', function() {
  return function(scope, elm, attr) {
    elm.bind('keydown', function(e) {
      if (e.keyCode === 27) {
        scope.$apply(attr.onEsc);
      }
    });
  };
})

// On enter event
.directive('onEnter', function() {
  return function(scope, elm, attr) {
    elm.bind('keypress', function(e) {
      if (e.keyCode === 13) {
        scope.$apply(attr.onEnter);
      }
    });
  };
})

// Inline edit directive
.directive('inlineEdit', function($timeout) {
  return {
    scope: {
      model: '=inlineEdit',
      handleSave: '&onSave',
      handleCancel: '&onCancel'
    },
    link: function(scope, elm, attr) {
      var previousValue;
      
      scope.edit = function() {
        scope.editMode = true;
        previousValue = scope.model;
        
        $timeout(function() {
          elm.find('input')[0].focus();
        }, 0, false);
      };
      scope.save = function() {
        scope.editMode = false;
        scope.handleSave({value: scope.model});
      };
      scope.cancel = function() {
        scope.editMode = false;
        scope.model = previousValue;
        scope.handleCancel({value: scope.model});
      };
    }
  };
})

// ***
// End inline edit control specific code.
// ***



/*
 * Bootstrap
 */
 .run(function () {



 });
