/*
 * $resource RESTful setup and configuration
 * http://docs.angularjs.org/api/ngResource.$resource
 */
angular.module('UserAdminApp')


/*
 * Base domain url for all RESTful resources. Is aware of the environment
 * it is running in, and will return the appropriate base url for that env
 */
.factory('RestBaseUrl', function ($location) {

	var host = $location.host(),
		//baseUrl = 'http://172.24.253.17:8080/ahccu-server2';
		baseUrl = '/magnoliaAuthor/uac/ahccu/api';
		//baseUrl = 'http://172.28.14.122:8080/ahccu-server';
	if (_.contains([ 'university.atlassian.com', 'localhost' ], host)) {
		//baseUrl = 'http://172.24.253.17:8080/ahccu-server2';
		//baseUrl = 'http://172.28.14.122:8080/ahccu-server';
		baseUrl = '/magnoliaAuthor/uac/ahccu/api';

	}

	return baseUrl;
})


/*
 * NETWORKS FOR LOGGED IN USER
 * pass in user email - from __ATL_USER cookie
 */
.factory('RestAdminNetworks', function ($resource, RestBaseUrl) {

	return $resource(
		RestBaseUrl + '/networks-admins/:user',
		//RestBaseUrl + '/users/:user',
		{
			user: '@user'
		}
	);
})


/*
 * NETWORK DETAILS
 */
.factory('RestNetwork', function ($resource, RestBaseUrl) {

	return $resource(
		RestBaseUrl + '/networks/:id',
		{
			id: '@id'
		}
	);
})


/*
 * ADMIN USERS
 */
// .factory('RestAdmin', [ '$resource', 'RestBaseUrl',
// 	function ($resource, RestBaseUrl) {

// 	return $resource(
// 		RestBaseUrl + '/users/:user',
// 		{
// 			user: '@user'
// 		}
// 	);
// }])


/*
 * DOMAINS BY NETWORK
 */
.factory('RestNetworkDomain', function ($resource, RestBaseUrl) {
	return $resource(
		RestBaseUrl + '/networks-domains-by-network/:network/',
		{
			network: '@network'
		}
	);
})

/*
 * DOMAINS
 *
 * GET all
 * var allDomains = Domain.query({ network: 2 }); // network id
 *
 * POST new
 * var domain = new Domain({ network: 'macnet', id: '123', url: 'foobar' });
 *     domain.$save();
 *
 * GET by ID
 * var domain123 = Domain.query({ network: 'macnet', id: 123 });
 *     domain.url = 'somethingnew';
 *     domain.$save();
 */
.factory('RestDomain', function ($resource, RestBaseUrl) {
	return $resource(
		RestBaseUrl + '/networks-domains/:network/:id/',
		{
			id: '@id',
			network: '@network'
		}
	);
})

/*
 * NETWORK USERS
 */
.factory('RestNetworkUser', function ($resource, RestBaseUrl) {
	return $resource(
		RestBaseUrl + '/networks-users/:network/:user',
		{
			user: '@user',
			network: '@network'
		}
	);
})


/*
 * USER
 */
.factory('RestCurrentUser', function ($resource, RestBaseUrl) {
	return $resource(
		RestBaseUrl + '/user',
		{
		}
	);
})

/*
 * USERS
 */
.factory('RestUser', function ($resource, RestBaseUrl) {
	return $resource(
		RestBaseUrl + '/users/:user',
		{
			user: '@user'
		}
	);
})


/*
 * SENS FOR A GIVEN NETWORK
 */
.factory('RestNetworkSens', function ($resource, RestBaseUrl) {

	return $resource(
		RestBaseUrl + '/network-sens/:network/',
		{
			network: '@network'
		}
	);
})


/*
 * COURSES
 */
.factory('RestCourses', function ($resource, RestBaseUrl) {

	return $resource(
		RestBaseUrl + '/product-courses/:product',
		{
			product: '@product'
		}
	);
});