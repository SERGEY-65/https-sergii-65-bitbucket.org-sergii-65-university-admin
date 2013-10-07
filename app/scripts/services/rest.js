/*
 * $resource RESTful setup and configuration 
 * http://docs.angularjs.org/api/ngResource.$resource
 */
angular.module('UserAdminApp')


/*
 * Base domain url for all RESTful resources. Is aware of the environment
 * it is running in, and will return the appropriate base url for that env
 */
.factory('RestBaseUrl', [ '$location', 
	function ($location) {

	var host = $location.host(),
		base_url = 'production url here';

	if (host === 'university.atlassian.net') {
		base_url = 'http://university.atlassian.net/api';
	}

	return base_url;
}])


/*
 * NETWORKS FOR LOGGED IN USER
 * pass in user email - from __ATL_USER cookie
 */
.factory('RestNetwork', [ '$resource', 'RestBaseUrl',
	function ($resource, RestBaseUrl) {

	return $resource(
		RestBaseUrl + '/networks-users/:user',
		{
			user: '@user'
		}
	);
}])


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
 * DOMAINS
 * 
 * GET all 
 * var allDomains = Domain.query({ network: 'macnet' });
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
.factory('RestDomain', [ '$resource', 'RestBaseUrl',
	function ($resource, RestBaseUrl) {

	return $resource(
		RestBaseUrl + '/:network/domains/:id/:action',
		{
			id: '@id',
			network: '@network',
			action: '@action'
		}
	);
}])


/*
 * INDIVIDUALS
 */
.factory('RestIndividual', [ '$resource', 'RestBaseUrl',
	function ($resource, RestBaseUrl) {

	return $resource(
		RestBaseUrl + '/:network/individual/:id/:action',
		{
			id: '@id',
			network: '@network',
			action: '@action'
		}
	);
}])


/*
 * NETWORK USERS
 */
.factory('RestUser', [ '$resource', 'RestBaseUrl',
	function ($resource, RestBaseUrl) {

	return $resource(
		RestBaseUrl + '/networks-users/:network/:user',
		{
			user: '@user',
			network: '@network'
		}
	);
}])


/*
 * LICENSES
 */
.factory('RestLicense', [ '$resource', 'RestBaseUrl',
	function ($resource, RestBaseUrl) {

	return $resource(
		RestBaseUrl + '/network-sens/:network/',
		{
			network: '@network'
		}
	);
}])


/*
 * COURSES
 */
.factory('RestCourses', [ '$resource', 'RestBaseUrl',
	function ($resource, RestBaseUrl) {

	return $resource(
		RestBaseUrl + '/product-courses/:product',
		{
			product: '@product'
		}
	);
}]);