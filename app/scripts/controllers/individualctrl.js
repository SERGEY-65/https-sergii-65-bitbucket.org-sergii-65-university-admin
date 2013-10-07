angular.module('UserAdminApp').controller('IndividualCtrl', [ 
	'$scope', 'RestIndividual', 'Util',
	function ($scope, RestIndividual, Util) {


	'use strict';


    // ===============================================================================
    // SCOPE VALUES
    // ===============================================================================


	RestIndividual.query({ network: 'market' });


	$scope.individuals = [
		{
			email: 'asdf@atlassian.com'
		},
		{
			email: 'asdf@afdsgfas.com'
		},
		{
			email: 'asdf@asadfsf.com'
		},
		{
			email: 'asdf@sdfasdfn.com'
		},
		{
			email: 'asdf@adsfcom'
		},
		{
			email: 'asdf@aasdfn.com'
		},
		{
			email: 'asdf@atlassian.com'
		},
		{
			email: 'asdf@afdsgfas.com'
		},
		{
			email: 'asdf@asadfsf.com'
		},
		{
			email: 'asdf@sdfasdfn.com'
		},
		{
			email: 'asdf@adsfcom'
		},
		{
			email: 'asdf@aasdfn.com'
		},
		{
			email: 'asdf@atlassian.com'
		},
		{
			email: 'asdf@afdsgfas.com'
		},
		{
			email: 'asdf@asadfsf.com'
		},
		{
			email: 'asdf@sdfasdfn.com'
		},
		{
			email: 'asdf@adsfcom'
		},
		{
			email: 'asdf@aasdfn.com'
		},
		{
			email: 'asdf@atlassian.com'
		},
		{
			email: 'asdf@afdsgfas.com'
		},
		{
			email: 'asdf@asadfsf.com'
		},
		{
			email: 'asdf@sdfasdfn.com'
		},
		{
			email: 'asdf@adsfcom'
		},
		{
			email: 'asdf@aasdfn.com'
		},
		{
			email: 'asdf@atlassian.com'
		},
		{
			email: 'asdf@afdsgfas.com'
		},
		{
			email: 'asdf@asadfsf.com'
		},
		{
			email: 'asdf@sdfasdfn.com'
		},
		{
			email: 'asdf@adsfcom'
		},
		{
			email: 'asdf@aasdfn.com'
		},								
		{
			email: 'asdf@agggggggggggn.com'
		}												
	];

	$scope.pagination = Util.paginate({
		items: $scope.individuals
	});

	$scope.reverse = false;

	$scope.remove = function (domain) {
		console.log('removing', domain);
		$scope.individuals = _.without($scope.individuals, domain);
	};


	$scope.add = function () {
		$scope.individuals.push({ email: $scope.entry });
		$scope.entry = '';
	};


	$scope.entry = '';

    // ===============================================================================
    // PRIVATE FUNCTIONS
    // ===============================================================================



}]);