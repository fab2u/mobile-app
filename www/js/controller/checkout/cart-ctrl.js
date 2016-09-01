app.controller("CartCtrl",function($scope,$rootScope,$stateParams,$state){
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

    $scope.list_changed = function (serv_id,serviceName) {
        if(($scope.cartItems[serviceName]) && ($scope.selectedServices[serviceName])){
            delete $scope.cartItems[serviceName];
            delete $scope.selectedServices[serviceName];
        }
        localStorage.setItem('BegItems', JSON.stringify($scope.cartItems));
        localStorage.setItem('slectedItem', JSON.stringify($scope.selectedServices));
        $rootScope.$broadcast('cart', { message: 'cart length changed' });
    };

    $scope.edit_cart = function(){
        $state.go('vendorMenu',{'vendor_id':$stateParams.ven_id});
    };

    $scope.backButton = function () {
        //later on back trake history will be here////////
        $state.go('vendorMenu',{'vendor_id':$stateParams.ven_id});

    }
})