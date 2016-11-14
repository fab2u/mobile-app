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

	// amenities

	var locationInfo = JSON.parse(window.localStorage['selectedLocation']);


	$scope.get_banners = function(){
		$ionicLoading.show();
		firebase.database().ref('banners/'+locationInfo.cityId).once('value',function(response){
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

	var VendorServiceList = checkLocalStorage('VendorServiceList');


	function getVendorServiceList(){
		firebase.database().ref('vendorServiceList/'+locationInfo.cityId).once('value',function(response){
            var result = response.val()
			var version = response.val().version;
			window.localStorage['VendorServiceList'] = JSON.stringify(result);
			window.localStorage['VendorServiceListVersion'] = version;
		});
	}
	if(!VendorServiceList){
		getVendorServiceList()
	}
	else{
		firebase.database().ref('vendorServiceList/'+locationInfo.cityId+'/version').once('value',function(res) {
			var newVersion = res.val()
			if(window.localStorage['VendorServiceListVersion']<newVersion){
				getVendorServiceList()
			}
		})
	}
});
