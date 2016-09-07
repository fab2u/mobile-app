// Edit By Deepank
app.controller("profileCtrl", ['$scope', '$timeout', '$ionicLoading', function($scope, $timeout, $ionicLoading){
  $scope.uid = window.localStorage.uid;
  console.log($scope.uid);
  $scope.email = window.localStorage.email;
  // $scope.img_hash = md5($scope.uid);
  // jdenticon.update("#identicon", $scope.img_hash);

  $scope.goBack = function(){
    history.back();
  }

  $ionicLoading.show();

  db.ref("users/data/"+$scope.uid).on("value", function(snapshot){
    $ionicLoading.hide();
    console.log(snapshot.val());
    $scope.userDetails = snapshot.val();
    $scope.userDetails.photoUrl = 'img/person.jpg';
  });
}]);
