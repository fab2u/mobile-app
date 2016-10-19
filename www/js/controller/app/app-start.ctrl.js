app.controller('appStartCtrl', function($scope, $state, $timeout) {
	console.log('called');
	goOn();
	function goOn() {
		console.log("go to landing called");
		$state.go('landing');
	}
});
