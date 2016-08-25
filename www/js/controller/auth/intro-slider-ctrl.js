app.controller('IntroSliderCtrl', ['$scope', '$ionicSlideBoxDelegate', '$state', '$ionicLoading', '$interval','$timeout',
    function($scope, $ionicSlideBoxDelegate, $state, $ionicLoading, $interval,$timeout) {

    $scope.pager = true;
    var count = 0;
    var location = {};

    var hasLocation = checkLocalStorage('selectedLocation');
    if (hasLocation) {
        location = JSON.parse(window.localStorage['selectedLocation']);
    } else {
        location = {
            cityId:"-KOe8n_TOSKc29trcGJh",
            cityName: "Gurgaon",
            country: "India",
            latitude: 28.4595,
            locationId: "-KOe9LJSgmcLJx5GzaRJ",
            locationName: "Sohna Road",
            longitude: 77.0266,
            state: "Haryana",
            zoneId: "-KOe9DIxKASx33GdHx1P",
            zoneName: "Sohna Road"
        }
        window.localStorage['selectedLocation'] = JSON.stringify(location);
    }

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
        if ($ionicSlideBoxDelegate.currentIndex() == 5){
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
