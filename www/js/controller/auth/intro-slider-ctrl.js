app.controller('IntroSliderCtrl', ['$scope', '$ionicSlideBoxDelegate', '$state', '$ionicLoading', '$interval','$timeout',
    function($scope, $ionicSlideBoxDelegate, $state, $ionicLoading, $interval,$timeout) {

    $scope.pager = true;
    var count = 0;
    var location = {};

    var hasLocation = checkLocalStorage('selectedLocation');

        var geocodingAPI = "https://maps.googleapis.com/maps/api/geocode/json?latlng=28.4595,77.0266&key=AIzaSyDZl-Y8k4IYZFGdP77PhLix8kdaMpUzM7k";

        $.getJSON(geocodingAPI, function (json) {
            if (json.status == "OK") {
                //Check result 0
                var result = json.results[0];
                //look for locality tag and administrative_area_level_1
                var city = "";
                var state = "";
                for (var i = 0, len = result.address_components.length; i < len; i++) {
                    var ac = result.address_components[i];
                    if (ac.types.indexOf("administrative_area_level_1") >= 0) state = ac.short_name;
                    if (ac.types.indexOf("administrative_area_level_2") >= 0) city = ac.short_name;
                }
                if (state != '' && city != '') {
                    firebase.database().ref('city').once('value',function(response){
                        $scope.location_list = response.val();
                        console.log("losss",JSON.stringify($scope.location_list,null,2));
                        angular.forEach($scope.location_list,function (value,key) {
                            if(value.cityName == city){
                                console.log("iddd")
                                console.log("value",value)
                                if (hasLocation) {
                                    location = JSON.parse(window.localStorage['selectedLocation']);
                                } else {
                                    location = {
                                        cityId:value.cityId,
                                        cityName: city,
                                        country: value.country,
                                        latitude: 28.4595,
                                        locationId: "-KOe9LJSgmcLJx5GzaRJ",
                                        locationName: "Sohna Road",
                                        longitude: 77.0266,
                                        state: state,
                                        zoneId: "",
                                        zoneName: ""
                                    }
                                    window.localStorage['selectedLocation'] = JSON.stringify(location);
                                }
                            }
                        })
                    });
                    console.log("Hello to you out there in " + city + ", " + state + "!");
                }
            }

        });

    updateLocalData();

    function updateLocalData() {
        db.ref('appStatus').once('value', function(snapshot) {
            updateAppStatus(snapshot.val());
            // updateLocationData();
            // updateNearbyData();
            // updateProjectData();
        });
    };


    // function updateLocationData() {
    //     db.ref('location/' + location.cityId).once('value', function(data) {
    //         window.localStorage['allLocations'] = JSON.stringify(data.val());
    //         count = count + 1;
    //     })
    // }

    // function updateNearbyData() {
    //     db.ref('nearby/' + location.cityId).once('value', function(data) {
    //         window.localStorage['allnearbyLocations'] = JSON.stringify(data.val());
    //         count = count + 1;
    //     });

    //     db.ref('nearbyDistance/' + location.cityId).once('value', function(data2) {
    //         window.localStorage['allnearbyDistances'] = JSON.stringify(data2.val());
    //         count = count + 1;
    //     });
    // }

    // function updateProjectData() {
    //     db.ref('projects/' + location.cityId + '/residential').once('value', function(data) {
    //         window.localStorage['allProjectsData'] = JSON.stringify(data.val());
    //         count = count + 1;
    //     });

    //     db.ref('projectDisplayData/' + location.cityId + '/residential').once('value', function(data2) {
    //         window.localStorage['allDisplayData'] = JSON.stringify(data2.val());
    //         count = count + 1;
    //     });
    // }



    function updateAppStatus(newData) {
        var appStatus = {
            live: '',
            version: 1
        }
        appStatus.live = newData.live;
        appStatus.version = newData.version;
        window.localStorage['appStatus'] = JSON.stringify(appStatus);
    }

    $scope.skipSlide = function() {
        // $ionicSlideBoxDelegate.slide(5);
        // $scope.pager = false;
        // $ionicSlideBoxDelegate.update();
        // $ionicLoading.show();
        // stop = $interval(function() {
        //     window.localStorage.setItem('SkipIntro','true');
        //     $ionicLoading.hide();
        //     $interval.cancel(stop);
        //     $state.go('app.home');
        //     // }
        // }, 200);
        $scope.pager = false;
        $ionicLoading.show();
        window.localStorage.setItem('SkipIntro','true');
        $timeout( function() {
            $ionicLoading.hide();
            $state.go('app.home');
        },500);
    };

    $scope.nextSlide = function() {
            $ionicSlideBoxDelegate.next();
    };

    $scope.slideChanged = function() {
        if ($ionicSlideBoxDelegate.currentIndex() == 3){
            $scope.pager = false;
            $ionicSlideBoxDelegate.update();
            $ionicLoading.show();
            stop = $interval(function() {
                window.localStorage.setItem('SkipIntro','true');

                // if (count == 5) {
                    $ionicLoading.hide();
                    $interval.cancel(stop);
                    $state.go('app.home');
                // }
            }, 200);
        }
    }
}]);
