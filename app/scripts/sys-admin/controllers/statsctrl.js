angular.module('SysAdminApp').controller('StatsCtrl',
    function ($scope, RestTableStats, SessionStorage, Util) {

    // ===============================================================================
    // PRIVATE FUNCTIONS
    // ===============================================================================
    var loadTableStats = function () {
        if ($scope.currUser) {
            RestTableStats.query({ }, function (stats) {
                $scope.stats = stats;
            });
        }
    };


    // ===============================================================================
    // SCOPE VALUES
    // ===============================================================================

    $scope.stats = [];

    $scope.$on('$userIdRetrieved', loadTableStats);
    loadTableStats();


});