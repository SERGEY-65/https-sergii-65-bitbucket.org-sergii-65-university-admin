angular.module('UserAdminApp').controller('LicenseCtrl',
    function ($scope, RestNetworkSens) {

    // ===============================================================================
    // PRIVATE FUNCTIONS
    // ===============================================================================

    var loadNetworkData = function () {
        if ($scope.network) {
            RestNetworkSens.query({ network: $scope.network.id }, function (sens) {
                // SessionStorage.add('network.' + $scope.network.id + '.users', users);
                _.each(sens, function (sen) {
                    var product = findProduct(sen.name_product);
                        product.sen = sen;
                        product.purchased = true;
                });
                console.log($scope);
            });
        }
    };

    var findProduct = function (key) {
        for (var i in $scope.licenses) {
            if ($scope.licenses.hasOwnProperty(i)) {
                if (_.contains($scope.licenses[i].productKeys, key)) {
                    return $scope.licenses[i];
                }
            }
        }
        return null;
    };



    // ===============================================================================
    // SCOPE VALUES
    // ===============================================================================

    $scope.licenses = {
        jira: {
            id: 0,
            productName: 'JIRA',
            productKeys: [ '-university-course-library-jira' ],
            purchased: false,
            sen: null,
            courses: []
        },
        jiraAgile: {
            id: 1,
            productName: 'JIRA Agile <small>(formerly Greenhopper)</small>',
            productKeys: [ '-university-course-library-greenhopper' ],
            purchased: false,
            sen: null,
            courses: []
        },
        confluence: {
            id: 2,
            productName: 'Confluence',
            productKeys: [ '-university-course-library-confluence' ],
            purchased: false,
            sen: null,
            courses: []
        }
    };

    $scope.$on('$NetworkUpdate', loadNetworkData);
    loadNetworkData();

});