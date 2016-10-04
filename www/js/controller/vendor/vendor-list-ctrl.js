app.controller('VendorListCtrl',
    function($scope,$ionicHistory,$state,$stateParams,$ionicLoading,$http,$cordovaGeolocation){
        $scope.gender = '';
        $scope.vendorList = '';
        $scope.lat = '';
        $scope.long = '';
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        function get_user_location() {
            $ionicLoading.show();
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    $scope.lat  = position.coords.latitude
                    $scope.long = position.coords.longitude
                    console.log($scope.lat + '   ' + $scope.long);
                    $scope.vendorList();
                }, function(err) {
                    console.log(JSON.stringify(err));
                    if(typeof cordova.plugins.settings.openSetting != undefined){
                        cordova.plugins.settings.openSetting("location_source", function(){
                                console.log("opened location_source settings");
                                $scope.vendorList();
                            },
                            function(){
                                console.log("failed to open nfc settings")
                            });
                    }
                });
        }
        get_user_location();

        var locationInfo = JSON.parse(window.localStorage['selectedLocation']);
        $scope.serviceIds = [];
        var serviceId = window.localStorage.getItem("serviceId");
        if(localStorage.getItem('uid') == ''||localStorage.getItem('uid') ==null||localStorage.getItem('uid')==undefined){
            $scope.uid = '1';
        }
        else{
            $scope.uid = localStorage.getItem('uid');
        }

        if(localStorage.getItem('catItems')){
            angular.forEach(JSON.parse(localStorage.getItem('catItems')), function(value, key) {
                $scope.serviceIds.push(value.id);
            })
        }

        $scope.vendorList = function(){
            $ionicLoading.show();
            if($scope.lat && $scope.long){
                if($scope.serviceIds.length>0){
                    var serviceIdList = $scope.serviceIds.join();
                    $http.post("http://139.162.31.204/search_services?services="+$scope.serviceIds+
                        "&user_id="+$scope.uid+"&user_city="+locationInfo.cityId+"&user_gender=''&user_lat="+$scope.lat+"&user_lon="+$scope.long)
                        .then(function (response) {
                            $scope.vendorList = response.data.results;
                            // console.log("list",JSON.stringify($scope.vendorList,null,2))
                            $ionicLoading.hide();
                        });
                }
                else if(serviceId){
                    $http.post("http://139.162.31.204/search_services?services="+serviceId+
                        "&user_id="+$scope.uid+"&user_city="+locationInfo.cityId+"&user_gender=''&user_lat="+$scope.lat+"&user_lon="+$scope.long)
                        .then(function (response) {
                            $scope.vendorList = response.data.results;
                            $ionicLoading.hide();
                        });

                }
                else{
                    $http.post("http://139.162.31.204/get_vendors?user_id="+$scope.uid+
                        "&user_city="+locationInfo.cityId+"&user_gender=''&user_lat="+$scope.lat+"&user_lon="+$scope.long)
                        .then(function (response) {
                            $scope.vendorList = response.data.results;

                            console.log("discover salons",JSON.stringify($scope.vendorList ,null,2))
                            $ionicLoading.hide();
                        });
                }
            }
            else{
                get_user_location();
            }
        };
        // $scope.vendorList();

        ////////      Map for a particular vendor   //////////////////


        $scope.open_map = function(latitude,longitude,line1,line2,vendorName){
            $state.go('map',{
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
      if(male.classList.contains('is-active')) {

        male.classList.remove('is-active');
        female.classList.add('is-active');
          $scope.gender = 'male';

          if($scope.serviceIds.length>0){
              var serviceIdList = $scope.serviceIds.join();
              $http.post("http://139.162.31.204/search_services?services="+$scope.serviceIds+
                  "&user_id="+$scope.uid+"&user_city="+locationInfo.cityId+"&user_gender='1'&user_lat="+$scope.lat+"&user_lon="+$scope.long)
                  .then(function (response) {
                      $scope.vendorList = response.data.results;
                      $ionicLoading.hide();
                      console.log(JSON.stringify($scope.vendorList,null,2));
                  });
          }
          else if(serviceId){
              $http.post("http://139.162.31.204/search_services?services="+serviceId+
                  "&user_id="+$scope.uid+"&user_city="+locationInfo.cityId+"&user_gender='1'&user_lat="+$scope.lat+"&user_lon="+$scope.long)
                  .then(function (response) {
                      $scope.vendorList = response.data.results;
                      $ionicLoading.hide();
                      console.log(JSON.stringify($scope.vendorList,null,2)) ;

                  });
          }
          else{
              $http.post("http://139.162.31.204/get_vendors?user_id="+$scope.uid+"&user_city="+locationInfo.cityId+
                  "&user_gender='1'&user_lat="+$scope.lat+"&user_lon="+$scope.long)
                  .then(function (response) {
                      $scope.vendorList = response.data.results;
                      $ionicLoading.hide();
                      console.log(JSON.stringify($scope.vendorList,null,2)) ;

                  });
          }

      }
      else {
          male.classList.add('is-active');
          female.classList.remove('is-active');
          $scope.gender = 'female';
          if($scope.serviceIds.length>0){
              var serviceIdList = $scope.serviceIds.join();
              $http.post("http://139.162.31.204/search_services?services="+$scope.serviceIds+
                  "&user_id="+$scope.uid+"&user_city="+locationInfo.cityId+"&user_gender='2'&user_lat="+$scope.lat+"&user_lon="+$scope.long)
                  .then(function (response) {
                      $scope.vendorList = response.data.results;
                      $ionicLoading.hide();
                      console.log(JSON.stringify($scope.vendorList,null,2));
                  });
          }
          else if(serviceId){
              $http.post("http://139.162.31.204/search_services?services="+serviceId+
                  "&user_id="+$scope.uid+"&user_city="+locationInfo.cityId+"&user_gender='2'&user_lat="+$scope.lat+"&user_lon="+$scope.long)
                  .then(function (response) {
                      $scope.vendorList = response.data.results;
                      $ionicLoading.hide();
                      console.log(JSON.stringify($scope.vendorList,null,2)) ;
                  });
          }
          else{
              $http.post("http://139.162.31.204/get_vendors?user_id="+$scope.uid+"&user_city="+locationInfo.cityId+
                  "&user_gender='2'&user_lat="+$scope.lat+"&user_lon="+$scope.long)
                  .then(function (response) {
                      $scope.vendorList = response.data.results;
                      $ionicLoading.hide();
                      console.log(JSON.stringify($scope.vendorList,null,2)) ;

                  });
          }
      }
    };

    $scope.starRating = function(rating) {
      return new Array(rating);   //ng-repeat will run as many times as size of array
   };

   $scope.vendor_menu = function(id){
       delete window.localStorage.slectedItems;
       // delete window.localStorage.catItems;
       delete window.localStorage.BegItems;
       if(localStorage.getItem('catItems')){
           $state.go('vendorSelectedMenu',{vendor_id:id});
       }
       else{
           $state.go('vendorMenu',{vendor_id:id});
       }
   };
   $scope.multipleAddressMapView = function(){
     $state.go('mapMultiple')
   };

   $scope.filterScreen = function(){
       $state.go('filter');
   }
});