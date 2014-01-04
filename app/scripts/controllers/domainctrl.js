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

    $scope.remove = function (domain) {
        var r=confirm("Are you sure?");
        if (r==true)
        {
            domain.$delete({ network: $scope.network.id, id: domain.id_domain });
            $scope.domains = _.without($scope.domains, domain);
            paginate();
        }
    };

    $scope.exists = function() {
        for (var i in $scope.domains) {
            if ($scope.domains[i].id_domain == $scope.entry) {
                return true;
            }
        }
        return false;
    }


    $scope.add = function () {
        var domain = new RestDomain({
            id_network: $scope.network.id,
            id_domain: $scope.entry
        });

        for (var i in $scope.domains) {
            if ($scope.domains[i].id_domain == $scope.entry) {
                return false;
            }
        }

        $scope.entry="";
        domain.$save();
        $scope.domains.push(domain);
        paginate();
    };

});