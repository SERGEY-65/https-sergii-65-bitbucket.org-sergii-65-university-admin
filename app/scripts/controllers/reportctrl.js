angular.module('UserAdminApp').controller('ReportCtrl',
    function ($scope, RestNetworkUser, RestNetworkUserCompletedLessons, Util, SessionStorage) {

    // ===============================================================================
    // PRIVATE FUNCTIONS
    // ===============================================================================

    //var loadStoredData = function () {
    //    var storedData;
    //    if ($scope.network) {
    //        storedData = SessionStorage.get('network.' + $scope.network.id + '.users');
    //        if (storedData) {
    //            $scope.users = storedData;
    //            paginate();
    //        }
    //    }
    //};

    var loadNetworkData = function () {
        if ($scope.network) {
            RestNetworkUser.query({ network: $scope.network.id }, function (users) {
                _.each(users, function (user) {
                    if (!user.selectedp) {
                        user.progress = [];
                    } else {
                        user.progress = loadUserLessons(user);
                    }
                });
                $scope.users = users;

                SessionStorage.add('network.' + $scope.network.id + '.users', $scope.users);
                paginate();
            });
        }
    };

    var loadUserLessons = function(user) {
        var promise = RestNetworkUserCompletedLessons.query(
            { user: user.id_user }, 
            function (userLessons) {
                return userLessons;
            }
        );
        return promise;
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
    $scope.orderField = 'id_user';
    $scope.users = [];

    $scope.$on('$NetworkUpdate', loadNetworkData);
    loadNetworkData();


});