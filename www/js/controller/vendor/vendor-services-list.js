app
.controller('VendorServicesListCtrl',['$scope', '$ionicSlideBoxDelegate', '$ionicScrollDelegate', '$timeout','$stateParams',
    function($scope, $ionicSlideBoxDelegate, $ionicScrollDelegate, $timeout,$stateParams) {


$scope.menu = [];
        $scope.menu[0] = {
            name:"SELECTED",
            Id:'0000',
            menuList:[]
        };
        $scope.menu[1] = {
            name:"HAIR",
            Id:'1000',
            menuList:[]
        };
        $scope.menu[2] = {
            name:"FACE",
            Id:'2000',
            menuList:[]
        };
        $scope.menu[3] = {
            name:"HAIR REMOVAL",
            Id:'3000',
            menuList:[]
        };
        $scope.menu[4] = {
            name:"BODY",
            Id:'4000',
            menuList:[]
        };
        $scope.menu[5] = {
            name:"HANDS & FEETS",
            Id:'5000',
            menuList:[]
        };
        $scope.menu[6] = {
            name:"NAILS",
            Id:'6000',
            menuList:[]
        };
        $scope.menu[7] = {
            name:"PACKAGES",
            Id:'7000',
            menuList:[]
        };

        firebase.database().ref('vendors/'+JSON.parse(window.localStorage['selectedLocation']).cityId+'/'+$stateParams.vendor_id).once('value',function(response){
            angular.forEach(response.val().menu, function(value, key) {

                if(key > '1000' && key <'1015'){
                    angular.forEach(value, function(value, key) {
                        $scope.menu[1].menuList.push(value)

                    })
                }
               else if(key > '2000' && key <'2011'){
                    angular.forEach(value, function(value, key) {
                        $scope.menu[2].menuList.push(value)

                    })
                }
                else if(key > '3000' && key <'3010'){
                    angular.forEach(value, function(value, key) {
                        $scope.menu[3].menuList.push(value)

                    })
                }
                else if(key > '4000' && key <'4010'){
                    angular.forEach(value, function(value, key) {
                        $scope.menu[4].menuList.push(value)

                    })
                }
                else if(key > '5000' && key <'5004'){
                    angular.forEach(value, function(value, key) {
                        $scope.menu[5].menuList.push(value)

                    })
                }
                else if(key > '6000' && key <'6003'){
                    angular.forEach(value, function(value, key) {
                        $scope.menu[6].menuList.push(value)

                    })
                }
                else if(key == '7001'){
                    angular.forEach(value, function(value, key) {
                        $scope.menu[7].menuList.push(value)

                    })
                }


                // name:"HAIR",
                //     Id:'1000',
                //     value:[
                //     {
                //         "serviceName": "Beard Styling",
                //         "serviceid": "1001"
                //     }



            });

            console.log("menu itemeee",JSON.stringify($scope.menu))
        });

        $scope.services=[
        {
            name:"Blow dry",
            value:[
            {
                id:"1",
                service:"Variable1 acc to data",
                price:"6000",
                discountprice:"600",
                added:false
            }]
        },{
            name:"Hair dry",
            value:[
            {
                id:"2",
                service:"Variable2 according to data",
                price:"6000",
                discountprice:"600",
                added:false
            },{
                id:"3",
                service:"Variable3 according to data",
                price:"6000",
                discountprice:"600",
                added:false
            },{
                id:"4",
                service:"Variable4 according to data",
                price:"6000",
                discountprice:"600",
                added:false
            }]
        },{
            name:"Hair dry",
            value:[
            {
                id:"5",
                service:"Variable acc to data",
                price:"6000",
                discountprice:"600",
                added:false
            },{
                id:"6",
                service:"Variable acc to data",
                price:"6000",
                discountprice:"600",
                added:false
            }]
        }
    ];


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
        console.log("Back");
        // TODO
   }

   // handel on click overview button
   $scope.overviewButton = function() {
        console.log("overview");
        // TODO
   }

   
   // handel on click proceed button
   $scope.proceedButton = function() {
        console.log("Proceed");
        // TODO
   }

   $scope.service_list = [
       {
           name: "SELECTED",
           Id: '0000',
           value: [
               {
                   "serviceName": "LIST WILL BE SOON HERE",
                   "serviceid": "0001"
               }]
       },
       {
           name:"HAIR",
           Id:'1000',
           value:[
              {
                "serviceName": "Beard Styling",
                "serviceid": "1001"
        },
        {
            "serviceName": "Blow Dry",
                "serviceid": "1002"
        },
        {
            "serviceName": "Hair Coloring",
                "serviceid": "1003"
        },
       {
            "serviceName": "Hair Consulting",
                "serviceid": "1004"
        },
        {
            "serviceName": "Hair Cut",
                "serviceid": "1005"
        },
       {
            "serviceName": "Hair Extension",
                "serviceid": "1007"
        },
       {
            "serviceName": "Head Massage",
                "serviceid": "1008"
        },
        {
            "serviceName": "Hair Spa",
                "serviceid": "1009"
        },
       {
            "serviceName": "Hair Transplant",
                "serviceid": "1010"
        },
        {
            "serviceName": "Hair Wash",
                "serviceid": "1011"
        },
       {
            "serviceName": "Other Hair Treatments",
                "serviceid": "1012"
        },
       {
            "serviceName": "Straightening/ Perming",
                "serviceid": "1013"
        },
       {
            "serviceName": "Anti HairFall Treatment",
                "serviceid": "1014"
        }],
       },
       {
           name:"FACE",
           Id:'2000',
           value:[
               {
            "serviceName": "Face Bleach",
                "serviceid": "2001"
        },
        {
            "serviceName": "Eyebrow/Eyelash",
                "serviceid": "2002"
        },
        {
            "serviceName": "Face Threading",
                "serviceid": "2003"
        },
       {
            "serviceName": "Face Waxing",
                "serviceid": "2004"
        },
       {
            "serviceName": "Facials",
                "serviceid": "2005"
        },
        {
            "serviceName": "Clean-up",
                "serviceid": "2006"
        },
       {
            "serviceName": "Laser Treatment",
                "serviceid": "2007"
        },
       {
            "serviceName": "Shaving",
                "serviceid": "2008"
        },
        {
            "serviceName": "Skin Treatments",
                "serviceid": "2009"
        },
       {
            "serviceName": "Skincare Consultations",
                "serviceid": "2010"
        }
           ]
       },
       {
           name: "HAIR REMOVAL",
           Id: '3000',
           value: [
              {
            "serviceName": "Underarms",
                "serviceid": "3001"
        },
       {
            "serviceName": "Arms",
                "serviceid": "3002"
        },
        {
            "serviceName": "Legs",
                "serviceid": "3003"
        },
        {
            "serviceName": "Full Body",
                "serviceid": "3004"
        },
       {
            "serviceName": "Full Back",
                "serviceid": "3005"
        },
       {
            "serviceName": "Midriff",
                "serviceid": "3006"
        },
       {
            "serviceName": "Bikini",
                "serviceid": "3007"
        },
        {
            "serviceName": "Side Locks",
                "serviceid": "3008"
        },
        {
            "serviceName": "Laser Hair Removal",
                "serviceid": "3009"
        }]
       },
       {
           name:"BODY",
           Id:'4000',
           value:[
               {
            "serviceName": "Body Polishing",
                "serviceid": "4001"
        },
       {
            "serviceName": "Body Toning",
                "serviceid": "4002"
        },
       {
            "serviceName": "Body Bleach",
                "serviceid": "4003"
        },
       {
            "serviceName": "Body Scrub",
                "serviceid": "4004"
        },
        {
            "serviceName": "Boby Wrap",
                "serviceid": "4005"
        },
       {
            "serviceName": "Body Treatments",
                "serviceid": "4006"
        },
       {
            "serviceName": "Botox Treatment",
                "serviceid": "4007"
        },
       {
            "serviceName": "Body Shaping and Contouring",
                "serviceid": "4008"
        },
        {
            "serviceName": "Tanning",
                "serviceid": "4009"
        }]
       },
       {
           name:"HANDS & FEETS",
           Id:'5000',
           value:[
               {
            "serviceName": "Pedicure",
                "serviceid": "5001"
        },
        {
            "serviceName": "Manicure",
                "serviceid": "5002"
        },
       {
            "serviceName": "Cleanings",
                "serviceid": "5003"
        }]
       },
       {
           name:"NAILS",
           Id:'6000',
           value:[
              {
            "serviceName": "Nail Art",
                "serviceid": "6001"
        },
       {
            "serviceName": "Nail Extension/ Bar",
                "serviceid": "6002"
        }]
       },
       {
           name:"PACKAGES",
           Id:'7000',
           value:[
               {
                    "serviceName": "Packages",
                   "serviceid": "7001"
        }]
       },
       {
           name:"SPA & MASSAGES",
           Id:'8000',
           value:[
               {
            "serviceName": "Spa & Massages",
                "serviceid": "8001"
        }]
       },
       {
           name:"FITNESS",
           Id:'9000',
           value:[
             {
                "serviceName": "Fitness",
                "serviceid": "9001"
        }]
       },
       {
           name:"WEDDING & PARTY",
           Id:'1100',
           value:[
               {
            "serviceName": "Wedding & Party",
                "serviceid": "1101"
        }]
       },  {
           name:"TATTOO",
           Id:'1200',
           value:[
              {
            "serviceName": "Tattoo",
                "serviceid": "1111"
            }
           ]
       }

   ];
}])
