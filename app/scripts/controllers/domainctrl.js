angular.module('UserAdminApp').controller('DomainCtrl',
	function ($scope, RestDomain, Util) {

    // ===============================================================================
    // PRIVATE FUNCTIONS
    // ===============================================================================

    var loadNetworkData = function () {
        if ($scope.network) {
			RestDomain.query({ network: $scope.network.id }, function (domains) {
				$scope.domains = domains;
				paginate();
			});
        }
    };

    var paginate = function () {
        $scope.pagination = Util.paginate({
            items: $scope.domains
        });
    };

    // ===============================================================================
    // SCOPE VALUES
    // ===============================================================================

	$scope.entry = '';
    $scope.reverse = false;
    $scope.domains = [];


    $scope.$on('$NetworkUpdate', loadNetworkData);
    loadNetworkData();

    $scope.remove = function (domains) {
        domains.$delete({ user: domains.id_user, network: domains.id_network });
        $scope.domains = _.without($scope.domains, domains);
        paginate();
    };

    $scope.add = function () {
        var domain = new RestDomain({
            id_network: $scope.network.id
        });
        domain.$save();
        $scope.domains.push(domain);
        paginate();
    };

});