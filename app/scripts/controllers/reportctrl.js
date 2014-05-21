angular.module('UserAdminApp').controller('ReportCtrl',
    function ($scope, RestNetworkUser, RestNetworkUserCompletedLessons, Util, SessionStorage, filterFilter) {

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
    $scope.everythingLoaded = false;
    AJS.$(".large-spinner").spin(('large'));

    var loadNetworkData = function () {
        if ($scope.network) {
            RestNetworkUser.query({ network: $scope.network.id }, function (users) {
                RestNetworkUserCompletedLessons.query(
                    { network: $scope.network.id }, 
                    function (userLessons) {
                        $scope.networksLessons = userLessons;
                        $scope.$broadcast("$NetworksLessonsUpdate");
                    }
                );

                $scope.users = users;
                $scope.totalItems = $scope.users.length;

                SessionStorage.add('network.' + $scope.network.id + '.users', $scope.users);
                paginate();
            });
        }
    };

    var loadUserLessons = function() {
        _.each($scope.users, function (user) {
            if (!user.selectedp) {
                user.progress = [];
            } else {
                user.progress = _.where($scope.networksLessons, {id_user: user.id_user}); //loadUserLessons($scope.network.id, user.id_user);
            }
        });
        $scope.everythingLoaded = true;
    }

//    var loadUserLessons = function(network, userID) {
//	    console.log("$scope.network.id: " + network);
//
//        var promise = RestNetworkUserCompletedLessons.query(
//            { network: network }, 
//            function (userLessons) {
//                console.log("$userid: " + userID);
//                return _.where(userLessons, {id_user: userID});
//                //return userLessons;
//            }
//        );
//        return promise;
//    };

    var paginate = function (page) {
        if (!page) {
            page = 1;
        }

        if ($scope.paginateFiltered) {
            var records = $scope.filtered;
            $scope.totalItems = $scope.filtered.length;            
        } else {
            var records = $scope.users;
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
        $scope.filtered = filterFilter($scope.users, term);
        if (term !== undefined) {
            $scope.paginateFiltered = true;
        }
        paginate(1);
    });

    // ===============================================================================
    // SCOPE VALUES
    // ===============================================================================

    $scope.reverse = true;
    $scope.orderField = 'progress.length';
    $scope.users = [];
    $scope.networksLessons = [];
    $scope.everythingLoaded = false;

    $scope.itemsPerPage = 10;
    $scope.currentPage = 1;
    $scope.maxSize = 5;
    $scope.paginateFiltered = false;


    $scope.$on('$NetworkUpdate', loadNetworkData);
    $scope.$on('$NetworksLessonsUpdate', loadUserLessons);
    loadNetworkData();

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