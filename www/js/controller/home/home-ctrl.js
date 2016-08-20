app
.controller('HomeCtrl', ['$scope','$state', function($scope,$state) {

	$scope.fabSelected = false;

	$scope.selectMain = function(val){
		if(val == 1){
			$scope.fabSelected = false;
		} else {
			$scope.fabSelected = true;
		}
	};

	$scope.offers = [
		{offer: 'Refer a friend and get hidden gift', imgsrc: 'img/home/slider/slider1.jpg'},
		{offer: 'Refer a friend and get hidden gift', imgsrc: 'img/home/slider/slider2.jpg'}
		];

	$scope.categories = [
		{catHeading: 'Salons', catSubheading: 'Be Bold, Be Daring, Be Fabulous', catImg: 'img/home/cat/salon.jpg'},
		{catHeading: 'Spa', catSubheading: 'Walk in , Flloat out', catImg: 'img/home/cat/spa.jpg'},
		{catHeading: 'Fitness', catSubheading: 'Stop Saying Tomorrow', catImg: 'img/home/cat/fitness.jpg'},
		{catHeading: 'Wedding & Party', catSubheading: 'Because Memories Last Forever', catImg: 'img/home/cat/wedding.jpg'},
		{catHeading: 'Tattoo', catSubheading: 'Show The Word Your Story', catImg: 'img/home/cat/tattoo.jpg'}
	];

	$scope.services = function(cat){
		console.log("cat",cat);
		if(cat == 'Salons'){
			$state.go('new-slider');
		}
		else{
			alert("To be shown vendor list");
		}
	};
}]);