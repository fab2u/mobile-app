app.controller('UserWalletCtrl', ['$scope', function($scope){

	console.log('user wallet');
	$scope.transactions = [
		{name: 'Arpit Mittal', id: 'AB23CD', date: '14th Jan 2016', amount: '200'},
		{name: 'Puni Charana', id: 'AB23CD', date: '14th Jan 2016', amount: '200'},
		{name: 'Aadharsh Nair', id: 'AB23CD', date: '14th Jan 2016', amount: '200'},
		{name: 'Anu Porwal', id: 'AB23CD', date: '14th Jan 2016', amount: '200'},
		{name: 'Ritesh Khorana', id: 'AB23CD', date: '14th Jan 2016', amount: '200'},
		{name: 'Yoshita Arora', id: 'AB23CD', date: '14th Jan 2016', amount: '200'},
		{name: 'Nishtha Agarwal', id: 'AB23CD', date: '14th Jan 2016', amount: '200'},
		{name: 'Payal Patel', id: 'AB23CD', date: '14th Jan 2016', amount: '200'}
	];

}]);