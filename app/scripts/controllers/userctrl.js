angular.module('UserAdminApp').controller('UserCtrl', function ($scope, RestNetworkUser, Util, SessionStorage) {

    // ===============================================================================
    // PRIVATE FUNCTIONS
    // ===============================================================================

    var loadStoredData = function () {
        var storedData;
        if ($scope.network) {
            storedData = SessionStorage.get('network.' + $scope.network.id + '.users');
            if (storedData) {
                $scope.users = storedData;
                paginate();
            }
        }
    };

    var loadNetworkData = function () {
        if ($scope.network) {
            RestNetworkUser.query({ network: $scope.network.id }, function (users) {
                $scope.users = users;
                SessionStorage.add('network.' + $scope.network.id + '.users', users);
                paginate();
            });
        }
    };

    var paginate = function () {
        $scope.pagination = Util.paginate({
            items: $scope.users
        });
    };

    // ===============================================================================
    // SCOPE VALUES
    // ===============================================================================

    $scope.reverse = false;
    $scope.orderField = 'email';
    $scope.users = [];

    $scope.$on('$NetworkUpdate', loadNetworkData);
    loadNetworkData();




});