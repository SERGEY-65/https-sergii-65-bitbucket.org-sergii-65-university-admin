/*
 * $resource RESTful setup and configuration
 * http://docs.angularjs.org/api/ngResource.$resource
 */
angular.module('SysAdminApp')


/*
 * Base domain url for all RESTful resources. Is aware of the environment
 * it is running in, and will return the appropriate base url for that env
 */
.factory('RestBaseUrl', function ($location) {

	var host = $location.host(),
		//baseUrl = 'http://172.24.253.17:8080/ahccu-server-dev';
	baseUrl = '/magnoliaAuthor/uac/ahccu/api';
		//baseUrl = 'http://172.28.14.122:8080/ahccu-server';
	if (_.contains([ 'university.atlassian.com' ], host)) {
		//baseUrl = 'http://172.24.253.17:8080/ahccu-server2';
		//baseUrl = 'http://172.28.14.122:8080/ahccu-server';
		baseUrl = '/2.0/ahccu/api';

	}

	return baseUrl;
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
 * Super Admin Table Stats
 */
.factory('RestTableStats', function ($resource, RestBaseUrl) {
	return $resource(
		RestBaseUrl + '/table-statistics',
		{
		}
	);
});

