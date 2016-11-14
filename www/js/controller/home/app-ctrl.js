app
.controller('AppCtrl', function($scope,$state,$rootScope,$ionicPopup,$cordovaInAppBrowser,$cordovaDevice) {


	$scope.liked = false;

	// $scope.likePage = function(){
	// 	$scope.liked =!$scope.liked;
	// }
	$rootScope.$on('logged_in', function (event, args) {
		$scope.uid = window.localStorage.getItem('uid');
	});

	$scope.uid = window.localStorage.getItem('uid');

	$scope.location_info = JSON.parse(window.localStorage['selectedLocation']);

	$rootScope.$on('location', function (event, args) {
		$scope.message = args.message;
		delete window.localStorage.vendorsName;
		$scope.location_info = JSON.parse(window.localStorage['selectedLocation']);
	});

	$scope.uid = window.localStorage.getItem("uid");

	$scope.search_text = function(){
		$state.go('search');
	};

	$scope.location_option = function(){
		$state.go('location');
	};
	$scope.favorate_list = function(){
		$state.go('favourite');
	};

	$scope.logOut = function(){
		if(window.localStorage.email && window.localStorage.uid){
			firebase.auth().signOut().then(function() {
				console.log('Sign-out successful.');
				delete window.localStorage.email;
				delete window.localStorage.uid;
				delete window.localStorage.name;
				// delete window.localStorage;
				console.log("Successfully deleted from localStorage");
				console.log(window.localStorage);
			}, function(error) {
				console.log("error");
			});
		}
		delete window.localStorage.email;
		delete window.localStorage.uid;
		delete window.localStorage.name;
		$rootScope.$broadcast('logout', {message: 'log out'});
		$state.go('app.home');
	};
	$rootScope.$on('logout', function (event, args) {
		console.log("out");
		$scope.uid = '';
		window.localStorage.setItem("uid", '');
		window.localStorage.setItem("email", '');
	});
////////// Rate us on play store   ////////////////////


	$scope.rateUs = function(){
		console.log("clicked")
		var options = {
			location: 'yes',
			clearcache: 'yes',
			toolbar: 'no'
		};
		if($cordovaDevice.getDevice().manufacturer != 'Apple') {
			$cordovaInAppBrowser.open('https://play.google.com/store/apps/details?id=com.ionicframework.fab2u641617', '_system', options);
		} else {
			var alertPopup = $ionicPopup.alert({
				title:'Currently not available',
				template: 'You will be able to rate us soon'
			});
		}

	}

});