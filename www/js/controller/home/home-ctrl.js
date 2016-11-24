app.controller('HomeCtrl',function($scope,$state,$timeout,$ionicLoading,$location,
								$ionicSlideBoxDelegate,$ionicHistory,allServiceList,homeServices) {
	$ionicHistory.clearHistory();
	$ionicHistory.clearCache();
	$timeout(function () {
		$ionicLoading.hide();
	}, 10000);
	/// clear all the un-required local Storage ////////////

	clearUnUsedLocalStorage();
	function clearUnUsedLocalStorage() {
		delete window.localStorage.slectedItems;
		delete window.localStorage.catItems;
		delete window.localStorage.serviceId;
		delete window.localStorage.chosenTime;
		delete window.localStorage.vendorName;
		delete window.localStorage.vendorMobile;
		delete window.localStorage.vendorLandmark;
		delete window.localStorage.vendorLandline;
		delete window.localStorage.vendorId;
		delete window.localStorage.slectedItem;
		delete window.localStorage.BegItems;
		delete window.localStorage.previousOtp;
		delete window.localStorage.pageName;
		delete window.localStorage.selectedTab;
		delete window.localStorage.currentBookingId;
		delete window.localStorage.mapStorage;
		delete window.localStorage.VendorServiceListIds;
	}
	$scope.fabSelected = false;
	var locationInfo = JSON.parse(window.localStorage['selectedLocation']);
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


	///////////////////////Select fab-book or  services //////////////
	$scope.selectButton = function(val){
		if(val == 1){
			$scope.fabSelected = false;
		} else {
			$scope.fabSelected = true;
			$location.path("/feed");
		}
	};

	/////////////////////////////Get home banners for selected city////////////////////////
	function get_banners(){
		$ionicLoading.show();
		homeServices.getSelectedCityBanner(locationInfo.cityId).then(function(result){
			if(result){
				$scope.banners = result;
				$ionicSlideBoxDelegate.update();
				$ionicLoading.hide();
			}
			else{
				homeServices.getDefaultBanner().then(function (result) {
					$scope.banners = result;
					$ionicSlideBoxDelegate.update();
					$ionicLoading.hide();
				})
			}
		})
	}
	get_banners();


	//////////////////////end get banners function /////////////////////////////////
	///////////////////////Get vendor list regarding to their services /////////////

	function getVendorServiceList(){
		allServiceList.getAllServices(locationInfo.cityId).then(function (response) {
			var result = response;
			var version = response.version;
			window.localStorage['VendorServiceList'] = JSON.stringify(result);
			window.localStorage['VendorServiceListVersion'] = version;
			$scope.VendorIdForService  = response;
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
				$scope.VendorIdForService = JSON.parse(window.localStorage['VendorServiceList']);
			}
		})
	}


	////////////////////////end vendor list regarding to services   ///////////////////////


	$scope.selectedCategory = function(cat){
		if(cat == 'Salons'){
			$state.go('salonServices');
		}
		else if(cat == 'Spa') {
			var serviceIds = ["8001"];
			VendorIdsForSelectedCategory(serviceIds)
		}
		else if(cat == 'Fitness') {
			var serviceIds = ["9001"];
			VendorIdsForSelectedCategory(serviceIds)
		}
		else if(cat == 'Wedding & Party') {
			var serviceIds = ["1101"];
			VendorIdsForSelectedCategory(serviceIds)
		}
		else if(cat == 'Tattoo') {
			var serviceIds = ["1201"];
			VendorIdsForSelectedCategory(serviceIds)
		}
	};

	////////////////////////////vendor's list for selected category   ////////////////////

	function VendorIdsForSelectedCategory(serviceId) {
		if(serviceId){
			$scope.finalServiceIds = _.uniq(serviceId)
			$scope.vendorIds = [];
			var count = 0;
			var vendorsIds = [];
			var finalVendorIds =[];
			for(key in $scope.finalServiceIds){
				if($scope.VendorIdForService[$scope.finalServiceIds[key]]){
					vendorsIds[count] = $scope.VendorIdForService[$scope.finalServiceIds[key]].split(',');
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
			if(finalVendorIds.length>0){
				window.localStorage['VendorServiceListIds'] = JSON.stringify(finalVendorIds);
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
		else{
			$cordovaToast
				.show('Please, select some services!', 'long', 'center')
				.then(function(success) {
					// success
				}, function (error) {
					// error
				});
		}
	}






// 	$scope.finalObject = {};
// console.log("df")
// 	update();
// 	function update() {
// 		firebase.database().ref("vendors").once('value', function(snap){
// 			console.log(snap.val());
// 		})
// 		firebase.database().ref("vendors").once('value', function(response) {
// 			console.log("ddd")
// 			angular.forEach(response.val(), function (value, key) {
// 				console.log(response.val())
// 				$scope.finalObject[key] = {}
// 				if (value.active) {
// 					angular.forEach(value.vendors, function (value1, key1) {
// 						console.log("value1",value1,key1)
// 						if(value1.gender && value1.type && value1.vendorId && value1.address && value1.vendorName){
// 							$scope.finalObject[key][key1] = {
// 								vendorName: value1.vendorName,
// 								vendorId: value1.vendorId,
// 								address:value1.address,
// 								vendorType: value1.type,
// 								gender: value1.gender
// 							}
// 							if(value1.images) {
// 								if(value1.images.main){
// 									$scope.finalObject[key][key1].mainImage = value1.images.main.url;
// 								}
//
// 							} else {
// 								$scope.finalObject[key][key1].mainImage = '';
// 								$scope.finalObject[key][key1].discount= '10%';
// 								$scope.finalObject[key][key1].label= 'some information';
//
// 							}
//
// 							if(value1.amenities){
// 								$scope.finalObject[key][key1].amenities = value1.amenities;
// 							} else {
// 								$scope.finalObject[key][key1].amenities = '';
// 							}
//
// 							if(value1.discount){
// 								$scope.finalObject[key][key1].discount = value1.discount;
// 							} else {
// 								$scope.finalObject[key][key1].discount = '';
// 							}
//
// 							if(value1.label){
// 								$scope.finalObject[key][key1].label = value1.label;
// 							} else {
// 								$scope.finalObject[key][key1].label = '';
// 							}
//
// 							// if(value1.images){
// 							// 	if(value1.images.main){
// 							// 		if(value1.amenities){
// 							// 			$scope.finalObject[key][key1] = {
// 							// 				vendorName:value1.vendorName,
// 							// 				vendorId:value1.vendorId,
// 							// 				address:value1.address,
// 							// 				vendorType:value1.type,
// 							// 				gender:value1.gender,
// 							// 				amenities:value1.amenities,
// 							// 				mainImage:value1.images.main.url
// 							// 			};
// 							// 		}
// 							// 		if(value1.discount){
// 							// 			$scope.finalObject[key][key1] = {
// 							//
// 							// 			}
// 							// 		}
// 							// 		if(value1.label){
// 							//
// 							// 		}
// 							// 		else{
// 							// 			$scope.finalObject[key][key1] = {
// 							// 				vendorName:value1.vendorName,
// 							// 				vendorId:value1.vendorId,
// 							// 				address:value1.address,
// 							// 				vendorType:value1.type,
// 							// 				gender:value1.gender,
// 							// 				mainImage:value1.images.main.url,
// 							// 				amenities:''
// 							// 			};
// 							// 		}
// 							// 	}
// 							// }
// 							// else{
// 							// 	if(value1.amenities){
// 							// 		$scope.finalObject[key][key1] = {
// 							// 			vendorName:value1.vendorName,
// 							// 			vendorId:value1.vendorId,
// 							// 			address:value1.address,
// 							// 			vendorType:value1.type,
// 							// 			gender:value1.gender,
// 							// 			amenities:value1.amenities,
// 							// 			mainImage:''
// 							// 		};
// 							// 	}
// 							// 	else{
// 							// 		$scope.finalObject[key][key1] = {
// 							// 			vendorName:value1.vendorName,
// 							// 			vendorId:value1.vendorId,
// 							// 			address:value1.address,
// 							// 			vendorType:value1.type,
// 							// 			gender:value1.gender,
// 							// 			mainImage:'',
// 							// 			amenities:''
// 							// 		};
// 							// 	}
// 							// }
// 						}
//
// 					})
// 					console.log($scope.finalObject);
//
// 					// $timeout(function () {
// 					// 	console.log($scope.finalObject);
// 					// 	var updates = {};
// 					// 	updates['vendorFilters'] = $scope.finalObject;
// 					// 	firebase.database().ref().update(updates).then(function(){
// 					// 		alert('completed');
// 					// 	})
// 					// }, 200000);
// 				}
// 			})
// 		})
//
// 	}
});
