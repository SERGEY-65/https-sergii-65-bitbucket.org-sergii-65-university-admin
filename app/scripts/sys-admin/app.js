'use strict';

var host = document.location.host; 
var baseUrl = "../";
if (_.contains([ 'university.atlassian.com' ], host)) {
  baseUrl = "/3.0/";
}

/*
 * Module definition and dependencies
 */
angular.module('SysAdminApp', [ 'ngResource', 'Storage'])


/*
 * Configuration & Routing
 */
.config(function ($routeProvider, $httpProvider) {

    $routeProvider
    .when('/stats', {
        templateUrl: baseUrl + 'docroot/uac-admin/app/views/sys-admin/stats.html',
        controller: 'StatsCtrl'
    })
//    .when('/migrate', {
//        templateUrl: baseUrl + 'docroot/uac-admin/app/views/sys-admin/migrate.html',
//        controller: 'MigrateCtrl'
//    })
    .otherwise({
        redirectTo: '/stats'
    });

    // $locationProvider.html5Mode(true);

})


/*
 * Bootstrap
 */
.run(function () {



});
