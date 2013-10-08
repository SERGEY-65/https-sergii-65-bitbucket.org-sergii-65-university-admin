angular.module('UserAdminApp').controller('UserCtrl', [ 
	'$scope', 'RestUser', 'Util',
	function ($scope, RestUser, Util) {


    // ===============================================================================
    // SCOPE VALUES
    // ===============================================================================

    $scope.reverse = false;
    $scope.orderField = 'email';

	RestUser.query({ network: 'market' });

	$scope.users = [
		{
			email: 'asdf@atlassian.com',
			role: 'user'
		},
		{
			email: 'asdf@afdsgfas.com',
			role: 'user'
		},
		{
			email: 'asdf@asadfsf.com',
			role: 'user'
		},
		{
			email: 'asdf@sdfasdfn.com',
			role: 'user'
		},
		{
			email: 'asdf@adsfcom',
			role: 'admin'
		},
		{
			email: 'asdf@aasdfn.com',
			role: 'admin'
		},
		{
			email: 'asdf@atlassian.com',
			role: 'admin'
		},
		{
			email: 'asdf@afdsgfas.com',
			role: 'user'
		},
		{
			email: 'asdf@asadfsf.com',
			role: 'user'
		},
		{
			email: 'asdf@sdfasdfn.com',
			role: 'user'
		},
		{
			email: 'asdf@adsfcom',
			role: 'user'
		},
		{
			email: 'asdf@aasdfn.com',
			role: 'user'
		},
		{
			email: 'asdf@atlassian.com',
			role: 'user'
		},
		{
			email: 'asdf@afdsgfas.com',
			role: 'user'
		},
		{
			email: 'asdf@asadfsf.com',
			role: 'user'
		},
		{
			email: 'asdf@sdfasdfn.com',
			role: 'user'
		},
		{
			email: 'asdf@adsfcom',
			role: 'user'
		},
		{
			email: 'asdf@aasdfn.com',
			role: 'user'
		},
		{
			email: 'asdf@atlassian.com',
			role: 'user'
		},
		{
			email: 'asdf@afdsgfas.com',
			role: 'loser'
		},
		{
			email: 'asdf@asadfsf.com',
			role: 'loser'
		},
		{
			email: 'asdf@sdfasdfn.com',
			role: 'loser'
		},
		{
			email: 'asdf@adsfcom',
			role: 'user'
		},
		{
			email: 'asdf@aasdfn.com',
			role: 'user'
		},
		{
			email: 'asdf@atlassian.com',
			role: 'user'
		},
		{
			email: 'asdf@afdsgfas.com',
			role: 'user'
		},
		{
			email: 'asdf@asadfsf.com',
			role: 'user'
		},
		{
			email: 'asdf@sdfasdfn.com',
			role: 'blocked'
		},
		{
			email: 'asdf@adsfcom',
			role: 'blocked'
		},
		{
			email: 'asdf@aasdfn.com',
			role: 'user'
		},								
		{
			email: 'asdf@agggggggggggn.com',
			role: 'user'
		}												
	];

	$scope.pagination = Util.paginate({
		items: $scope.users
	});



    // ===============================================================================
    // PRIVATE FUNCTIONS
    // ===============================================================================



}]);