app
.controller('HomeCtrl',function($scope,$state,$timeout,$ionicLoading) {

	$scope.fabSelected = false;

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
			$state.go('vendorList',{'serviceId':'8001'});
		}
		else if(cat == 'Fitness') {
			$state.go('vendorList',{'serviceId':'9001'});
		}
		else if(cat == 'Wedding & Party') {
			$state.go('vendorList',{'serviceId':'1101'});
		}
		else if(cat == 'Tattoo') {
			$state.go('vendorList',{'serviceId':'1201'});
		}
	};
});