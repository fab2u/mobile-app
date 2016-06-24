// Edit By Deepank
app.controller("userFeedCtrl", ['$scope', '$timeout', '$stateParams', function($scope, $timeout, $stateParams){
   console.log('userFeed');

   $scope.email = window.localStorage.email;
   $scope.img_hash = md5($scope.email);
   jdenticon.update("#identicon", $scope.img_hash);
   var uid = window.localStorage.uid;
   var ref = db.ref("users/data/"+uid);
   console.log(ref);
   ref.on("value", function(snapshot){
      console.log(snapshot.val());
   });
}]);
