app.controller('IntroSliderCtrl',
    function($scope, $ionicSlideBoxDelegate, $state, $ionicLoading, $interval,$timeout,$cordovaDevice,$ionicHistory) {



        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
        $ionicLoading.show();
        localStorage.clear();

        var appInfo = {};
        var location = {};

        checkAppInfo();

        function checkAppInfo() {
            var hasAppInfo = checkLocalStorage("appInfo");
            if (!hasAppInfo) {
                initialiseAppInfo();
                initialiseLocation();
            }
            checkAppStatus();
        }

        function checkAppStatus() {
            var checkNewUser = checkLocalStorage('appStatus');
            if (checkNewUser) {
                firebase.database().ref('appStatus').once('value', function(snapshot) {
                    var newStatus = snapshot.val();
                    var currentStatus = JSON.parse(window.localStorage['appStatus']);
                    if (newStatus.live == true) {
                        if (newStatus.version > currentStatus.version) {
                            $ionicLoading.hide();
                            $state.go('app-update');
                        } else {
                            checkLoginStatus();
                        }
                    } else {
                        $ionicLoading.hide();
                        $state.go('under-construction');
                    }
                });
            } else {
                firebase.database().ref('appStatus').once('value', function(snapshot) {
                    var newStatus = snapshot.val();
                    if (newStatus.live == false) {
                        $ionicLoading.hide();
                        $state.go('under-construction');
                    } else {
                        $ionicLoading.hide();
                        $state.go('intro-slider');
                    }
                });
            }
        }

        function checkLoginStatus() {
            var checkLogin = checkLocalStorage('userUid');
            if (checkLogin) {
                $ionicLoading.hide();
                $state.go('app.home');
            } else {
                $ionicLoading.hide();
                $state.go('app.home');
                // $state.go('signup')
            }
        }

        function initialiseAppInfo() {
            try {
                var date = new Date();
                var currTimeStamp = date.getTime();
                appInfo = {
                    udid: '',
                    uuid: currTimeStamp,
                    os: '',
                    platform: '',
                    version: '',
                    model: '',
                    manufacture: '',
                    deviceToken: 0,
                    error: null,
                    device: null,
                    timeStamp: currTimeStamp
                };
            } catch (e) {}
            registerDevice();
        }

        function registerDevice() {
            if (window.cordova) {
                try {
                    var deviceInformation = $cordovaDevice.getDevice();
                    appInfo.udid = deviceInformation.serial;
                    appInfo.uuid = deviceInformation.uuid;
                    appInfo.os = "1";
                    appInfo.platform = deviceInformation.platform;
                    appInfo.version = deviceInformation.version;
                    appInfo.model = deviceInformation.model;
                    appInfo.manufacture = deviceInformation.manufacturer;
                    appInfo.device = "cordova";
                    firebase.database().ref('deviceInformation/Registered/' + appInfo.uuid).update(appInfo).then(function() {});

                } catch (e) {
                    console.log("error",e.message);
                    appInfo.error = e.message;
                    appInfo.device = "notCordova";
                    var newPostKey = firebase.database().ref().child('deviceInformation').push().key;
                    firebase.database().ref('deviceInformation/notRegistered/' + newPostKey).update(appInfo).then(function() {});
                };
                window.localStorage['appInfo'] = JSON.stringify(appInfo);
            } else {
                appInfo.device = "notCordova";
                appInfo.error = "not cordova";
                var newPostKey = firebase.database().ref().child('deviceInformation').push().key;
                firebase.database().ref('deviceInformation/notRegistered/' + newPostKey).update(appInfo).then(function() {});
                window.localStorage['appInfo'] = JSON.stringify(appInfo);
            }
        }

        function initialiseLocation() {
            try {
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
            } catch (e) {}
            window.localStorage['selectedLocation'] = JSON.stringify(location);
        }



        $scope.pager = true;
    var count = 0;
    // var location = {};
    //
    // var hasLocation = checkLocalStorage('selectedLocation');
    // if (hasLocation) {
    //     location = JSON.parse(window.localStorage['selectedLocation']);
    // } else {
    //     location = {
    //         cityId:"-KOe8n_TOSKc29trcGJh",
    //         cityName: "Gurgaon",
    //         country: "India",
    //         latitude: 28.4595,
    //         locationId: "-KOe9LJSgmcLJx5GzaRJ",
    //         locationName: "Sohna Road",
    //         longitude: 77.0266,
    //         state: "Haryana",
    //         zoneId: "-KOe9DIxKASx33GdHx1P",
    //         zoneName: "Sohna Road"
    //     }
    //     window.localStorage['selectedLocation'] = JSON.stringify(location);
    // }
    //

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
});
