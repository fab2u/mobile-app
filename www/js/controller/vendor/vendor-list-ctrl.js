app.controller('VendorListCtrl',
    function ($scope, $ionicHistory, $state, $stateParams, $ionicLoading, $http,$rootScope,
              $cordovaGeolocation,$ionicModal,$ionicPopover,$rootScope,$cordovaToast) {

        $scope.gender = '';
        $scope.vendorList = '';
        var locationInfo = JSON.parse(window.localStorage['selectedLocation']);
        $scope.lat = locationInfo.latitude;
        $scope.long = locationInfo.longitude;
        $scope.min_price = '';
        $scope.max_price = '';

        $scope.price_list = [
            {
                min_price:1,
                max_price:10000
            },
            {
                min_price:10001,
                max_price:25000
            },
            {
                min_price:25001,
                max_price:50000
            },
            {
                min_price:50001,
                max_price:75000
            },
            {
                min_price:75001,
                max_price:100000
            },
            {
                min_price:100001,
                max_price:125000
            },
            {
                min_price:125001,
                max_price:150000
            },
            {
                min_price:150001,
                max_price:175000
            },
            {
                min_price:175001,
                max_price:200000
            }
        ];
        $scope.vendor_info = function(){
            $scope.serviceIds = [];
            var serviceId = window.localStorage.getItem("serviceId");
            if (localStorage.getItem('uid') == '' || localStorage.getItem('uid') == null || localStorage.getItem('uid') == undefined) {
                $scope.uid = '1';
            }
            else {
                $scope.uid = localStorage.getItem('uid');
            }
            if (localStorage.getItem('catItems')) {
                angular.forEach(JSON.parse(localStorage.getItem('catItems')), function (value, key) {
                    $scope.serviceIds.push(value.id);
                })
            }

            $scope.vendorList = function () {
                $ionicLoading.show();
                if ($scope.serviceIds.length > 0) {
                    var serviceIdList = $scope.serviceIds.join();
                    $http.post("http://139.162.31.204/search_services?services=" + $scope.serviceIds +
                        "&user_id=" + $scope.uid + "&user_city=" + locationInfo.cityId + "&user_gender=''&user_lat=" + $scope.lat + "&user_lon=" + $scope.long)
                        .then(function (response) {
                            $scope.vendorList = response.data.results;
                            if($scope.vendorList.length == 0){
                                $cordovaToast
                                    .show('No vendors available for selected services. Please select again.', 'long', 'center')
                                    .then(function(success) {
                                        // success
                                    }, function (error) {
                                        // error
                                    });

                            }
                            console.log("list", JSON.stringify($scope.vendorList, null, 2))
                            $ionicLoading.hide();
                        });
                }
                else if (serviceId) {
                    $http.post("http://139.162.31.204/search_services?services=" + serviceId +
                        "&user_id=" + $scope.uid + "&user_city=" + locationInfo.cityId + "&user_gender=''&user_lat=" + $scope.lat + "&user_lon=" + $scope.long)
                        .then(function (response) {
                            $scope.vendorList = response.data.results;
                            if($scope.vendorList.length == 0){
                                $cordovaToast
                                    .show('No vendors available for selected services. Please select again.', 'long', 'center')
                                    .then(function(success) {
                                        // success
                                    }, function (error) {
                                        // error
                                    });

                            }
                            $ionicLoading.hide();
                        });

                }
                else {
                    $http.post("http://139.162.31.204/get_vendors?user_id=" + $scope.uid +
                        "&user_city=" + locationInfo.cityId + "&user_gender=''&user_lat=" + $scope.lat + "&user_lon=" + $scope.long)
                        .then(function (response) {
                            $scope.vendorList = response.data.results;
                            if($scope.vendorList.length == 0){
                                $cordovaToast
                                    .show('No vendors available for selected services. Please select again.', 'long', 'center')
                                    .then(function(success) {
                                        // success
                                    }, function (error) {
                                        // error
                                    });

                            }

                            console.log("discover salons", JSON.stringify($scope.vendorList, null, 2))
                            $ionicLoading.hide();
                        });
                }
            };
            $scope.vendorList();
            $rootScope.$on('refresh', function (event, args) {
                location.reload()
            });

            ////////      Map for a particular vendor   //////////////////


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

            // $scope.rating = 3;
            function defaultColor() {
                male.classList.add('is-active');
                female.classList.remove('is-active');
            }

            defaultColor();
            $scope.toggleColor = function () {
                $ionicLoading.show();
                var female = document.getElementById('female');
                var male = document.getElementById('male');
                if (male.classList.contains('is-active')) {
                    male.classList.remove('is-active');
                    female.classList.add('is-active');
                    $scope.gender = 'male';

                    if ($scope.serviceIds.length > 0) {
                        var serviceIdList = $scope.serviceIds.join();
                        $http.post("http://139.162.31.204/search_services?services=" + $scope.serviceIds +
                            "&user_id=" + $scope.uid + "&user_city=" + locationInfo.cityId + "&user_gender='1'&user_lat=" + $scope.lat + "&user_lon=" + $scope.long)
                            .then(function (response) {
                                $scope.vendorList = response.data.results;
                                if($scope.vendorList.length == 0){
                                    $cordovaToast
                                        .show('No vendors available for selected services. Please select again.', 'long', 'center')
                                        .then(function(success) {
                                            // success
                                        }, function (error) {
                                            // error
                                        });

                                }
                                $ionicLoading.hide();
                                console.log(JSON.stringify($scope.vendorList, null, 2));
                            });
                    }
                    else if (serviceId) {
                        $http.post("http://139.162.31.204/search_services?services=" + serviceId +
                            "&user_id=" + $scope.uid + "&user_city=" + locationInfo.cityId + "&user_gender='1'&user_lat=" + $scope.lat + "&user_lon=" + $scope.long)
                            .then(function (response) {
                                $scope.vendorList = response.data.results;
                                if($scope.vendorList.length == 0){
                                    $cordovaToast
                                        .show('No vendors available for selected services. Please select again.', 'long', 'center')
                                        .then(function(success) {
                                            // success
                                        }, function (error) {
                                            // error
                                        });

                                }
                                $ionicLoading.hide();
                                console.log(JSON.stringify($scope.vendorList, null, 2));

                            });
                    }
                    else {
                        $http.post("http://139.162.31.204/get_vendors?user_id=" + $scope.uid + "&user_city=" + locationInfo.cityId +
                            "&user_gender='1'&user_lat=" + $scope.lat + "&user_lon=" + $scope.long)
                            .then(function (response) {
                                $scope.vendorList = response.data.results;
                                if($scope.vendorList.length == 0){
                                    $cordovaToast
                                        .show('No vendors available for selected services. Please select again.', 'long', 'center')
                                        .then(function(success) {
                                            // success
                                        }, function (error) {
                                            // error
                                        });

                                }
                                $ionicLoading.hide();
                                console.log(JSON.stringify($scope.vendorList, null, 2));

                            });
                    }

                }
                else {
                    male.classList.add('is-active');
                    female.classList.remove('is-active');
                    $scope.gender = 'female';
                    if ($scope.serviceIds.length > 0) {
                        var serviceIdList = $scope.serviceIds.join();
                        $http.post("http://139.162.31.204/search_services?services=" + $scope.serviceIds +
                            "&user_id=" + $scope.uid + "&user_city=" + locationInfo.cityId + "&user_gender='2'&user_lat=" + $scope.lat + "&user_lon=" + $scope.long)
                            .then(function (response) {
                                $scope.vendorList = response.data.results;
                                if($scope.vendorList.length == 0){
                                    $cordovaToast
                                        .show('No vendors available for selected services. Please select again.', 'long', 'center')
                                        .then(function(success) {
                                            // success
                                        }, function (error) {
                                            // error
                                        });

                                }
                                $ionicLoading.hide();
                                console.log(JSON.stringify($scope.vendorList, null, 2));
                            });
                    }
                    else if (serviceId) {
                        $http.post("http://139.162.31.204/search_services?services=" + serviceId +
                            "&user_id=" + $scope.uid + "&user_city=" + locationInfo.cityId + "&user_gender='2'&user_lat=" + $scope.lat + "&user_lon=" + $scope.long)
                            .then(function (response) {
                                $scope.vendorList = response.data.results;
                                if($scope.vendorList.length == 0){
                                    $cordovaToast
                                        .show('No vendors available for selected services. Please select again.', 'long', 'center')
                                        .then(function(success) {
                                            // success
                                        }, function (error) {
                                            // error
                                        });

                                }
                                $ionicLoading.hide();
                                console.log(JSON.stringify($scope.vendorList, null, 2));
                            });
                    }
                    else {
                        $http.post("http://139.162.31.204/get_vendors?user_id=" + $scope.uid + "&user_city=" + locationInfo.cityId +
                            "&user_gender='2'&user_lat=" + $scope.lat + "&user_lon=" + $scope.long)
                            .then(function (response) {
                                $scope.vendorList = response.data.results;
                                if($scope.vendorList.length == 0){
                                    $cordovaToast
                                        .show('No vendors available for selected services. Please select again.', 'long', 'center')
                                        .then(function(success) {
                                            // success
                                        }, function (error) {
                                            // error
                                        });

                                }
                                $ionicLoading.hide();
                                console.log(JSON.stringify($scope.vendorList, null, 2));

                            });
                    }
                }
            };

            $scope.starRating = function (rating) {
                return new Array(rating);   //ng-repeat will run as many times as size of array
            };

            $scope.vendor_menu = function (id) {
                delete window.localStorage.slectedItems;
                // delete window.localStorage.catItems;
                delete window.localStorage.BegItems;
                if (localStorage.getItem('catItems')) {
                    $state.go('vendorSelectedMenu', {vendor_id: id});
                }
                else {
                    $state.go('vendorMenu', {vendor_id: id});
                }
            };
            $scope.multipleAddressMapView = function () {
                $state.go('mapMultiple')
            };

            $scope.filterScreen = function () {
                $state.go('filter');
            };


            ////////////////////////  Sorting functionality  //////////////////////////////

            $ionicPopover.fromTemplateUrl('templates/popover.html', {
                scope: $scope,
            }).then(function (popover) {
                $scope.popover = popover;
            });

            $scope.closePopover = function () {
                $scope.popover.hide();
            };
            $scope.sortVendors = function(sortby) {
                $ionicLoading.show();
                if(sortby == 'distance'){
                    $http.post("http://139.162.31.204/sort_results?user_id=" + $scope.uid + "&key="+sortby)
                        .then(function (response) {
                            $scope.vendorList = response.data.sorted_results;
                            if($scope.vendorList.length == 0){
                                $cordovaToast
                                    .show('No vendors available for selected services. Please select again.', 'long', 'center')
                                    .then(function(success) {
                                        // success
                                    }, function (error) {
                                        // error
                                    });

                            }
                            $ionicLoading.hide();
                            console.log(JSON.stringify($scope.vendorList, null, 2));
                        });
                }
                else{
                    $http.post("http://139.162.31.204/sort_results?user_id=" + $scope.uid + "&key=price&order="+sortby)
                        .then(function (response) {
                            $scope.vendorList = response.data.sorted_results;
                            if($scope.vendorList.length == 0){
                                $cordovaToast
                                    .show('No vendors available for selected services. Please select again.', 'long', 'center')
                                    .then(function(success) {
                                        // success
                                    }, function (error) {
                                        // error
                                    });

                            }
                            $ionicLoading.hide();
                            console.log(JSON.stringify($scope.vendorList, null, 2));
                        });
                }

            };



            ///////////////// Filter screen and their functionality   /////////////////////////////


            $scope.price_range = 1;
            $scope.range = 1;
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
                console.log("selected Location options :",$scope.selectedLocation);
            };

            $scope.ratingsObject = {
                iconOn: 'ion-ios-star',
                iconOff: 'ion-ios-star-outline',
                iconOnColor: '#ffd11a',
                iconOffColor: '#b38f00',
                rating: 0,
                minRating: 0,
                readOnly:false,
                callback: function(rating) {
                    $scope.ratingsCallback(rating);
                }
            };
            $scope.ratingsCallback = function(rating) {
                $scope.custReview.rating = rating;
            };
            $scope.custReview ={
                review:'',
                rating: 0
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
                    console.log("location",JSON.stringify($scope.location_detail,null,2))
                    $scope.location.show();
                    $ionicLoading.hide();
                });

            };
            $scope.close_location = function() {
                $scope.location.hide();
            };
            $scope.smFn = function(value){
                $scope.price_range = value;
            };
            $ionicModal.fromTemplateUrl('templates/vendor/price.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.price_modal = modal;
            });
            $scope.open_price = function(){
                $scope.price_modal.show();
            };

            $scope.close_price = function () {
                $scope.price_modal.hide();
            };
            $scope.price_selected = function (selected_range) {
                $scope.min_price = selected_range.min_price;
                $scope.max_price = selected_range.max_price;
            }

            $scope.apply = function () {
                $ionicLoading.show();
                for(var i =0;i<$scope.amenities.length;i++){
                    if($scope.amenities[i].selected == true){
                        $scope.final_amenity.push($scope.amenities[i].name);
                    }
                }
                var final_query = {
                    'min_price':$scope.min_price,
                    'max_price':$scope.max_price,
                    'amenities': $scope.final_amenity.join(),
                    'service_type': $scope.type,
                    'location':Object.keys($scope.selectedLocation).join(),
                    'rating':$scope.custReview.rating
                };
                console.log(final_query);
                $http.post("http://139.162.31.204/filter_results?user_id="+$scope.uid+"&vendor_type="+final_query.service_type+
                    "&price_range_min="+final_query.min_price+"&price_range_max="+final_query.max_price+"&rating="+final_query.rating+
                    "&locations="+final_query.location+"&facilities="+final_query.amenities)
                    .then(function (response) {
                        $scope.vendorList = response.data.filtered_results;
                        if($scope.vendorList.length == 0){
                            $cordovaToast
                                .show('No vendors available for selected services. Please select again.', 'long', 'center')
                                .then(function(success) {
                                    // success
                                }, function (error) {
                                    // error
                                });
                        }
                        console.log("list",JSON.stringify($scope.vendorList,null,2));
                        $scope.filter_screen.hide();
                        $ionicLoading.hide();
                    });
            };
            $scope.refresh = function(){
                $ionicLoading.show();
                $rootScope.$broadcast('refresh', { message: 'vendor list changed' });
                $scope.filter_screen.hide();
                $scope.price_range = 1;
                $scope.amenities = [];
                $scope.type = '';
                $scope.selectedLocation = [];
                $scope.custReview = {};
                $ionicLoading.hide();
            };
        }

            $scope.vendor_info();

    });