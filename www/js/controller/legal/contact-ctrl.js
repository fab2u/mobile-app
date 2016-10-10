app.controller('ContactCtrl', function($state, $scope,$cordovaToast) {
    firebase.database().ref('city').once('value',function(response){
        $scope.location_list = response.val();
    });
    $scope.user = {};

    $scope.query_options = ['HR','Appointment Booking','Marketing','Sales','Payment','Others'];


    $scope.submit_query = function(){
        firebase.database().ref('contactUs').push($scope.user,function (error) {
            if(error){
                $cordovaToast
                    .show('Please try again!', 'long', 'center')
                    .then(function(success) {
                        // success
                    }, function (error) {
                        // error
                    });
            }
            else{
                $cordovaToast
                    .show('Thanks for submitting your query. We will soon get back to you.', 'long', 'center')
                    .then(function(success) {
                        // success
                    }, function (error) {
                        // error
                    });
            }
        });
    };


});