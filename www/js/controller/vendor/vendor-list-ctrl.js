app.controller('VendorListCtrl',
    function ($scope, $q, $timeout, $ionicHistory, $state, $stateParams, $ionicLoading, $http
        , $ionicModal, $ionicPopover, $rootScope, $cordovaToast) {

        $scope.gender = 'female';
        $scope.genSelected = false;
        $scope.serviceIds = [];
        $scope.vendorList = [];
        $scope.isDisabled = false;
        $scope.limit= 7;

        $scope.sortValue = 'distance';
        var locationInfo = JSON.parse(window.localStorage['selectedLocation']);
        var cityId = locationInfo.cityId;
        $scope.lat = locationInfo.latitude;
        $scope.long = locationInfo.longitude;

        var hasVendorFilter = checkLocalStorage('vendorsFilter');

        if (hasVendorFilter) {
            $scope.vendorsDetail = JSON.parse(window.localStorage['vendorsFilter'])
        }

        $scope.vendorIds = [];
        console.log($scope.vendorsDetail);
        function vendorDetailForServiceId(vId){
            return $scope.vendorsDetail[vId];
        }

        if($stateParams.vendorPage == 'discoverSalons'){
            $scope.vendorNames = JSON.parse(window.localStorage['vendorsName']);
            window.localStorage['pageName'] = 'discoverSalons'
        }
        if($stateParams.vendorPage == 'serviceList'){
            $scope.VendorServiceListIds = JSON.parse(window.localStorage['VendorServiceListIds']);
            window.localStorage['pageName'] = 'serviceList'
        }

        var vendorList1 = [];
        if($scope.VendorServiceListIds){
            for (index in $scope.VendorServiceListIds){
                vendorList1.push(vendorDetailForServiceId($scope.VendorServiceListIds[index]));
            }
            $scope.vendorsDetail1 = vendorList1;
        }



        ////////////////////////  Sorting functionality  //////////////////////////////

        $ionicPopover.fromTemplateUrl('templates/popover.html', {
            scope: $scope,
        }).then(function (popover) {
            $scope.popover = popover;
        });

        $scope.closePopover = function () {
            $scope.popover.hide();
        };

        $scope.closePopover = function () {
            $scope.popover.hide();
        };



        function load_vendors(vendorId) {
            for (key in $scope.vendorsDetail) {
                if ((key == vendorId) && (key != 'version')) {
                    $scope.vendorList.push($scope.vendorsDetail[key]);
                    $scope.vendorIds.push(key)
                }
            }
        }


        function getAllVendors() {
            firebase.database().ref('vendorFilters/' + locationInfo.cityId).once('value').then(function (res) {
                var vendorDetail = res.val();
                var version = res.val().version;

                for (key in vendorDetail) {
                    if (key != 'version') {
                        var distance = get_distance($scope.lat, $scope.long, vendorDetail[key].address.latitude, vendorDetail[key].address.longitude)
                        vendorDetail[key].distance = distance;
                    }
                }
                window.localStorage['vendorsFilter'] = JSON.stringify(vendorDetail)
                window.localStorage['vendorsListFilter'] = version;
                $scope.vendorsDetail = JSON.parse(window.localStorage['vendorsFilter'])
            })
        }

        if (!hasVendorFilter) {
            getAllVendors()
        }
        else {
            firebase.database().ref('vendorFilters/' + locationInfo.cityId + '/version').once('value', function (res) {
                var newVersion = res.val()
                if (window.localStorage['vendorsListFilter'] < newVersion) {
                    getAllVendors()
                }
            })
        }
        if($scope.vendorNames){
            for (key in $scope.vendorNames) {
                load_vendors($scope.vendorNames[key].vid)
            }
        }
        if($scope.VendorServiceListIds){
            for (key in $scope.VendorServiceListIds) {
                var id = $scope.VendorServiceListIds[key]
                load_vendors(id)
            }
        }

        var filters = {}

        function get_distance(latitude1, longitude1, latitude2, longitude2, units) {
            var p = 0.017453292519943295;    //This is  Math.PI / 180
            var c = Math.cos;
            var a = 0.5 - c((latitude2 - latitude1) * p) / 2 +
                c(latitude1 * p) * c(latitude2 * p) *
                (1 - c((longitude2 - longitude1) * p)) / 2;
            var R = 6371; //  Earth distance in km so it will return the distance in km
            $scope.dist = Math.round(2 * R * Math.asin(Math.sqrt(a)));
            return $scope.dist;
        }


        function start_filtering(filters) {
            if ($scope.vendorsDetail.length == 0) {
                $cordovaToast
                    .show('No,vendor found for selected criteria.', 'long', 'center')
                    .then(function(success) {
                        // success
                    }, function (error) {
                        // error
                    });
                  }
                else {
                $scope.vendorList = [];
                if($scope.vendorsDetail1){
                    var response = $scope.vendorsDetail1;
                }
                else if(!$scope.vendorsDetail1){
                    var response = $scope.vendorsDetail;
                }
                var allVendorKeys = Object.keys(response);
                var obtainedVendorIds = $scope.vendorIds;
                for (key in obtainedVendorIds) {
                    if (_.contains(allVendorKeys, obtainedVendorIds[key])) {
                        response[obtainedVendorIds[key]].show = true;
                    }
                }
                if (filters.type) {
                    for (key in response) {
                        if (response[key].vendorType === filters.type) {
                            response[key].show = true;
                        } else {
                            response[key].show = false;
                        }
                    }
                }
                if (filters.gender) {
                    for (key in response) {
                        if ((response[key].gender == filters.gender) || (response[key].gender == 'unisex')) {
                            response[key].show = true;
                        } else {
                            response[key].show = false;
                        }
                    }

                }
                if (filters.amenities.length > 0) {
                    for (key in response) {
                        if (response[key].show) {
                            if (response[key].amenities) {
                                var setA = Object.keys(response[key].amenities);
                                var setB = filters.amenities;
                                var setC = _.intersection(setA, setB);
                                // console.log(setA, setB);
                                if (setB.length != setC.length) {
                                    response[key].show = false;
                                }
                            }

                        }
                    }
                }
                if (filters.location.length > 0) {
                    for (key in response) {
                        if (response[key].show) {
                            var setX = response[key].address.locationId;
                            var setY = filters.location;
                            console.log(setX);
                            console.log(setY);
                            if (!_.contains(setY, setX)) {
                                response[key].show = false;
                            }
                        }
                    }
                }
                for (key in response) {
                    if (response[key].show) {
                        $scope.vendorList.push(response[key])
                    } else {
                        console.log("inside else");
                    }
                }
            }
            console.log("final list", $scope.vendorList)

        }

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


        $scope.typeFn = function (val) {
            $scope.type = val;
        };

        $ionicModal.fromTemplateUrl('templates/vendor/filter.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.filter_screen = modal;
        });

        $scope.open_filter = function () {
            $scope.filter_screen.show();
        };

        $scope.close_filter = function () {
            $scope.filter_screen.hide();

        };

        $ionicModal.fromTemplateUrl('templates/vendor/filter-location.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.location = modal;
        });
        $scope.open_location = function () {
            $ionicLoading.show();
            firebase.database().ref('location/' + JSON.parse(window.localStorage['selectedLocation']).cityId).once('value', function (response) {
                $scope.location_detail = response.val();
                $scope.location.show();
                $ionicLoading.hide();
            });
            $timeout(function () {
                $ionicLoading.hide();
            }, 200);
        };
        $scope.close_location = function () {
            $scope.location.hide();
        };

        $scope.final_amenity = [];
        $scope.amenities = [
            {
                'name': 'card',
                'selected': false,
                'icon': 'ion-card'
            },
            {
                'name': 'ac',
                'selected': false,
                'icon': 'ion-laptop'
            },
            {
                'name': 'parking',
                'selected': false,
                'icon': 'ion-android-car'
            },
            {
                'name': 'wifi',
                'selected': false,
                'icon': 'ion-wifi'
            }
        ];
        $scope.location = {};
        $scope.selectedLocation = [];
        $scope.isChecked = false;

        $scope.amenity_list = function (val) {
            val.selected = !val.selected;
        };

        $scope.location_selected = function (val, isChecked) {
            if ($scope.selectedLocation[val]) {
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
                location: Object.keys($scope.selectedLocation),
                gender: $scope.gender
            }
            start_filtering(filters);
            $scope.filter_screen.hide();
        }
        $scope.refresh = function () {
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


        $scope.toggleColor = function (val) {
            $ionicLoading.show();

            $timeout(function () {
                $ionicLoading.hide();
            }, 200);
            if (val == 1) {
                $scope.genSelected = true;
                $scope.gender = 'male';
                var filters = {
                    type: $scope.type,
                    amenities: $scope.final_amenity,
                    location: Object.keys($scope.selectedLocation),
                    gender: $scope.gender
                }
                start_filtering(filters);
                $ionicLoading.hide();
            }
            else {
                $scope.genSelected = false;
                $scope.gender = 'female';
                var filters = {
                    type: $scope.type,
                    amenities: $scope.final_amenity,
                    location: Object.keys($scope.selectedLocation),
                    gender: $scope.gender
                }
                start_filtering(filters);
                $ionicLoading.hide();

            }
        };

        $scope.sortVendors = function (val) {
            console.log("val", val)
            $scope.sortValue = val;
        }

        $scope.loadMore = function(){
            $scope.limit = $scope.limit+7;
            var vendorListLength = $scope.vendorList.length;
            if(vendorListLength<$scope.limit){
                $scope.isDisabled = true;
            }
            else{
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
        };

        $scope.vendor_menu = function (id) {
                    delete window.localStorage.slectedItems;
                    delete window.localStorage.BegItems;
                    if (localStorage.getItem('catItems')) {
                        $state.go('vendorSelectedMenu', {vendor_id: id});
                    }
                    else {
                        $state.go('vendorMenu', {vendor_id: id});
                    }
        };


    });