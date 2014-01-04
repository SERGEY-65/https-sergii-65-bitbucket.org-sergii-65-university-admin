angular.module('UserAdminApp').controller('UserCtrl',
    function ($scope, RestNetworkUser, Util, SessionStorage) {

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
                    //if (!user.selectedp) {
                    //    user.activityDate = "Never";
                    //} else {
                    //    user.activityDate = "";
                    //}
                });
                $scope.users = users;

                SessionStorage.add('network.' + $scope.network.id + '.users', $scope.users);
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
    $scope.orderField = 'id_user';
    $scope.users = [];

    $scope.$on('$NetworkUpdate', loadNetworkData);
    loadNetworkData();


    $scope.updateRole = function (user) {
        if (user.id_user == $scope.currUser) {
            alert("You cannot change your own user type.");
            user.role = "admin";
        } else {
            user.$update();
            paginate();
        }
    };

    $scope.remove = function (user) {
        if (user.id_user == $scope.currUser) {
            alert("You cannot remove yourself.");
        } else {
            var r=confirm("Are you sure?");
            if (r==true)
            {
                user.$delete({ user: user.id_user, network: user.id_network });
                $scope.users = _.without($scope.users, user);
                paginate();
            }
        }
    };

    $scope.exists = function() {
        console.log($scope.entry);
        for (var i in $scope.users) {
            if ($scope.users[i].id_user == $scope.entry) {
                return true;
            }
        }
        return false;
    }

    $scope.add = function () {
        var user = new RestNetworkUser({
            id_network: $scope.network.id,
            id_user: $scope.entry,
            role: 'user',
            selectedp: false
        });
        for (var i in $scope.users) {
            if ($scope.users[i].id_user == $scope.entry) {
                return false;
            }
        }

        user.$save();
        $scope.entry = "";
        $scope.users.push(user);
        paginate();
    };




});