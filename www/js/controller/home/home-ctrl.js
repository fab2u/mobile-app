app
.controller('HomeCtrl',function($scope,$state,$timeout,$ionicLoading) {

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
		}
	};

	$scope.offers = [
		{offer: 'Refer a friend and get hidden gift', image: 'img/home/slider/slider1.jpg'},
		{offer: 'Refer a friend and get hidden gift', image: 'img/home/slider/slider2.jpg'}
		];

	$scope.categories = [
		{catHeading: 'Salons', catSubheading: 'Be Bold, Be Daring, Be Fabulous', catImg: 'img/home/cat/salon.jpg'},
		{catHeading: 'Spa', catSubheading: 'Walk in , Flloat out', catImg: 'img/home/cat/spa.jpg',serviceId:'8001'},
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