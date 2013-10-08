/* global _ */

angular.module('UserAdminApp')

/*
 * Filter array with limit and offset values
 */
.filter('limit', function () {
	return function (ray, limit, offset) {
		if (ray && _.isArray(ray)) {
			var len = ray.length;
			limit = limit || 0;
			offset = offset > len ? len : offset;
			return ray.slice(limit, offset);			
		}
		return [];
	};
});