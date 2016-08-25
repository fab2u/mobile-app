app.controller('VendorListCtrl', ['$scope','$ionicHistory','$state', function($scope,$ionicHistory,$state,$stateParams){

    firebase.database().ref('vendors').once('value',function(response){
        angular.forEach(response.val(), function(value, key) {
            $scope.vendor_list = value;
            console.log("aaa", JSON.stringify($scope.vendor_list));

        });
    });



    $scope.backButton = function () {
        $state.go($ionicHistory.backView().stateName);
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
      }
      else {
        male.classList.add('is-active');
        female.classList.remove('is-active');
      }
    };

    $scope.vendors = [
    	{id: '1'},
    	{id: '2'},
    	{id: '3'},
    	{id: '4'},
    	{id: '5'}
    ]

    $scope.starRating = function(rating) {
      return new Array(rating);   //ng-repeat will run as many times as size of array
   };

   $scope.vendor_detail = function(id){
       $state.go('vendorDetails',{'vendor_id':id});
   }
}]);