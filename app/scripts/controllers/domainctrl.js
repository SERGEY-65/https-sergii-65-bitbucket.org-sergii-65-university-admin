angular.module('UserAdminApp').controller('DomainCtrl',
	function ($scope, RestDomain, Util, filterFilter) {

    // ===============================================================================
    // PRIVATE FUNCTIONS
    // ===============================================================================

    var loadNetworkData = function () {
        if ($scope.network) {
			RestDomain.query({ network: $scope.network.id }, function (domains) {
				$scope.domains = domains;
                $scope.totalItems = $scope.domains.length;
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
            var records = $scope.domains;
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
        $scope.filtered = filterFilter($scope.domains, term);
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
    $scope.domains = [];
    $scope.forbiddenDomains = ['altavista.com', 'altavista.se', 'angelfire.com', 'aol.com', 'gmail.com', 'hotmail.co.il', 'hotmail.com', 'hotmail.fr', 'hotmail.kg', 'hotmail.kz', 'hotmail.ru', 'icloud.com', 'netscape.net', 'outlook.com', 'yahoo.ca', 'yahoo.co.in', 'yahoo.co.jp', 'yahoo.co.kr', 'yahoo.co.nz', 'yahoo.co.uk', 'yahoo.com', 'yahoo.com.ar', 'yahoo.com.au', 'yahoo.com.br', 'yahoo.com.cn', 'yahoo.com.hk', 'yahoo.com.is', 'yahoo.com.mx', 'yahoo.com.ru', 'yahoo.com.sg', 'yahoo.de', 'yahoo.dk', 'yahoo.es', 'yahoo.fr', 'yahoo.ie', 'yahoo.it', 'yahoo.jp', 'yahoo.ru', 'yahoo.se', 'outlook.com', 'mail.com'];

    $scope.itemsPerPage = 10;
    $scope.currentPage = 1;
    $scope.maxSize = 5;
    $scope.paginateFiltered = false;

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
        for (var i in $scope.forbiddenDomains) {
            if ($scope.forbiddenDomains[i] == $scope.entry) {
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