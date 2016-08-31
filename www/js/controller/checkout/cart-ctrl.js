app.controller("CartCtrl",function($scope,$rootScope){
  $scope.total_original=0;
  $scope.total_fabtu=0;

    $scope.cartItems = {};
    $scope.cart_item = 0;
    if(localStorage.getItem('BegItems') != null){
        $scope.cartItems = JSON.parse(localStorage.getItem('BegItems'));
        console.log("sonam",JSON.stringify($scope.cartItems));
    }
    $scope.selectedServices = {};

    // Get selected services if previously stored in localstorage
    if (localStorage.getItem("slectedItem") != null) {
        $scope.selectedServices = JSON.parse(localStorage.getItem('slectedItem'));
        $scope.cart_item = _.size($scope.selectedServices);
    }

    $rootScope.$on('cart', function (event, args) {
        $scope.message = args.message;
        $scope.selectedServices = JSON.parse(localStorage.getItem('slectedItem'));
        $scope.cart_item = _.size($scope.selectedServices);
    });

    $scope.list_changed = function (id) {

    };

    $scope.datas= [
    {
      "Name":"Beard Styling",
      "Original_Price":"6000",
      "Fabtu_Price":"600"
    }, 
    {
      "Name":"Blow Dry",
      "Original_Price":"6000",
      "Fabtu_Price":"600"
    },
    {
      "Name":"Hair Coloring",
      "Original_Price":"6000",
      "Fabtu_Price":"600"
    },
     {
      "Name":"Hair Consulting ",
      "Original_Price":"6000",
      "Fabtu_Price":"600"
    }, 
    {
      "Name":"Hair Cut",
      "Original_Price":"6000",
      "Fabtu_Price":"600"
    },
    {
      "Name":"Hair Spa",
      "Original_Price":"6000",
      "Fabtu_Price":"600"
    },
     {
      "Name":"Firebase Spa",
      "Original_Price":"6000",
      "Fabtu_Price":"600"
    }
    
   
];


})