app
.controller('NewSliderCtrl',['$scope', '$ionicSlideBoxDelegate', '$ionicScrollDelegate', '$timeout','$state',
    function($scope, $ionicSlideBoxDelegate, $ionicScrollDelegate, $timeout,$state) {


        $scope.selectedServices = {}; // Stores selected services
    $scope.currSlide = 0; // Current slide index

    // Get selected services if previously stored in localstorage
    if (localStorage.getItem("slectedItem") != null) {
        $scope.selectedServices = JSON.parse(localStorage.getItem('slectedItem'));
    }

    // Notify slide change
    // @param (int) slide index
    $scope.slideHasChanged = function(index) {
        tabPositionCenter(index);
        $scope.currSlide = $ionicSlideBoxDelegate.currentIndex();
        $timeout( function() {
          $ionicScrollDelegate.$getByHandle('mainScroll').resize();
      },100);

    }

    // notify tab change
    //@param (int) tab click index
    $scope.tabHasChanged = function(index) {
        $ionicSlideBoxDelegate.slide(index);
        tabPositionCenter(index);
    }

    // Scroll the tab to the center position
    // @param (int) tab index
    function tabPositionCenter(index){
        var currentIndex = index;
        var tabElements = $(".tab"); // get all the tabs elements
        activeTab(tabElements, currentIndex);
        var totalTabs = tabElements.length;
        var windowWidth = window.innerWidth -20; // -20 to clear padding
        var halfWindowWidth = windowWidth/2;
        // totalTabs-1 because the last tab does not have next element/tab
        if(index < totalTabs-1) {
            var obj = $(tabElements[currentIndex]);
            var childPos = obj.offset();
            var parentPos = obj.parent().offset();
            var childOffset = {
                top: childPos.top - parentPos.top,
                left: childPos.left - parentPos.left
            }
            var nextObj = obj.next();
            var nextchildPos = nextObj.offset();
            var nextparentPos = nextObj.parent().offset();
            var nextchildOffset = {
                top: nextchildPos.top - nextparentPos.top,
                left: nextchildPos.left - nextparentPos.left
            }
            var scrollValue =   childOffset.left -halfWindowWidth 
            + ((nextchildOffset.left - childOffset.left )/2) ;

            $ionicScrollDelegate.$getByHandle('myhandel').scrollTo(scrollValue, 0, true);
            

        }

        // set active tab to different color
        //@param1 (element) click tab element
        //@param2 (int) click tab index
        function activeTab(tabElements, index){
            for(var i=0; i<tabElements.length; i++){
                if(i==index){ // set active to the click tab
                	$(tabElements[i]).addClass("active");
                }else{
                	$(tabElements[i]).removeClass("active");
                }
            }
        }// activeTab

    }//tabPositionCenter

    // save selected item on click
    //@param1 (int) click item index
    //@param1 (string) click item name
    $scope.selectItem = function(index, serviceName) {
        // console.log(index, serviceName);

        // TODO
        // If not already present remove else store the name/id
        if($scope.selectedServices[serviceName]){
            delete $scope.selectedServices[serviceName];
        }else{
            $scope.selectedServices[serviceName] = true;
        }
        localStorage.setItem('slectedItem', JSON.stringify($scope.selectedServices));
    }

    // Scroll content to bottom/top
    // @param (element) button element
    $scope.scrollToBottom = function($event) {
        $($event.currentTarget).toggleClass("ion-chevron-down ion-chevron-up");
        if($($event.currentTarget).hasClass("ion-chevron-down")){
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);
        }else{
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
        }
    }

    // Scroll tabs to right/left
    // @param (element) button element
    $scope.scrollToRight = function($event) {
        $($event.currentTarget).toggleClass("ion-chevron-right ion-chevron-left");
        if($($event.currentTarget).hasClass("ion-chevron-right")){
            $ionicScrollDelegate.$getByHandle('myhandel').scrollTo(0, 0, true);
        }else{
            $ionicScrollDelegate.$getByHandle('myhandel').scrollTo(500, 0, true);
        }
   }

   // handel back button
   $scope.backButton = function() {
       $state.go('app.home');
   };

   // handel on click search button
   $scope.searchButton = function() {
        console.log("Search");
        // TODO
   };

   
   // handel on click findVendor button
   $scope.findVendors = function() {
        console.log("Find Vendors");
        // TODO
   };


   /// list of service provide for pre listed category ////

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



}]);
