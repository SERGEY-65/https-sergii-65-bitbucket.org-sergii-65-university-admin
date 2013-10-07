angular.module('UserAdminApp').controller('MainCtrl', [ 
	'$scope', '$location', 'RestNetwork', 'CookieStorage',
	function ($scope, $location, RestNetwork, CookieStorage) {


	'use strict'; 


	/*
	 * Get the currently logged in User ID from the server-set cookie
	 * TODO: Institute fallback in case this value is not present
	 */
	var userEmail = CookieStorage.get('__ATL_USER');

    // ===============================================================================
    // SCOPE VALUES
    // ===============================================================================

    /*
     * Get networks associated with the current user. Populates the network select menu
     * in the page header. 
     */
	$scope.networks = RestNetwork.query({ user: userEmail });
	$scope.networkIndex = 0;

	/*
	 * Get the currently selected network object (for child scopes)
	 */
	$scope.getNetwork = function () {
		return $scope.networks[parseInt($scope.networkIndex)];
	};

	/*
	 * Leftmost Navigation Menu links
	 */
	$scope.pages = [
		{
			name: 'Domain Access',
			path: '/#/domains',
			selected: true
		},
		{
			name: 'Individual Access',
			path: '/#/individual',
			selected: false
		},
		{
			name: 'Licenses and Courses',
			path: '/#/licenses',
			selected: false
		},
		{
			name: 'Users',
			path: '/#/users',
			selected: false
		}
	];

    // ===============================================================================
    // EVENT LISTENERS
    // ===============================================================================

    /*
     * On Route Changes, loop through the navigation pages, and ensure the page that
     * matches the current url is the one that is selected.
     */
	$scope.$on('$routeChangeSuccess', function () {
		var i = $scope.pages.length,
			currentPath = '/#' + $location.path(),
			page;
		while (i) {
			page = $scope.pages[i-1];
			page.selected = (page.path === currentPath);
			i--;
		}
	});

}]);