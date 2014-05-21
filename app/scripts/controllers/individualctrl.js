angular.module('UserAdminApp').controller('IndividualCtrl',
    function ($scope, RestNetworkUser, SessionStorage, Util, filterFilter) {

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
                $scope.totalItems = $scope.individuals.length;
                //SessionStorage.add('network.' + $scope.network.id + '.invitedusers', $scope.individuals);
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
            var records = $scope.individuals;
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
        $scope.filtered = filterFilter($scope.individuals, term);
        if (term !== "") {
            $scope.paginateFiltered = true;
        }
        paginate(1);
    });    

    // ===============================================================================
    // SCOPE VALUES
    // ===============================================================================

    $scope.entry = '';
    $scope.reverse = false;
    $scope.individuals = [];

    $scope.itemsPerPage = 10;
    $scope.currentPage = 1;
    $scope.maxSize = 5;
    $scope.paginateFiltered = false;


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

//send email to the person that was added - UNI-372
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