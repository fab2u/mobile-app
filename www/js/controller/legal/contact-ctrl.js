app.controller('ContactCtrl', function($state, $scope,$cordovaToast,$timeout,$ionicLoading) {

    $scope.show = function() {
        $ionicLoading.show();
    };
    $scope.show();
    $timeout(function () {
        $ionicLoading.hide();
    }, 5000);

     function locationOptions() {
         $ionicLoading.show();
         firebase.database().ref('city').once('value',function(response){
            $scope.location_list = response.val();
             $ionicLoading.hide();
         });
     }
     locationOptions();
    $scope.user = {};

    $scope.query_options = ['HR','Appointment Booking','Marketing','Sales','Payment','Others'];


    $scope.submit_query = function(){
        $ionicLoading.show();
        firebase.database().ref('contactUs').push($scope.user,function (error) {
            if(error){
                $ionicLoading.hide();
                $scope.user = {};
                $cordovaToast
                    .show('Please try again!', 'long', 'center')
                    .then(function(success) {
                        // success
                    }, function (error) {
                        // error
                    });
            }
            else{
                $ionicLoading.hide();
                $scope.user = {};
                $cordovaToast
                    .show('Thanks for submitting your query. We will soon get back to you.', 'long', 'center')
                    .then(function(success) {
                        // success
                    }, function (error) {
                        // error
                    });
                $state.go('app.home')
            }
        });
    };


});