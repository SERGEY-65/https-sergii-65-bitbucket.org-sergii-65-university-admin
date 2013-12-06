angular.module('UserAdminApp').controller('MainCtrl',
	function ($scope, $location, $q, $timeout, RestAdminNetworks, RestNetwork, RestCurrentUser, CookieStorage) {


	/*
	 * Get the currently logged in User ID from the server-set cookie
	 * TODO: Institute fallback in case this value is not present
	 */
	var userEmail = "";
	// RestCurrentUser.get({}, function (data) {
	// 	console.log(data);
	// 	// userEmail = data.userid;
	// 	userEmail = "ekent@atlassian.com";
	// 	$scope.$broadcast("$userIdRetrieved");
	// });



    // ===============================================================================
    // SCOPE VALUES
    // ===============================================================================

    /*
     * Get networks associated with the current user. Populates the network select menu
     * in the page header.
     */
	$scope.networks = [];
	$scope.$on('$userIdRetrieved', function() {		
		RestAdminNetworks.query({ user: userEmail }, function (networks) {

			// Hacky promise workaround until official Angular1.2 upgrade of
			// $resource is released to return promises
			var promiseWrapper = function (network) {
				var deferred = $q.defer();
				RestNetwork.get({ id: network.id_network }, function (data) {
					deferred.resolve(data);
				});
				return deferred.promise;
			};

			var promises = _.map(networks, function (network) {
				return promiseWrapper(network);
			});

			$q.all(promises).then(function (list) {
				$scope.networks = list;
				$scope.network = $scope.networks[0];
				$scope.$broadcast('$NetworkUpdate');
			});
		});
	});


    $scope.changeFriendlyName = function(network) {
        console.log(network);
        network.$save();
        console.log(network);
    }


	$scope.updateNetwork = function () {
		$scope.$broadcast('$NetworkUpdate');
	}

	/*
	 * Leftmost Navigation Menu links
	 */
	$scope.pages = [
		{
			name: 'Licenses and Courses',
			path: '#/licenses',
			selected: true
//		},
//		{
//			name: 'Domain Access',
//			path: '#/domains',
//			selected: true
//		},
//		{
//			name: 'Individual Access',
//			path: '#/individual',
//			selected: false
//		},
//		{
//			name: 'Users',
//			path: '#/users',
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
		userEmail = "ekent@atlassian.com";
		$scope.$broadcast("$userIdRetrieved");
});

