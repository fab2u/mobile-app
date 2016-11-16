app.controller('IntroSliderCtrl', function($scope, $ionicSlideBoxDelegate,
                                           $state, $ionicLoading, $interval,$timeout) {

    $scope.pager = true;
    var location = {};
     $ionicLoading.show();
     $timeout(function () {
            $ionicLoading.hide();
     }, 1000);

    var hasLocation = checkLocalStorage('selectedLocation');
    if (hasLocation) {
        location = JSON.parse(window.localStorage['selectedLocation']);
    } else {
        db.ref('defaultLocation').once('value', function (snapshot) {
            setLocation(snapshot.val());
        });
    }
    function setLocation(locationInfo){
       console.log("locationInfo",locationInfo);
       window.localStorage['selectedLocation'] = JSON.stringify(locationInfo);
    }

    function updateLocalData() {
        db.ref('appStatus').once('value', function(snapshot) {
            updateAppStatus(snapshot.val());
        });
    };
    updateLocalData();


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
        $scope.pager = false;
        $ionicLoading.show();
        window.localStorage.setItem('SkipIntro','true');
        $timeout( function() {
            $ionicLoading.hide();
            $state.go('location');
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
                 $ionicLoading.hide();
                    $interval.cancel(stop);
                    $state.go('location');
            }, 200);
        }
    }
});
