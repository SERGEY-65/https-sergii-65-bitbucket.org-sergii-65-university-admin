/*
 * Module definition and dependencies
 */
angular.module('UserAdminApp', [ 'ngResource', 'Storage' ])


/*
 * Configuration & Routing
 */
.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    $routeProvider
        .when('/domains', {
            templateUrl: 'views/domains.html',
            controller: 'DomainCtrl'
        })
        .when('/individual', {
            templateUrl: 'views/individual.html',
            controller: 'IndividualCtrl'
        })
        .when('/licenses', {
            templateUrl: 'views/licenses.html',
            controller: 'LicenseCtrl'
        })
        .when('/users', {
            templateUrl: 'views/users.html',
            controller: 'UserCtrl'
        })                        
        .otherwise({
            redirectTo: '/domains'
        });

    // $locationProvider.html5Mode(true);

}])


/*
 * Bootstrap
 */
.run([ function () {



}]);
