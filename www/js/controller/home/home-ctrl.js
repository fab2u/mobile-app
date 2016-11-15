app.controller('HomeCtrl',function($scope,$state,$timeout,$ionicLoading,$location,
								$ionicSlideBoxDelegate,allServiceList) {

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
			$scope.serviceIds = ["8001"];
			VendorIdsForServices($scope.serviceIds)
		}
		else if(cat == 'Fitness') {
			$scope.serviceIds = ["9001"];
			VendorIdsForServices($scope.serviceIds)
		}
		else if(cat == 'Wedding & Party') {
			$scope.serviceIds = ["1101"];
			VendorIdsForServices($scope.serviceIds)
		}
		else if(cat == 'Tattoo') {
			$scope.serviceIds = ["1201"];
			VendorIdsForServices($scope.serviceIds)
		}
	};


	function getVendorServiceList(){
		allServiceList.getAllServices(locationInfo.cityId).then(function (response) {
			var result = response;
			var version = response.version;
			window.localStorage['VendorServiceList'] = JSON.stringify(result);
			window.localStorage['VendorServiceListVersion'] = version;
			$scope.VendorIdForService  = response;
			VendorIdsForServices()
		})
	}
	if(!checkLocalStorage('VendorServiceList')){
		getVendorServiceList()
	}
	else{
		allServiceList.getServiceVersion(locationInfo.cityId).then(function(res){
			var newVersion = res;
			if(window.localStorage['VendorServiceListVersion']<newVersion){
				getVendorServiceList()
			}
			else{
				$scope.VendorIdForService = JSON.parse(window.localStorage['VendorServiceList'])
				VendorIdsForServices()
			}
		})
	}


	function VendorIdsForServices(serviceId) {
		if(serviceId){
			console.log("inside if",serviceId)
			$scope.finalServiceIds = _.uniq(serviceId)
			$scope.vendorIds = [];
			// console.log($scope.finalServiceIds)
			var count = 0;
			var vendorsIds = [];
			var finalVendorIds =[];
			for(key in $scope.finalServiceIds){
				if($scope.VendorIdForService[$scope.finalServiceIds[key]]){
					vendorsIds[count] = VendorServiceList[$scope.finalServiceIds[key]].split(',');
					if(count != 0) {
						finalVendorIds = _.intersection(vendorsIds[count], finalVendorIds)
					}
					else{
						finalVendorIds = vendorsIds[count];
					}
					count++;
				}
				else{
					vendorsIds[count] = [];
					if(count != 0) {
						finalVendorIds = _.intersection(vendorsIds[count], finalVendorIds)
					}
					else{
						finalVendorIds = vendorsIds[count];
					}
					count++;
				}
			}
			window.localStorage['VendorServiceListIds'] = JSON.stringify(finalVendorIds);
			console.log(finalVendorIds);
			if(finalVendorIds.length>0){
				$state.go('vendorList',{vendorPage:'serviceList'});
			}
			else{
				$cordovaToast
					.show('No,vendor found for selected services.', 'long', 'center')
					.then(function(success) {
						// success
					}, function (error) {
						// error
				});
			}
		}
	}
});
