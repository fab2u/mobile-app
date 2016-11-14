app
.controller('HomeCtrl',function($scope,$state,$timeout,$ionicLoading,$location,$ionicSlideBoxDelegate) {

	$scope.fabSelected = false;
	// window.localStorage.setItem("serviceId",'');
	delete window.localStorage.slectedItems;
	delete window.localStorage.catItems;
	delete window.localStorage.serviceId;

	$scope.selectMain = function(val){
		if(val == 1){
			$scope.fabSelected = false;
		} else {
			$scope.fabSelected = true;
			$location.path("/feed");
		}
	};

	$scope.vendorIds = [];
	var locationInfo = JSON.parse(window.localStorage['selectedLocation']);

	firebase.database().ref('vendorList/'+locationInfo.cityId).once('value',function(response){
		console.log(response.val())
		var count1 = Object.keys(response.val()).length;
		var count = 0;
		angular.forEach(response.val(),function(value,key){
			count++;
			$scope.vendorIds.push(key);
			console.log("key",key)
			console.log("value",value)
		})
		if(count1 == count){
			window.localStorage['vendorIds'] = JSON.stringify($scope.vendorIds)
			console.log("vendor Ids:",window.localStorage['vendorIds'])
		}
	});

	// firebase.database().ref("vendors").once('value', function(response){
	// 	console.log(response.val());
	// 	angular.forEach(response.val(), function(value,key){
	// 		$scope.finalObject[key] = {}
	// 		if(value.active){
	// 			angular.forEach(value.vendors, function(value1, key1){
	// 				$scope.finalObject[key][key1]  = {};
	// 				angular.forEach(value1.menu, function(value2, key2){
	// 					angular.forEach(value2, function(value3, key3){
	// 						// console.log(value3, key3);
	// 						$scope.finalObject[key][key1][key3] = true;
	// 					})
	// 				})
	// 			})
	// 		}
	// 	})

		// function pushData(){
		// 	console.log($scope.finalObject);
		// 	var updates = {};
		// 	updates['vendorServices'] = $scope.finalObject;
		// 	firebase.database().ref().set(updates).then(function(){
		// 		alert('completed');
		// 	})
		// }
	// })




	$scope.get_banners = function(){
		$ionicLoading.show();
		firebase.database().ref('banners/'+JSON.parse(window.localStorage['selectedLocation']).cityId).once('value',function(response){
			if(response.val()){
				$ionicLoading.hide();
				$scope.banners = response.val();
				$ionicSlideBoxDelegate.update();
			}
			else{
				firebase.database().ref('banners/fab2u').once('value',function(response){
						$ionicLoading.hide();
						$scope.banners = response.val();
						$ionicSlideBoxDelegate.update();
				});
			}
		});
	};
	$scope.get_banners();
	$scope.offers = [
		{offer: 'Refer a friend and get hidden gift', image: 'img/home/slider/slider1.jpg'},
		{offer: 'Refer a friend and get hidden gift', image: 'img/home/slider/slider2.jpg'}
		];

	$scope.categories = [
		{catHeading: 'Salons', catSubheading: 'Be Bold, Be Daring, Be Fabulous', catImg: 'img/home/cat/salon.jpg'},
		{catHeading: 'Spa', catSubheading: 'Walk in , Float out', catImg: 'img/home/cat/spa.jpg',serviceId:'8001'},
		{catHeading: 'Fitness', catSubheading: 'Stop Saying Tomorrow', catImg: 'img/home/cat/fitness.jpg',serviceId:'9001'},
		{catHeading: 'Wedding & Party', catSubheading: 'Because Memories Last Forever', catImg: 'img/home/cat/wedding.jpg',serviceId:'1101'},
		{catHeading: 'Tattoo', catSubheading: 'Show The Word Your Story', catImg: 'img/home/cat/tattoo.jpg',serviceId:'1201'}
	];

	$scope.services = function(cat){
		if(cat == 'Salons'){
			$state.go('salonServices');
		}
		else if(cat == 'Spa') {
			window.localStorage.setItem("serviceId",'8001');

			$state.go('vendorList');
		}
		else if(cat == 'Fitness') {
			window.localStorage.setItem("serviceId",'9001');

			$state.go('vendorList');
		}
		else if(cat == 'Wedding & Party') {
			window.localStorage.setItem("serviceId",'1101');

			$state.go('vendorList');
		}
		else if(cat == 'Tattoo') {
			window.localStorage.setItem("serviceId",'1201');

			$state.go('vendorList');
		}
	};
});
