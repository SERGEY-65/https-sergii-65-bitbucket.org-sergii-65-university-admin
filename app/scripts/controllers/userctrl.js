angular.module('UserAdminApp').controller('UserCtrl',
    function ($scope, RestNetworkUser, Util, SessionStorage, $location, filterFilter) {

    // ===============================================================================
    // PRIVATE FUNCTIONS
    // ===============================================================================



    var loadNetworkData = function () {
        if ($scope.network) {
            RestNetworkUser.query({ network: $scope.network.id }, function (users) {

                $scope.users = users;
                $scope.networkUsers = _.where($scope.users, {selectedp: true});
                $scope.totalItems = $scope.networkUsers.length;

                SessionStorage.add('network.' + $scope.network.id + '.users', $scope.networkUsers);
                paginate();
            });
        }
    };

    var paginate = function (page) {
        if (!page) {
            page = 1;
        }

        if ($scope.paginateFiltered) {
            var records = $scope.filtered;
            $scope.totalItems = $scope.filtered.length;            
        } else {
            var records = $scope.networkUsers;
        };
        

        $scope.pagination = Util.paginate({
            items: records,
            max_items_per_page: $scope.itemsPerPage,
            current_page: page
        });

    };        
        
    $scope.changedPage = function(page) {            
        paginate(page);
    }



    $scope.$watch('entry', function(term) {  
        $scope.filtered = filterFilter($scope.networkUsers, term);
        if (term !== undefined) {
            $scope.paginateFiltered = true;
        }
        paginate(1);
    });

    // ===============================================================================
    // SCOPE VALUES
    // ===============================================================================

    $scope.reverse = false;
    $scope.orderField = 'id_user';
    $scope.users = [];
    $scope.networkUsers = [];
    $scope.itemsPerPage = 10;
    $scope.currentPage = 1;
    $scope.maxSize = 5;
    $scope.paginateFiltered = false;

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
        for (var i in $scope.users) {
            if ($scope.users[i].id_user == $scope.entry) {
                return true;
            }
        }
        return false;
    }
//send email to the person that was added - UNI-372
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

    $scope.changeMaxItems = function(num) {
        $scope.itemsPerPage = num;
        paginate();
    }

})
.directive('itemsToShow', function() {
    return {
      restrict: 'E',
      scope: {
        numItems: '=max-items'
      },
      template: 'Items = {{scope.numItems}}'


    };
})
.directive('thing', function ($log) {
    // allowed event listeners
    return {
        restrict: 'E',
        template:   '{{maxItems}}',
        scope: {
            maxItems: '@maxItems'
        }
    };
});










