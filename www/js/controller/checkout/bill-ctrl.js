app.controller('BillCtrl', ['$scope', function($scope){
    $scope.bookingID = "DL67SILJL";
    $scope.venue = "Sohna Road, Gurgaon";
    $scope.address = "St No. 6, Vipul Center";
    $scope.services = [
      {
        name: "Hair Spa"
      },
      {
        name: "Hair Salon"
      },
      {
        name: 'Hair Color'
      }
      ];
    $scope.amount = "300";
    $scope.time = "15:00";
    $scope.date = "17th June 2016"	
}]);