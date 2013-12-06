angular.module('UserAdminApp').controller('LicenseCtrl',
    function ($scope, RestNetworkSens, RestCourses, RestNetwork, RestNetworkHiddenCourses, RestDeleteNetworkHiddenCourses) {

    // ===============================================================================
    // PRIVATE FUNCTIONS
    // ===============================================================================

    var loadNetworkData = function () {

        if ($scope.network) {
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
                    productName: 'JIRA Agile',
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

            RestNetworkHiddenCourses.query({network:$scope.network.id}, function(data) {
                console.log(data);
                $scope.hiddenVersions = data;
                $scope.$broadcast("$hiddenVersionsRetrieved");
            }); 
        }

    };

    $scope.$on('$hiddenVersionsRetrieved', function() {
        if ($scope.network) {

            RestNetworkSens.query({ network: $scope.network.id }, function (sens) {
                // SessionStorage.add('network.' + $scope.network.id + '.users', users);
                _.each(sens, function (sen) {
                    var product = findProduct(sen.name_product);
                        product.sen = sen;
                        product.purchased = true;
                        product.versions = loadVisibleProducts(sen.name_product);
                });
                console.log($scope);
            });
        }
    });    


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


    var loadVisibleProducts = function (key) {
        if ($scope.network) {
            var promise = RestCourses.query({product:key}, function(data) {
                _.each(data, function (version) {
                    var availableVersion = version
                        availableVersion.visible = isVisible(key, version.name);
                });
                return data;
            });

            return promise;
        }
    };

//    var loadHiddenProductVersions = function (key) {
//        if ($scope.network) {
//            var promise = RestNetworkHiddenCourses.query({network:key}, function(data) {
//                return data;
//            });
//            return promise;
//        }
//    };

    var isVisible = function(productKey, versionKey) {
        for (i=0; i < $scope.hiddenVersions.length; i++){
            if (($scope.hiddenVersions[i].name_product == productKey) && ($scope.hiddenVersions[i].name_course == versionKey)) {
                return false
            }
        }
        return true;
    }



    $scope.hideCourse = function(version) {
        console.log(version);
        if (version.visible) {
            var removeHiddenVersion = new RestDeleteNetworkHiddenCourses({id_network: $scope.network.id,
                                                                name_product:version.name_product,
                                                                name_course:version.name});
            removeHiddenVersion.$delete();
        } else {
            var newHiddenVersion = new RestNetworkHiddenCourses({name_product:version.name_product,
                                                                name_course:version.name,
                                                                id_network: $scope.network.id});
            newHiddenVersion.$save();
        }

        console.log(newHiddenVersion);
    }

    // ***
    // For inline edit control seen on networks page
    // ***
    $scope.cancelEdit = function(value) {
        //console.log('Canceled editing', value);
        //alert('Canceled editing of ' + value);
    };    




    // ===============================================================================
    // SCOPE VALUES
    // ===============================================================================
    $scope.licenses = {}

    $scope.$on('$NetworkUpdate', loadNetworkData);
    loadNetworkData();

});