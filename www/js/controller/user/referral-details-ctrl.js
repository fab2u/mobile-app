app.controller('ReferralDetailsCtrl', ['$scope', '$state' , function($scope, $state){
	$scope.referralDetails = [
		{name: 'Puni', code: 'PUNI783', date: '14th June 2016'},
		{name: 'Puni', code: 'PUNI783', date: '14th June 2016'},
		{name: 'Puni', code: 'PUNI783', date: '14th June 2016'},
		{name: 'Puni', code: 'PUNI783', date: '14th June 2016'},
		{name: 'Puni', code: 'PUNI783', date: '14th June 2016'},
		{name: 'Puni', code: 'PUNI783', date: '14th June 2016'},
		{name: 'Puni', code: 'PUNI783', date: '14th June 2016'},
		{name: 'Puni', code: 'PUNI783', date: '14th June 2016'},
		{name: 'Puni', code: 'PUNI783', date: '14th June 2016'},
		{name: 'Puni', code: 'PUNI783', date: '14th June 2016'},
		{name: 'Puni', code: 'PUNI783', date: '14th June 2016'}
	];

	$scope.referredDetails = {name: 'Anu', code: 'ANU0711', date: '14th June 2016'};

	$scope.goToRefer = function(){
		$state.go('refer');
	}

}])