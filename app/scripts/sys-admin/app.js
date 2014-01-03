'use strict';

var host = document.location.host; 
var baseUrl = "../";
if (_.contains([ 'university.atlassian.com' ], host)) {
  baseUrl = "/3.0/";
}

/*
 * Module definition and dependencies
 */
angular.module('SysAdminApp', [ 'ngResource', 'Storage' ])


/*
 * Configuration & Routing
 */
.config(function ($routeProvider, $httpProvider) {

    $routeProvider
    .when('/migrate', {
        templateUrl: baseUrl + 'docroot/uac-admin/app/views/sys-admin/migrate.html',
        controller: 'MigrateCtrl'
    })
    .otherwise({
        redirectTo: '/migrate'
    });

    // $locationProvider.html5Mode(true);

})


/*
 * Bootstrap
 */
.run(function () {



});
