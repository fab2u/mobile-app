app
    .controller('VendorServicesListCtrl',function($scope, $ionicSlideBoxDelegate, $ionicScrollDelegate,
                                                  $timeout,$stateParams,$rootScope,$state,$ionicLoading,$ionicHistory) {

        $scope.total_fabtu=0;
        $scope.total_original=0;
        $scope.total_customer = 0;

        $scope.demo = 'cat-08';
        $scope.newMenu = [];


        $scope.show = function() {
                $ionicLoading.show();
            };
            $scope.show();
            $scope.menu = [];
            $scope.catName = [];
            $scope.cart_item = 0;
            $scope.cart_price = {};

        $scope.vendorDetail = function() {
            $ionicLoading.show();
            firebase.database().ref('vendors/' + JSON.parse(window.localStorage['selectedLocation']).cityId + '/' + $stateParams.vendor_id).once('value', function (response) {
                $scope.vendor_detail = response.val();
                window.localStorage.setItem("vendorMobile",$scope.vendor_detail.contactDetails.phone);
                window.localStorage.setItem("vendorLandline",$scope.vendor_detail.contactDetails.landline);

                $ionicLoading.hide();
            });
        };

            firebase.database().ref('menu/'+$stateParams.vendor_id).once('value',function(response){
                if(response.val()){
                    $scope.menuInfo = response.val().services;
                    window.localStorage.setItem("vendorName",response.val().vendorName);
                    angular.forEach($scope.menuInfo, function(value, key) {
                        if(key == 'cat-01'){
                            $scope.catName.push("HAIR");
                            $scope.menu.push(value)
                        }
                        else if(key =='cat-02'){
                            $scope.catName.push("FACE");
                            $scope.menu.push(value)
                        }
                        else if(key =='cat-03'){
                            $scope.catName.push("HAIR REMOVAL");
                            $scope.menu.push(value)
                        }
                        else if(key =='cat-04'){
                            $scope.catName.push("BODY");
                            $scope.menu.push(value)
                        }
                        else if(key =='cat-05'){
                            $scope.catName.push("HANDS & FEETS");
                            $scope.menu.push(value)
                        }
                        else if(key =='cat-06'){
                            $scope.catName.push("NAILS");
                            $scope.menu.push(value)
                        }
                        else if(key =='cat-07'){
                            $scope.catName.push("PACKAGES");
                            $scope.menu.push(value)
                        }
                        else if(key =='cat-08'){
                            $scope.catName.push("SPA & MASSAGES");
                            $scope.menu.push(value)
                        }
                        else if(key =='cat-09'){
                            $scope.catName.push("FITNESS");
                            $scope.menu.push(value)
                        }
                        else if(key =='cat-11'){
                            $scope.catName.push("WEDDING & PARTY");
                            $scope.menu.push(value)
                        }
                        else if(key =='cat-12'){
                            $scope.catName.push("TATTOO");
                            $scope.menu.push(value)
                        }
                    });
                    $scope.vendorDetail();
                    $timeout( function() {
                        $ionicSlideBoxDelegate.update();
                        $ionicLoading.hide();
                    },300);
                }
                else{
                    $ionicLoading.hide();
                    alert('No,menu found for this vendor,please select another vendor!');
                }

            });




        ///To calculate cart price //////

            $scope.calPrice = function (item_list) {
                $scope.total_fabtu=0;
                $scope.total_original=0;
                $scope.total_customer = 0;
                angular.forEach(item_list, function(value, key) {
                    $scope.total_fabtu += value.fab2uPrice;
                    $scope.total_original += value.vendorPrice;
                    $scope.total_customer += value.customerPrice;
                })
            };
            if(localStorage.getItem('BegItems') != null){
                $scope.cartItems = JSON.parse(localStorage.getItem('BegItems'));
                $scope.calPrice($scope.cartItems);
            }


            $scope.selectedServices = {}; // Stores selected services
            $scope.begItems = {};

            $scope.currSlide = 0; // Current slide index

            // Get selected services if previously stored in localstorage
            if ((localStorage.getItem("slectedItem") != null) && (localStorage.getItem('BegItems'))) {
                $scope.selectedServices = JSON.parse(localStorage.getItem('slectedItem'));
                $scope.begItems = JSON.parse(localStorage.getItem('BegItems'));

                $scope.cart_item = _.size($scope.selectedServices);
            }

            $rootScope.$on('cart', function (event, args) {
                $scope.message = args.message;
                $scope.selectedServices = JSON.parse(localStorage.getItem('slectedItem'));
                $scope.begItems = JSON.parse(localStorage.getItem('BegItems'));
                $scope.cart_item = _.size($scope.selectedServices);
                $scope.calPrice($scope.begItems);
            });

            // Notify slide change
            // @param (int) slide index
            $scope.slideHasChanged = function(index) {
                tabPositionCenter(index);
                $scope.currSlide = $ionicSlideBoxDelegate.currentIndex();
                $timeout( function() {
                    $ionicSlideBoxDelegate.update();
                    $ionicScrollDelegate.$getByHandle('mainScroll').resize();
                },100);
            };

            // notify tab change
            //@param (int) tab click index
            $scope.tabHasChanged = function(index) {
                $ionicSlideBoxDelegate.slide(index);
                tabPositionCenter(index);
            };

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

            $scope.selectItem = function(index, serviceName,selectObj) {
                var data = selectObj;
                if(($scope.begItems[data.menuItemName]) && ($scope.selectedServices[serviceName])){
                    delete $scope.begItems[data.menuItemName];
                    delete $scope.selectedServices[serviceName];
                }
                else {
                    $scope.begItems[data.menuItemName] = data;
                    $scope.selectedServices[serviceName] = true;
                 }
                localStorage.setItem('BegItems', JSON.stringify($scope.begItems));
                localStorage.setItem('slectedItem', JSON.stringify($scope.selectedServices));
                $rootScope.$broadcast('cart', { message: 'cart length changed' });
            };



            // Scroll tabs to right/left
            // @param (element) button element
            $scope.scrollToRight = function($event) {
                $($event.currentTarget).toggleClass("ion-chevron-right ion-chevron-left");
                if($($event.currentTarget).hasClass("ion-chevron-right")){
                    $ionicScrollDelegate.$getByHandle('myhandel').scrollTo(0, 0, true);
                }else{
                    $ionicScrollDelegate.$getByHandle('myhandel').scrollTo(500, 0, true);
                }
            };

            // handel back button
            $scope.backButton = function() {
                if(localStorage.getItem('favourite') == 'true') {
                    localStorage.setItem('favourite', '');
                    console.log("1")
                    $state.go('favourite');
                }
                else if(localStorage.getItem("service_type")=='vendor'){
                    localStorage.setItem('service_type', '');
                    console.log("2")

                    $state.go('app.home');
                }
                else if(window.localStorage.getItem("selectedTab")=='true'){
                    console.log("3");
                    localStorage.setItem('selectedTab', '');
                    $state.go('vendorSelectedMenu',{vendor_id:$stateParams.vendor_id});
                }
                else{
                    console.log("else");
                    $state.go('vendorList');
                }
                // TODO
            };

            // handel on click overview buttonmySubArray,
            $scope.overviewButton = function() {
                $state.go('vendorDetails',{'ven_id':$stateParams.vendor_id})
                // TODO
            };


            // handel on click proceed button
            $scope.proceedButton = function() {
                if(_.size($scope.selectedServices)>0){
                    $state.go('cart',{'ven_id':$stateParams.vendor_id});

                }
                else{
                    alert('Please, select some services!')
                }
            };

            $scope.services = {
                "1001":{
                    "serviceName": "Beard Styling",
                    "serviceid": "1001"
                },
                "1002":{
                    "serviceName": "Blow Dry",
                    "serviceid": "1002"
                },
                "1003":{
                    "serviceName": "Hair Coloring",
                    "serviceid": "1003"
                },
                "1004":{
                    "serviceName": "Hair Consulting",
                    "serviceid": "1004"
                },
                "1005":{
                    "serviceName": "Hair Cut",
                    "serviceid": "1005"
                },
                "1006":{
                    "serviceName": "Hair Extension",
                    "serviceid": "1006"
                },
                "1007":{
                    "serviceName": "Hair Transplant",
                    "serviceid": "1007"
                },
                "1008":{
                    "serviceName": "Head Massage",
                    "serviceid": "1008"
                },
                "1009":{
                    "serviceName": "Hair Spa",
                    "serviceid": "1009"
                },
                "1010":{
                    "serviceName": "Anti HairFall Treatment",
                    "serviceid": "1010"
                },
                "1011":{
                    "serviceName": "Hair Wash",
                    "serviceid": "1011"
                },
                "1012":{
                    "serviceName": "Other Hair Treatments",
                    "serviceid": "1012"
                },
                "1013":{
                    "serviceName": "Straightening/ Perming",
                    "serviceid": "1013"
                },
                "2001":{
                    "serviceName": "Face Bleach",
                    "serviceid": "2001"
                },
                "2002":{
                    "serviceName": "Eyebrow/Eyelash",
                    "serviceid": "2002"
                },
                "2003":{
                    "serviceName": "Face Threading",
                    "serviceid": "2003"
                },
                "2004":{
                    "serviceName": "Face Waxing",
                    "serviceid": "2004"
                },
                "2005":{
                    "serviceName": "Facials",
                    "serviceid": "2005"
                },
                "2006":{
                    "serviceName": "Clean-up",
                    "serviceid": "2006"
                },
                "2007":{
                    "serviceName": "Laser Treatment",
                    "serviceid": "2007"
                },
                "2008":{
                    "serviceName": "Shaving",
                    "serviceid": "2008"
                },
                "2009":{
                    "serviceName": "Skin Treatments",
                    "serviceid": "2009"
                },
                "2010":{
                    "serviceName": "Skincare Consultations",
                    "serviceid": "2010"
                },
                "3001":{
                    "serviceName": "Underarms",
                    "serviceid": "3001"
                },
                "3002":{
                    "serviceName": "Arms",
                    "serviceid": "3002"
                },
                "3003":{
                    "serviceName": "Legs",
                    "serviceid": "3003"
                },
                "3004":{
                    "serviceName": "Full Body",
                    "serviceid": "3004"
                },
                "3005":{
                    "serviceName": "Full Back",
                    "serviceid": "3005"
                },
                "3006":{
                    "serviceName": "Midriff",
                    "serviceid": "3006"
                },
                "3007":{
                    "serviceName": "Bikini",
                    "serviceid": "3007"
                },
                "3008":{
                    "serviceName": "Side Locks",
                    "serviceid": "3008"
                },
                "3009":{
                    "serviceName": "Laser Hair Removal",
                    "serviceid": "3009"
                },
                "4001":{
                    "serviceName": "Body Polishing",
                    "serviceid": "4001"
                },
                "4002":{
                    "serviceName": "Body Toning",
                    "serviceid": "4002"
                },
                "4003":{
                    "serviceName": "Body Bleach",
                    "serviceid": "4003"
                },
                "4004":{
                    "serviceName": "Body Scrub",
                    "serviceid": "4004"
                },
                "4005":{
                    "serviceName": "Body Wrap",
                    "serviceid": "4005"
                },
                "4006":{
                    "serviceName": "Body Treatments",
                    "serviceid": "4006"
                },
                "4007":{
                    "serviceName": "Botox Treatment",
                    "serviceid": "4007"
                },
                "4008":{
                    "serviceName": "Body Shaping and Contouring",
                    "serviceid": "4008"
                },
                "4009":{
                    "serviceName": "Tanning",
                    "serviceid": "4009"
                },
                "5001":{
                    "serviceName": "Pedicure",
                    "serviceid": "5001"
                },
                "5002":{
                    "serviceName": "Manicure",
                    "serviceid": "5002"
                },
                "5003":{
                    "serviceName": "Cleanings",
                    "serviceid": "5003"
                },
                "6001":{
                    "serviceName": "Nail Art",
                    "serviceid": "6001"
                },
                "6002":{
                    "serviceName": "Nail Extension/ Bar",
                    "serviceid": "6002"
                },
                "7001":{
                    "serviceName": "Packages",
                    "serviceid": "7001"
                },
                "8001":{
                    "serviceName": "Spa & Massages",
                    "serviceid": "8001"
                },
                "9001":{
                    "serviceName": "Fitness",
                    "serviceid": "9001"
                },
                "1101":{
                    "serviceName": "Wedding & Party",
                    "serviceid": "1101"
                },
                "1201":{
                    "serviceName": "Tattoo",
                    "serviceid": "1201"
                }
            };

  })
