'use strict';

var host = document.location.host; 
var baseUrl = "../";
if (_.contains([ 'university.atlassian.com' ], host)) {
  baseUrl = "/3.0/";
}

/*
 * Module definition and dependencies
 */
angular.module('UserAdminApp', [ 'ngResource', 'Storage', 'ui.bootstrap'])


/*
 * Configuration & Routing
 */
.config(function ($routeProvider, $httpProvider) {

    $routeProvider
    .when('/licenses', {
        templateUrl: baseUrl + 'docroot/uac-admin/app/views/licenses.html',
        controller: 'LicenseCtrl'
    })
    .when('/users', {
        templateUrl: baseUrl + 'docroot/uac-admin/app/views/users.html',
        controller: 'UserCtrl'
    })
    .when('/individual', {
        templateUrl: baseUrl + 'docroot/uac-admin/app/views/individual.html',
        controller: 'IndividualCtrl'
    })
    .when('/domains', {
        templateUrl: baseUrl + 'docroot/uac-admin/app/views/domains.html',
        controller: 'DomainCtrl'
    })
    .when('/reporting', {
        templateUrl: baseUrl + 'docroot/uac-admin/app/views/reporting.html',
        controller: 'ReportCtrl'
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
