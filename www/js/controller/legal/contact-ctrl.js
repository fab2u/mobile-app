app.controller('ContactCtrl', function($state, $scope) {
    firebase.database().ref('city').once('value',function(response){
        $scope.location_list = response.val();
    });
    $scope.user = {};

    $scope.query_options = ['HR','Appointment Booking','Marketing','Sales','Payment','Others'];


    $scope.submit_query = function(){
        firebase.database().ref('contactUs').push($scope.user,function (error) {
            if(error){
           alert('some thing went wrong');
            }
            else{
           alert('Your query submitted !');
            }
        });
    };


});