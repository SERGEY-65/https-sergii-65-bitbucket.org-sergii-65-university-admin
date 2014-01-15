angular.module('SysAdminApp').controller('MainCtrl',
	function ($scope, $location, $q, $timeout, RestCurrentUser, CookieStorage) {


	/*
	 * Get the currently logged in User ID from the server-set cookie
	 * TODO: Institute fallback in case this value is not present
	 */
	var userEmail = "";
	RestCurrentUser.get({}, function (data) {
		console.log(data);
		userEmail = data.userid;
		$scope.currUser = userEmail;
		$scope.$broadcast("$userIdRetrieved");
	});

    // ===============================================================================
    // SCOPE VALUES
    // ===============================================================================

    /*
     * Get networks associated with the current user. Populates the network select menu
     * in the page header.
     */
	$scope.networks = [];
	$scope.$on('$userIdRetrieved', function() {

	});


	/*
	 * Leftmost Navigation Menu links
	 */
	$scope.pages = [
		{
			name: 'Database Stats',
			path: '#/stats',
			selected: true
//		},
//		{
//			name: 'Migrate Company',
//			path: '#/migrate',
//			selected: false
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
			currentPath = '#' + $location.path(),
			page;
		while (i) {
			page = $scope.pages[i-1];
			page.selected = (page.path === currentPath);
			i--;
		}
	});

});