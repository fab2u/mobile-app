app.controller('VendorListCtrl',
    function ($scope,$q,$timeout, $ionicHistory, $state, $stateParams, $ionicLoading, $http
        ,$ionicModal,$ionicPopover,$rootScope,$cordovaToast) {

        $scope.gender = '';
        $scope.genSelected = false;
        $scope.serviceIds = [];
        $scope.vendorList = [];
        var locationInfo = JSON.parse(window.localStorage['selectedLocation']);
        var cityId = locationInfo.cityId;
        $scope.lat = locationInfo.latitude;
        $scope.long = locationInfo.longitude;

        $scope.vendorIds = JSON.parse(window.localStorage['vendorIds']);

        function load_vendors(cityId,vender_id) {
            firebase.database().ref('vendors/' + cityId + '/vendors/'+vender_id)
                .once('value').then(function(snapshot) {
                var result = snapshot.val();
                if(result){
                    var distance = get_distance($scope.lat,$scope.long,result.address.latitude,result.address.longitude)
                    console.log("distance",distance)
                    result.distance = distance
                    $scope.vendorList.push(result)
                }
            });
        }

        for(var i =0; i<$scope.vendorIds.length;i++){
            console.log($scope.vendorIds[i])
            load_vendors(cityId,$scope.vendorIds[i])
        }

        var filters = {}
        function get_distance(latitude1,longitude1,latitude2,longitude2,units) {
            var p = 0.017453292519943295;    //This is  Math.PI / 180
            var c = Math.cos;
            var a = 0.5 - c((latitude2 - latitude1) * p)/2 +
                c(latitude1 * p) * c(latitude2 * p) *
                (1 - c((longitude2 - longitude1) * p))/2;
            var R = 6371; //  Earth distance in km so it will return the distance in km
            $scope.dist = Math.round(2 * R * Math.asin(Math.sqrt(a)));
            return $scope.dist;

        };



        function start_filtering(filters){
            if($scope.vendorIds.length==0){
                alert("No Vendors");
            }else{
                // load_vendors(cityId).then(function(response) {
                var response = $scope.vendorList;
                    var allVendorKeys = Object.keys(response);
                    var obtainedVendorIds = $scope.vendorIds
                    for (key in obtainedVendorIds) {
                        if(_.contains(allVendorKeys, obtainedVendorIds[key])){
                            response[obtainedVendorIds[key]].show = true;
                        }
                    }
                    if (filters.type) {
                        console.log("inside type")
                        for (key in response) {
                            if (response[key].type === filters.type) {
                                response[key].show = true;
                                console.log("ddddddddddddd",response[key])
                            } else {
                                response[key].show = false;
                            }

                        }
                    }
                    if (filters.amenities.length>0) {
                        console.log("inside amenities")
                        for (key in response) {
                            if (response[key].show) {
                                if(response[key].amenities){
                                    var setA = Object.keys(response[key].amenities);
                                    var setB = filters.amenities;
                                    var setC = _.intersection(setA, setB);
                                    // console.log(setA, setB);
                                    if(setB.length != setC.length){
                                        response[key].show = false;
                                    }
                                }

                            }
                        }
                    }
                    if(filters.location.length>0){
                        console.log("inside location")
                        for (key in response){
                            if(response[key].show){
                                var setX = response[key].address.locationId;
                                var setY = filters.location;
                                console.log(setX);
                                console.log(setY);
                                if(!_.contains(setY, setX)){
                                    response[key].show = false;
                                }
                            }
                        }
                    }
                    for (key in response) {
                        $scope.vendorList = [];
                        if (response[key].show) {
                            console.log("gddddddddddfffff")
                           var distance = get_distance($scope.lat,$scope.long,response[key].address.latitude,response[key].address.longitude)
                            console.log("distance",distance)
                            response[key].distance = distance
                            $scope.vendorList.push(response[key])
                            console.log(response[key],$scope.vendorList);
                        }else{
                            console.log("kkkkk");
                        }
                    }
                // }, function(error){
                //     // Todo Show alert
                //     console.log(error);
                // });

            }
            console.log("final list",$scope.vendorList)

        }

        // $timeout(function () {
        //     start_filtering();
        // }, 5000);


        //////      Map for a particular vendor   //////////////////


            $scope.open_map = function (latitude, longitude, line1, line2, vendorName) {
                $state.go('map', {
                    'lat': latitude,
                    'lng': longitude,
                    'add1': line1,
                    'add2': line2,
                    'name': vendorName
                });
            };

            $scope.backButton = function () {
                $state.go('app.home');
            };

                $scope.multipleAddressMapView = function () {
                    $state.go('mapMultiple')
                };


            $scope.typeFn = function(val){
                $scope.type = val;
            };

            $ionicModal.fromTemplateUrl('templates/vendor/filter.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.filter_screen = modal;
            });

            $scope.open_filter = function() {
                $scope.filter_screen.show();
            };

            $scope.close_filter = function(){
                $scope.filter_screen.hide();

            };

            $ionicModal.fromTemplateUrl('templates/vendor/filter-location.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.location = modal;
            });
            $scope.open_location = function() {
                $ionicLoading.show();
                firebase.database().ref('location/' + JSON.parse(window.localStorage['selectedLocation']).cityId).once('value', function (response) {
                    $scope.location_detail = response.val();
                    $scope.location.show();
                    $ionicLoading.hide();
                });

            };
            $scope.close_location = function() {
                $scope.location.hide();
            };

            $scope.final_amenity = [];
        $scope.amenities = [
                    {
                        'name':'card',
                        'selected':false,
                        'icon':'ion-card'
                    },
                    {
                        'name':'ac',
                        'selected':false,
                        'icon':'ion-laptop'
                    },
                    {
                        'name':'parking',
                        'selected':false,
                        'icon':'ion-android-car'
                    },
                    {
                        'name':'wifi',
                        'selected':false,
                        'icon':'ion-wifi'
                    }
                ];
                $scope.location = {};
                $scope.selectedLocation = [];
                $scope.isChecked = false;

                $scope.amenity_list = function (val) {
                    val.selected =!val.selected;
                };

                $scope.location_selected = function(val,isChecked){
                    if($scope.selectedLocation[val]){
                        delete $scope.selectedLocation[val];
                    }
                    else {
                        $scope.selectedLocation[val] = true;
                    }
                };
            $scope.apply = function () {
                // $ionicLoading.show();
                for (var i = 0; i < $scope.amenities.length; i++) {
                    if ($scope.amenities[i].selected == true) {
                        $scope.final_amenity.push($scope.amenities[i].name);
                    }
                }
                var filters = {
                    type: $scope.type,
                    amenities: $scope.final_amenity,
                    location: Object.keys($scope.selectedLocation)
                }
                start_filtering(filters);
                $scope.filter_screen.hide();
                console.log("filters",filters)
            }
             $scope.refresh = function() {
                 $ionicLoading.show();
                 $rootScope.$broadcast('refresh', {message: 'vendor list changed'});
                 $scope.filter_screen.hide();
                 $scope.amenities = [];
                 $scope.type = '';
                 $scope.selectedLocation = [];
                 $ionicLoading.hide();
             };
               $rootScope.$on('refresh', function (event, args) {
                    location.reload()
                });



        // $scope.vendor_info = function(){
        //     $scope.serviceIds = [];
        //     var serviceId = window.localStorage.getItem("serviceId");
        //     if (localStorage.getItem('uid') == '' || localStorage.getItem('uid') == null || localStorage.getItem('uid') == undefined) {
        //         $scope.uid = '1';
        //     }
        //     else {
        //         $scope.uid = localStorage.getItem('uid');
        //     }
        //     if (localStorage.getItem('catItems')) {
        //         angular.forEach(JSON.parse(localStorage.getItem('catItems')), function (value, key) {
        //             $scope.serviceIds.push(value.id);
        //         })
        //     }
        //
        //     $scope.vendorList = function () {
        //         $ionicLoading.show();
        //         if ($scope.serviceIds.length > 0) {
        //             var serviceIdList = $scope.serviceIds.join();
        //             $http.post("http://139.162.31.204/search_services?services=" + $scope.serviceIds +
        //                 "&user_id=" + $scope.uid + "&user_city=" + locationInfo.cityId +
        //                 "&user_gender=2&user_lat=" + $scope.lat + "&user_lon=" + $scope.long)
        //                 .then(function (response) {
        //                     $scope.vendorList = response.data.results;
        //                     console.log("result",$scope.vendorList)
        //                     if($scope.vendorList.length == 0){
        //                         $cordovaToast
        //                             .show('No vendors available for selected services. Please select again.', 'long', 'center')
        //                             .then(function(success) {
        //                                 // success
        //                             }, function (error) {
        //                                 // error
        //                             });
        //
        //                     }
        //                     $ionicLoading.hide();
        //                 });
        //         }
        //         else if (serviceId) {
        //             $http.post("http://139.162.31.204/search_services?services=" + serviceId +
        //                 "&user_id=" + $scope.uid + "&user_city=" + locationInfo.cityId + "&user_gender=2&user_lat=" + $scope.lat + "&user_lon=" + $scope.long)
        //                 .then(function (response) {
        //                     $scope.vendorList = response.data.results;
        //                     console.log("result",JSON.stringify($scope.vendorList,null,2))
        //
        //                     if($scope.vendorList.length == 0){
        //                         $cordovaToast
        //                             .show('No vendors available for selected services. Please select again.', 'long', 'center')
        //                             .then(function(success) {
        //                                 // success
        //                             }, function (error) {
        //                                 // error
        //                             });
        //
        //                     }
        //                     $ionicLoading.hide();
        //                 });
        //
        //         }
        //         else {
        //             $http.post("http://139.162.31.204/get_vendors?user_id=" + $scope.uid +
        //                 "&user_city=" + locationInfo.cityId + "&user_gender=2&user_lat=" + $scope.lat + "&user_lon=" + $scope.long)
        //                 .then(function (response) {
        //                     $scope.vendorList = response.data.results;
        //                     if($scope.vendorList.length == 0){
        //                         $cordovaToast
        //                             .show('No vendors available for selected services. Please select again.', 'long', 'center')
        //                             .then(function(success) {
        //                                 // success
        //                             }, function (error) {
        //                                 // error
        //                             });
        //
        //                     }
        //                     $ionicLoading.hide();
        //                 });
        //         }
        //     };
        //     $scope.vendorList();
        //     $rootScope.$on('refresh', function (event, args) {
        //         location.reload()
        //     });
        //
        //     ////////      Map for a particular vendor   //////////////////
        //
        //
        //     $scope.open_map = function (latitude, longitude, line1, line2, vendorName) {
        //         $state.go('map', {
        //             'lat': latitude,
        //             'lng': longitude,
        //             'add1': line1,
        //             'add2': line2,
        //             'name': vendorName
        //         });
        //     };
        //
        //     $scope.backButton = function () {
        //         $state.go('app.home');
        //     };
        //
        //     // $scope.rating = 3;
        //     // function defaultColor() {
        //     //     male.classList.add('is-active');
        //     //     female.classList.remove('is-active');
        //     // }
        //     //
        //     // defaultColor();
        //     // if(val == 1){
        //     //     $scope.fabSelected = false;
        //     // } else {
        //     //     $scope.fabSelected = true;
        //     //     $location.path("/feed");
        //     // }
        //     $scope.toggleColor = function (val) {
        //         $ionicLoading.show();
        //         if (val == 1) {
        //             $scope.genSelected = true;
        //             $scope.gender = 'male';
        //
        //             if ($scope.serviceIds.length > 0) {
        //                 var serviceIdList = $scope.serviceIds.join();
        //                 $http.post("http://139.162.31.204/search_services?services=" + $scope.serviceIds +
        //                     "&user_id=" + $scope.uid + "&user_city=" + locationInfo.cityId + "&user_gender=1&user_lat=" + $scope.lat + "&user_lon=" + $scope.long)
        //                     .then(function (response) {
        //                         $scope.vendorList = response.data.results;
        //                         if($scope.vendorList.length == 0){
        //                             $cordovaToast
        //                                 .show('No vendors available for selected services. Please select again.', 'long', 'center')
        //                                 .then(function(success) {
        //                                     // success
        //                                 }, function (error) {
        //                                     // error
        //                                 });
        //
        //                         }
        //                         $ionicLoading.hide();
        //                     });
        //             }
        //             else if (serviceId) {
        //                 $http.post("http://139.162.31.204/search_services?services=" + serviceId +
        //                     "&user_id=" + $scope.uid + "&user_city=" + locationInfo.cityId + "&user_gender=1&user_lat=" + $scope.lat + "&user_lon=" + $scope.long)
        //                     .then(function (response) {
        //                         $scope.vendorList = response.data.results;
        //                         if($scope.vendorList.length == 0){
        //                             $cordovaToast
        //                                 .show('No vendors available for selected services. Please select again.', 'long', 'center')
        //                                 .then(function(success) {
        //                                     // success
        //                                 }, function (error) {
        //                                     // error
        //                                 });
        //
        //                         }
        //                         $ionicLoading.hide();
        //                     });
        //             }
        //             else {
        //                 $http.post("http://139.162.31.204/get_vendors?user_id=" + $scope.uid + "&user_city=" + locationInfo.cityId +
        //                     "&user_gender=1&user_lat=" + $scope.lat + "&user_lon=" + $scope.long)
        //                     .then(function (response) {
        //                         $scope.vendorList = response.data.results;
        //                         if($scope.vendorList.length == 0){
        //                             $cordovaToast
        //                                 .show('No vendors available for selected services. Please select again.', 'long', 'center')
        //                                 .then(function(success) {
        //                                     // success
        //                                 }, function (error) {
        //                                     // error
        //                                 });
        //
        //                         }
        //                         $ionicLoading.hide();
        //                     });
        //             }
        //
        //         }
        //         else {
        //             // male.classList.add('is-active');
        //             // female.classList.remove('is-active');
        //             // $scope.gender = 'female';
        //             $scope.genSelected = false;
        //
        //             if ($scope.serviceIds.length > 0) {
        //                 var serviceIdList = $scope.serviceIds.join();
        //                 $http.post("http://139.162.31.204/search_services?services=" + $scope.serviceIds +
        //                     "&user_id=" + $scope.uid + "&user_city=" + locationInfo.cityId + "&user_gender=2&user_lat=" + $scope.lat + "&user_lon=" + $scope.long)
        //                     .then(function (response) {
        //                         $scope.vendorList = response.data.results;
        //                         if($scope.vendorList.length == 0){
        //                             $cordovaToast
        //                                 .show('No vendors available for selected services. Please select again.', 'long', 'center')
        //                                 .then(function(success) {
        //                                     // success
        //                                 }, function (error) {
        //                                     // error
        //                                 });
        //
        //                         }
        //                         $ionicLoading.hide();
        //                     });
        //             }
        //             else if (serviceId) {
        //                 $http.post("http://139.162.31.204/search_services?services=" + serviceId +
        //                     "&user_id=" + $scope.uid + "&user_city=" + locationInfo.cityId + "&user_gender=2&user_lat=" + $scope.lat + "&user_lon=" + $scope.long)
        //                     .then(function (response) {
        //                         $scope.vendorList = response.data.results;
        //                         if($scope.vendorList.length == 0){
        //                             $cordovaToast
        //                                 .show('No vendors available for selected services. Please select again.', 'long', 'center')
        //                                 .then(function(success) {
        //                                     // success
        //                                 }, function (error) {
        //                                     // error
        //                                 });
        //
        //                         }
        //                         $ionicLoading.hide();
        //                     });
        //             }
        //             else {
        //                 $http.post("http://139.162.31.204/get_vendors?user_id=" + $scope.uid + "&user_city=" + locationInfo.cityId +
        //                     "&user_gender=2&user_lat=" + $scope.lat + "&user_lon=" + $scope.long)
        //                     .then(function (response) {
        //                         $scope.vendorList = response.data.results;
        //                         if($scope.vendorList.length == 0){
        //                             $cordovaToast
        //                                 .show('No vendors available for selected services. Please select again.', 'long', 'center')
        //                                 .then(function(success) {
        //                                     // success
        //                                 }, function (error) {
        //                                     // error
        //                                 });
        //
        //                         }
        //                         $ionicLoading.hide();
        //                     });
        //             }
        //         }
        //     };
        //
        //     $scope.starRating = function (rating) {
        //         return new Array(rating);   //ng-repeat will run as many times as size of array
        //     };
        //
        //     $scope.vendor_menu = function (id) {
        //         delete window.localStorage.slectedItems;
        //         // delete window.localStorage.catItems;
        //         delete window.localStorage.BegItems;
        //         if (localStorage.getItem('catItems')) {
        //             $state.go('vendorSelectedMenu', {vendor_id: id});
        //         }
        //         else {
        //             $state.go('vendorMenu', {vendor_id: id});
        //         }
        //     };
        //     $scope.multipleAddressMapView = function () {
        //         $state.go('mapMultiple')
        //     };
        //
        //     $scope.filterScreen = function () {
        //         $state.go('filter');
        //     };
        //
        //
        //     ////////////////////////  Sorting functionality  //////////////////////////////
        //
        //     $ionicPopover.fromTemplateUrl('templates/popover.html', {
        //         scope: $scope,
        //     }).then(function (popover) {
        //         $scope.popover = popover;
        //     });
        //
        //     $scope.closePopover = function () {
        //         $scope.popover.hide();
        //     };
        //     $scope.sortVendors = function(sortby) {
        //         $ionicLoading.show();
        //         if(sortby == 'distance'){
        //             $http.post("http://139.162.31.204/sort_results?user_id=" + $scope.uid + "&key="+sortby)
        //                 .then(function (response) {
        //                     $scope.vendorList = response.data.sorted_results;
        //                     if($scope.vendorList.length == 0){
        //                         $cordovaToast
        //                             .show('No vendors available for selected services. Please select again.', 'long', 'center')
        //                             .then(function(success) {
        //                                 // success
        //                             }, function (error) {
        //                                 // error
        //                             });
        //
        //                     }
        //                     $ionicLoading.hide();
        //                 });
        //         }
        //         else{
        //             $http.post("http://139.162.31.204/sort_results?user_id=" + $scope.uid + "&key=price&order="+sortby)
        //                 .then(function (response) {
        //                     $scope.vendorList = response.data.sorted_results;
        //                     if($scope.vendorList.length == 0){
        //                         $cordovaToast
        //                             .show('No vendors available for selected services. Please select again.', 'long', 'center')
        //                             .then(function(success) {
        //                                 // success
        //                             }, function (error) {
        //                                 // error
        //                             });
        //
        //                     }
        //                     $ionicLoading.hide();
        //                 });
        //         }
        //
        //     };
        //
        //
        //
        //     ///////////////// Filter screen and their functionality   /////////////////////////////
        //
        //
        //     $scope.price_range = 1;
        //     $scope.range = 1;
        //     $scope.final_amenity = [];
        //     $scope.amenities = [
        //         {
        //             'name':'card',
        //             'selected':false,
        //             'icon':'ion-card'
        //         },
        //         {
        //             'name':'ac',
        //             'selected':false,
        //             'icon':'ion-laptop'
        //         },
        //         {
        //             'name':'parking',
        //             'selected':false,
        //             'icon':'ion-android-car'
        //         },
        //         {
        //             'name':'wifi',
        //             'selected':false,
        //             'icon':'ion-wifi'
        //         }
        //     ];
        //     $scope.location = {};
        //     $scope.selectedLocation = [];
        //     $scope.isChecked = false;
        //
        //     $scope.amenity_list = function (val) {
        //         val.selected =!val.selected;
        //     };
        //
        //     $scope.location_selected = function(val,isChecked){
        //         if($scope.selectedLocation[val]){
        //             delete $scope.selectedLocation[val];
        //         }
        //         else {
        //             $scope.selectedLocation[val] = true;
        //         }
        //     };
        //
        //     $scope.ratingsObject = {
        //         iconOn: 'ion-ios-star',
        //         iconOff: 'ion-ios-star-outline',
        //         iconOnColor: '#ffd11a',
        //         iconOffColor: '#b38f00',
        //         rating: 0,
        //         minRating: 0,
        //         readOnly:false,
        //         callback: function(rating) {
        //             $scope.ratingsCallback(rating);
        //         }
        //     };
        //     $scope.ratingsCallback = function(rating) {
        //         $scope.custReview.rating = rating;
        //     };
        //     $scope.custReview ={
        //         review:'',
        //         rating: 0
        //     };
        //
        //     $scope.typeFn = function(val){
        //         $scope.type = val;
        //     };
        //
        //     $ionicModal.fromTemplateUrl('templates/vendor/filter.html', {
        //         scope: $scope,
        //         animation: 'slide-in-up'
        //     }).then(function(modal) {
        //         $scope.filter_screen = modal;
        //     });
        //
        //     $scope.open_filter = function() {
        //         $scope.filter_screen.show();
        //     };
        //
        //     $scope.close_filter = function(){
        //         $scope.filter_screen.hide();
        //
        //     };
        //
        //     $ionicModal.fromTemplateUrl('templates/vendor/filter-location.html', {
        //         scope: $scope,
        //         animation: 'slide-in-up'
        //     }).then(function(modal) {
        //         $scope.location = modal;
        //     });
        //     $scope.open_location = function() {
        //         $ionicLoading.show();
        //         firebase.database().ref('location/' + JSON.parse(window.localStorage['selectedLocation']).cityId).once('value', function (response) {
        //             $scope.location_detail = response.val();
        //             $scope.location.show();
        //             $ionicLoading.hide();
        //         });
        //
        //     };
        //     $scope.close_location = function() {
        //         $scope.location.hide();
        //     };
        //     $scope.smFn = function(value){
        //         $scope.price_range = value;
        //     };
        //     $ionicModal.fromTemplateUrl('templates/vendor/price.html', {
        //         scope: $scope,
        //         animation: 'slide-in-up'
        //     }).then(function(modal) {
        //         $scope.price_modal = modal;
        //     });
        //     $scope.open_price = function(){
        //         $scope.price_modal.show();
        //     };
        //
        //     $scope.close_price = function () {
        //         $scope.price_modal.hide();
        //     };
        //     $scope.price_selected = function (selected_range) {
        //         $scope.min_price = selected_range.min_price;
        //         $scope.max_price = selected_range.max_price;
        //     }
        //
        //     $scope.apply = function () {
        //         // $ionicLoading.show();
        //         for(var i =0;i<$scope.amenities.length;i++){
        //             if($scope.amenities[i].selected == true){
        //                 $scope.final_amenity.push($scope.amenities[i].name);
        //             }
        //         }
        //         var filters = {
        //             price:{
        //                 min:$scope.min_price,
        //                 max:$scope.max_price
        //             },
        //             type: $scope.type,
        //             amenities: $scope.final_amenity,
        //             location: Object.keys($scope.selectedLocation)
        //         }
        //         // var final_query = {
        //         //     'min_price':$scope.min_price,
        //         //     'max_price':$scope.max_price,
        //         //     'amenities': $scope.final_amenity.join(),
        //         //     'service_type': $scope.type,
        //         //     'location':Object.keys($scope.selectedLocation).join(),
        //         //     'rating':$scope.custReview.rating
        //         // };
        //         console.log("filter object",JSON.stringify(filters))
        //         // $http.post("http://139.162.31.204/filter_results?user_id="+$scope.uid+
        //         //     "&vendor_type="+final_query.service_type+
        //         //     "&price_range_min="+final_query.min_price+
        //         //     "&price_range_max="+final_query.max_price+"&rating="+final_query.rating+
        //         //     "&locations="+final_query.location+"&facilities="+final_query.amenities)
        //         //     .then(function (response) {
        //         //         $scope.vendorList = response.data.filtered_results;
        //         //         if($scope.vendorList.length == 0){
        //         //             $cordovaToast
        //         //                 .show('No vendors available for selected services. Please select again.', 'long', 'center')
        //         //                 .then(function(success) {
        //         //                     // success
        //         //                 }, function (error) {
        //         //                     // error
        //         //                 });
        //         //             $ionicLoading.hide();
        //         //         }
        //         //         $scope.filter_screen.hide();
        //         //         $ionicLoading.hide();
        //         //     });
        //     };
        //     $scope.refresh = function(){
        //         $ionicLoading.show();
        //         $rootScope.$broadcast('refresh', { message: 'vendor list changed' });
        //         $scope.filter_screen.hide();
        //         $scope.price_range = 1;
        //         $scope.amenities = [];
        //         $scope.type = '';
        //         $scope.selectedLocation = [];
        //         $scope.custReview = {};
        //         $ionicLoading.hide();
        //     };
        // }
        //  $scope.vendor_info();
    });