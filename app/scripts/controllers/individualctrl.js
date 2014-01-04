angular.module('UserAdminApp').controller('IndividualCtrl',
    function ($scope, RestNetworkUser, SessionStorage, Util) {

    // ===============================================================================
    // PRIVATE FUNCTIONS
    // ===============================================================================

    //var loadStoredData = function () {
    //    var storedData;
    //    if ($scope.network) {
    //       storedData = SessionStorage.get('network.' + $scope.network.id + '.invitedusers');
    //        if (storedData) {
    //            $scope.individuals = storedData;
    //            paginate();
    //        }
    //    }
    //};
    var loadNetworkData = function () {
        if ($scope.network) {
            RestNetworkUser.query({ network: $scope.network.id }, function (users) {
                $scope.individuals = users.filter(function (user) {
                  if(false == user.selectedp) {
                    return true
                  } else {
                    return false;
                  }
                });;
                //SessionStorage.add('network.' + $scope.network.id + '.invitedusers', $scope.individuals);
                paginate();
            });
        }
    };

    var paginate = function () {
        $scope.pagination = Util.paginate({
            items: $scope.individuals
        });
    };

    // ===============================================================================
    // SCOPE VALUES
    // ===============================================================================

    $scope.entry = '';
    $scope.reverse = false;
    $scope.individuals = [];

    $scope.$on('$NetworkUpdate', loadNetworkData);
    loadNetworkData();

    $scope.remove = function (individual) {
        var r=confirm("Are you sure?");
        if (r==true)
        {
            individual.$delete({ user: individual.id_user, network: individual.id_network });
            $scope.individuals = _.without($scope.individuals, individual);
            paginate();
        }  
    };

    $scope.exists = function() {
        for (var i in $scope.individuals) {
            if ($scope.individuals[i].id_user == $scope.entry) {
                return true;
            }
        }
        return false;
    }


    $scope.add = function () {
        var individual = new RestNetworkUser({
            id_network: $scope.network.id,
            id_user: $scope.entry,
            role: 'user',
            selectedp: false
        });

        for (var i in $scope.individuals) {
            if ($scope.individuals[i].id_user == $scope.entry) {
                return false;
            }
        }

        individual.$save();
        $scope.entry = "";
        $scope.individuals.push(individual);
        paginate();
    };

});