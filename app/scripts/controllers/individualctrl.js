angular.module('UserAdminApp').controller('IndividualCtrl',
    function ($scope, RestNetworkUser, SessionStorage, Util) {

    // ===============================================================================
    // PRIVATE FUNCTIONS
    // ===============================================================================

    var loadStoredData = function () {
        var storedData;
        if ($scope.network) {
            storedData = SessionStorage.get('network.' + $scope.network.id + '.users');
            if (storedData) {
                $scope.individuals = storedData;
                paginate();
            }
        }
    };

    var loadNetworkData = function () {
        if ($scope.network) {
            RestNetworkUser.query({ network: $scope.network.id }, function (users) {
                $scope.individuals = users;
                SessionStorage.add('network.' + $scope.network.id + '.users', users);
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
    loadStoredData();

    $scope.remove = function (individual) {
        individual.$delete({ user: individual.id_user, network: individual.id_network });
        $scope.individuals = _.without($scope.individuals, individual);
        paginate();
    };

    $scope.add = function () {
        var individual = new RestNetworkUser({
            id_network: $scope.network.id,
            id_user: $scope.entry,
            roll: 'invited',
            selectedp: false
        });
        individual.$save();
        $scope.individuals.push(individual);
        paginate();
    };

});