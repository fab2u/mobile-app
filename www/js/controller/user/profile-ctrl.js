// Edit By Deepank
app.controller("profileCtrl", ['$scope', '$timeout', function($scope, $timeout){
   $scope.uid = window.localStorage.uid;
   console.log($scope.uid);
   // $scope.email = window.localStorage.email;
   $scope.img_hash = md5($scope.uid);
   jdenticon.update("#identicon", $scope.img_hash);
   var uid = window.localStorage.uid;
   var ref = db.ref("users/data/"+uid);
   console.log(ref);
   ref.on("value", function(snapshot){
      console.log(snapshot.val());
   });
}]);
