app.controller('VendorListCtrl',
    function($scope,$ionicHistory,$state,$stateParams,$ionicLoading,$http){
        $scope.gender = '';


        var locationInfo = JSON.parse(window.localStorage['selectedLocation']);
        $scope.serviceIds = [];
        var serviceId = window.localStorage.getItem("serviceId");
        $scope.service_id = $stateParams.serviceId;
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
            if($scope.serviceIds.length>0){
                var serviceIdList = $scope.serviceIds.join();
                $http.post("http://139.162.31.204/search_services?services="+$scope.serviceIds+
                    "&user_id="+$scope.uid+"&user_city="+locationInfo.cityId+"&user_gender=''&user_lat=''&user_lon=''")
                    .then(function (response) {
                        $scope.vendorList = response.data.results;
                        $ionicLoading.hide();
                        // console.log(JSON.stringify(response));
                    });
            }
            else{
                $http.post("http://139.162.31.204/search_services?services="+serviceId+
                    "&user_id="+$scope.uid+"&user_city="+locationInfo.cityId+"&user_gender=''&user_lat=''&user_lon=''")
                    .then(function (response) {
                        $scope.vendorList = response.data.results;
                        $ionicLoading.hide();
                        console.log(JSON.stringify(response)) ;
                    });
            }

        };
        $scope.vendorList();

        $scope.show = function() {
           $ionicLoading.show({
            template: 'Loading...'
           })
        };
        $scope.show();

    // firebase.database().ref('vendors/'+JSON.parse(window.localStorage['selectedLocation']).cityId).once('value',function(response){
    //     $scope.vendor_list = response.val();
    //     if($scope.vendor_list){
    //         $ionicLoading.hide();
    //     }
    //     else if(!$scope.vendor_list){
    //         $ionicLoading.hide();
    //     }
    // });



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
      var female = document.getElementById('female');
      var male = document.getElementById('male');
      if(male.classList.contains('is-active')) {

        male.classList.remove('is-active');
        female.classList.add('is-active');
          $scope.gender = 'male';

          if($scope.serviceIds.length>0){
              var serviceIdList = $scope.serviceIds.join();
              $http.post("http://139.162.31.204/search_services?services="+$scope.serviceIds+
                  "&user_id="+$scope.uid+"&user_city="+locationInfo.cityId+"&user_gender='1'&user_lat=''&user_lon=''")
                  .then(function (response) {
                      $scope.vendorList = response.data.results;
                      $ionicLoading.hide();
                      console.log(JSON.stringify(response));
                  });
          }
          else{
              console.log("serviceId",serviceId)
              $http.post("http://139.162.31.204/search_services?services="+serviceId+
                  "&user_id="+$scope.uid+"&user_city="+locationInfo.cityId+"&user_gender='1'&user_lat=''&user_lon=''")
                  .then(function (response) {
                      $scope.vendorList = response.data.results;
                      $ionicLoading.hide();
                      console.log(JSON.stringify(response)) ;

                  });
          }

      }
      else {
          console.log("else")
          male.classList.add('is-active');
          female.classList.remove('is-active');
          $scope.gender = 'female';
          if($scope.serviceIds.length>0){
              var serviceIdList = $scope.serviceIds.join();
              $http.post("http://139.162.31.204/search_services?services="+$scope.serviceIds+
                  "&user_id="+$scope.uid+"&user_city="+locationInfo.cityId+"&user_gender='2'&user_lat=''&user_lon=''")
                  .then(function (response) {
                      $scope.vendorList = response.data.results;
                      $ionicLoading.hide();
                      console.log(JSON.stringify(response));
                  });
          }
          else{
              $http.post("http://139.162.31.204/search_services?services="+serviceId+
                  "&user_id="+$scope.uid+"&user_city="+locationInfo.cityId+"&user_gender='2'&user_lat=''&user_lon=''")
                  .then(function (response) {
                      $scope.vendorList = response.data.results;
                      $ionicLoading.hide();
                      console.log(JSON.stringify(response)) ;
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
       $state.go('vendorMenu',{vendor_id:id});
   };
})