/* global _ */

angular.module('UserAdminApp').controller('DomainCtrl', [ 
	'$scope', 'RestDomain', 'Util',
	function ($scope, RestDomain, Util) {



    // ===============================================================================
    // SCOPE VALUES
    // ===============================================================================

    $scope.reverse = false;

	RestDomain.query({ network: 'market' });

	$scope.domains = [
		{
			url: 'ggggggggggn.com',
			id: 1230
		},
		{
			url: 'atlassian.com',
			id: 1234
		},
		{
			url: 'eadsfcom',
			id: 1238
		},
		{
			url: 'dsdfasdfn.com',
			id: 1237
		},
		{
			url: 'faasdfn.com',
			id: 1239
		},
		{
			url: 'bfdsgfas.com',
			id: 1232
		},
		{
			url: 'csadfsf.com',
			id: 1233
		},
		{
			url: 'ggggggggggn.com',
			id: 1230
		},
		{
			url: 'atlassian.com',
			id: 1234
		},
		{
			url: 'eadsfcom',
			id: 1238
		},
		{
			url: 'dsdfasdfn.com',
			id: 1237
		},
		{
			url: 'faasdfn.com',
			id: 1239
		},
		{
			url: 'bfdsgfas.com',
			id: 1232
		},
		{
			url: 'csadfsf.com',
			id: 1233
		},
		{
			url: 'ggggggggggn.com',
			id: 1230
		},
		{
			url: 'atlassian.com',
			id: 1234
		},
		{
			url: 'eadsfcom',
			id: 1238
		},
		{
			url: 'dsdfasdfn.com',
			id: 1237
		},
		{
			url: 'faasdfn.com',
			id: 1239
		},
		{
			url: 'bfdsgfas.com',
			id: 1232
		},
		{
			url: 'csadfsf.com',
			id: 1233
		}														
	];

	$scope.pagination = Util.paginate({
		items: $scope.domains
	});


	$scope.remove = function (domain) {

		// domain.blocked = true;
		// domain.$save();
		
		// RestDomain.block({ id: domain.id, network: 'macnet' }, function () {
			$scope.domains = _.without($scope.domains, domain);
		// });
	};


	$scope.add = function () {
		$scope.domains.push({ url: $scope.entry });
		$scope.entry = '';
	};

	$scope.entry = '';

    // ===============================================================================
    // PRIVATE FUNCTIONS
    // ===============================================================================




}]);