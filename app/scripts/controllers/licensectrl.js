angular.module('UserAdminApp').controller('LicenseCtrl', [ 
	'$scope', 'RestLicense', 
	function ($scope, RestLicense) {


	$scope.liceneses = RestLicense.query();








}]);