app.controller('ServiceListCtrl', function($state, $scope,$ionicSlideBoxDelegate,$timeout,$ionicScrollDelegate) {

    $scope.backButton = function(){
        $state.go('app.home');
    };

    // initialize the current slide number for slide box

    $scope.currSlide = 0;

    $scope.tabActive = false;


    $scope.demo = function () {
        alert("clicked");
    };

    $scope.searchButton = function () {

        $state.go('search');
    };

    $scope.nextSlide = function() {
        $ionicSlideBoxDelegate.next();
    };

    $scope.services = {
        "Face":
        {
            "name": ['Bleach', 'Eyebrow/EyeLash', 'Face Threading', 'Face Waxing', 'Facials', 'Clean-up', 'Laser Treatment', 'Shaving', 'Skin Treatments', 'Skincare Consultations'],
            "image": 'img/home/new-slider/face.jpg'
        },
        "Hair":
        {
            "name": ['Beard Styling', 'Blow Dry', 'Hair Coloring', 'Hair Consulting', 'Hair Cut', 'Hair Extension', 'Head Massage', 'Hair Spa', 'Hair Transplant', 'Hair Wash', 'Other Hair Treatments', 'Straightening/ Perming', 'Anti HairFall Treatment'],
            "image": 'img/home/new-slider/hair.jpg'
        },
        "HairRemoval":{
            "name": ['Underarms', 'Arms', 'Legs', 'Full Body', 'Full Back', 'Midriff', 'Bikini', 'Waxing For Men', 'Laser Hair Removal'],
            "image": 'img/home/new-slider/hair-removal.jpg'
        },
        "Body": {
            "name": ['Body Polishing', 'Body Toning', 'Bleach', 'Body Scrub', 'Boby wrap', 'Body Treatments', 'Botox Treatment', 'Body Shaping and Contouring', 'Tanning'],
            "image": 'img/home/new-slider/Body.jpg'
        },
        "HandsNfeets": {
            "name": ['Pedicure', 'Manicure', 'Cleanings'],
            "image": 'img/home/new-slider/Hands-and-Feet.jpg'
        },
        "Nails": {
            "name": ['Nail Art', 'Nail Extension/Bar'],
            "image": 'img/home/new-slider/Nails.jpg'
        },
        "Packages": {
            "name": ['Packages'],
            "image": 'img/home/new-slider/packages.jpg'
        }
    };

//             update the slide number for slide box

    $scope.slideHasChanged = function(index,activeTab) {

        if(activeTab == true){
            $scope.currSlide = index;
            $scope.tabActive = false;
        }
        else if(activeTab == false){
            console.log("inside ijjjjjj",$scope.currSlide,$ionicSlideBoxDelegate.currentIndex());
            $scope.currSlide = $ionicSlideBoxDelegate.currentIndex();
        }
        console.log("current slide no.",$scope.currSlide);
    };

    $scope.scrollToBottom = function($event) {
        $($event.currentTarget).toggleClass("ion-chevron-down ion-chevron-up");
        if($($event.currentTarget).hasClass("ion-chevron-down")){
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);
        }else{
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
        }
    };

    $scope.findVendors = function() {
        console.log("Find Vendors");
    };

    $scope.tabWithSlideChanged = function (indexNum) {
        $scope.tabActive = true;
        $scope.slideHasChanged(indexNum,$scope.tabActive);
    };
});