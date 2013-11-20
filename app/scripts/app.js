'use strict';


/*
 * Module definition and dependencies
 */
angular.module('UserAdminApp', [ 'ngResource', 'Storage' ])


/*
 * Configuration & Routing
 */
.config(function ($routeProvider) {


    $routeProvider
    .when('/domains', {
        templateUrl: '../docroot/uac-admin/app/views/domains.html',
        controller: 'DomainCtrl'
    })
    .when('/individual', {
        templateUrl: '../docroot/uac-admin/app/views/individual.html',
        controller: 'IndividualCtrl'
    })
    .when('/licenses', {
        templateUrl: '../docroot/uac-admin/app/views/licenses.html',
        controller: 'LicenseCtrl'
    })
    .when('/users', {
        templateUrl: '../docroot/uac-admin/app/views/users.html',
        controller: 'UserCtrl'
    })
    .otherwise({
        redirectTo: '/domains'
    });

    // $locationProvider.html5Mode(true);

})


/*
 * Bootstrap
 */
.run(function () {



});
