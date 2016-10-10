app
    .controller('VendorSelectedServicesListCtrl',function($scope,$stateParams,$rootScope,$state,
                                                          $ionicLoading,$ionicPopup) {

        $scope.total_fabtu=0;
        $scope.total_original=0;
        $scope.total_customer = 0;

        $scope.selected_ids = [];
        $scope.selected_cat = [];
        $scope.menu = [];
        $scope.cart_item = 0;
        $scope.cart_price = {};

        $scope.fabSelected = false;


        $scope.selectMain = function(val){
            if(val == 1){
                $scope.fabSelected = false;
            } else {
                $scope.fabSelected = true;
                if(_.size($scope.selectedServices)>0){
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Note',
                        template: 'Your current selection will be discarded. You have to select services again from menu.'
                    });
                    confirmPopup.then(function(res) {
                        if(res) {
                            window.localStorage.setItem("selectedTab", false)
                            $state.go('vendorMenu',{vendor_id:$stateParams.vendor_id});
                            delete window.localStorage.slectedItems;
                            delete window.localStorage.BegItems;
                            $rootScope.$broadcast('cart', { message: 'cart length changed' });
                        } else {
                            console.log('You are not sure');
                        }
                    });
                }
                else{
                    window.localStorage.setItem("selectedTab", true)
                    $state.go('vendorMenu',{vendor_id:$stateParams.vendor_id});
                }
            }
        };

       $scope.selected_items = JSON.parse(localStorage.getItem('catItems'));
        console.log(JSON.stringify( $scope.selected_items));
        if($scope.selected_items){
            angular.forEach($scope.selected_items,function (value,key) {
                $scope.selected_ids.push(value.id);
            })
        }

        var sorted_id = _.sortBy($scope.selected_ids, function(num){
            return num;
        });

        console.log("sorted_id",sorted_id)

        for(var i=0;i<sorted_id.length;i++){
            if(sorted_id[i]<='1013' && sorted_id[i]>='1001'){
                var cat_name = 'cat-01'
                $scope.selected_cat.push(cat_name);
            }

        }
        console.log("testing",$scope.selected_cat)
        var mySubArray = _.uniq($scope.selected_cat, function (name) {
            return name;
        });
        console.log("mySubArray",mySubArray);

        if(mySubArray.length>0) {
            firebase.database().ref('menu/' + $stateParams.vendor_id).once('value', function (response) {
                if (response.val()) {
                    $scope.menuInfo = response.val().services;
                    window.localStorage.setItem("vendorName", response.val().vendorName);
                    for(var j = 0; j< mySubArray.length;j++){
                        angular.forEach($scope.menuInfo, function (value, key) {
                            if(key == mySubArray[j]){
                                console.log("iffffffffffffff",JSON.stringify(value))
                                $scope.menu.push(value);
                            }
                        })
                    }
                    $scope.vendorDetail();
                    console.log("selected hhhhhhhhhhhhhhhhhh menu value",JSON.stringify($scope.menu,null,2))

                }
            })

        }



        $scope.show = function() {
            $ionicLoading.show();
        };
        $scope.show();


        $scope.vendorDetail = function() {
            $ionicLoading.show();
            firebase.database().ref('vendors/' + JSON.parse(window.localStorage['selectedLocation']).cityId + '/' + $stateParams.vendor_id).once('value', function (response) {
                $scope.vendor_detail = response.val();
                window.localStorage.setItem("vendorMobile",$scope.vendor_detail.contactDetails.phone);
                window.localStorage.setItem("vendorLandline",$scope.vendor_detail.contactDetails.landline);

                $ionicLoading.hide();
            });
        };


        ///To calculate cart price //////

        $scope.calPrice = function (item_list) {
            $scope.total_fabtu=0;
            $scope.total_original=0;
            $scope.total_customer = 0;
            angular.forEach(item_list, function(value, key) {
                $scope.total_fabtu += value.fab2uPrice;
                $scope.total_original += value.vendorPrice;
                $scope.total_customer += value.customerPrice;
            })
        };
        if(localStorage.getItem('BegItems') != null){
            $scope.cartItems = JSON.parse(localStorage.getItem('BegItems'));
            $scope.calPrice($scope.cartItems);
        }


        $scope.selectedServices = {}; // Stores selected services
        $scope.begItems = {};

        $scope.currSlide = 0; // Current slide index

        // Get selected services if previously stored in localstorage
        if ((localStorage.getItem("slectedItem") != null) && (localStorage.getItem('BegItems'))) {
            $scope.selectedServices = JSON.parse(localStorage.getItem('slectedItem'));
            $scope.begItems = JSON.parse(localStorage.getItem('BegItems'));

            $scope.cart_item = _.size($scope.selectedServices);
        }

        $rootScope.$on('cart', function (event, args) {
            $scope.message = args.message;
            $scope.selectedServices = JSON.parse(localStorage.getItem('slectedItem'));
            $scope.begItems = JSON.parse(localStorage.getItem('BegItems'));
            $scope.cart_item = _.size($scope.selectedServices);
            $scope.calPrice($scope.begItems);
        });

        $scope.selectItem = function(index, serviceName,selectObj) {
            var data = selectObj;
            if(($scope.begItems[data.menuItemName]) && ($scope.selectedServices[serviceName])){
                delete $scope.begItems[data.menuItemName];
                delete $scope.selectedServices[serviceName];
            }
            else {
                $scope.begItems[data.menuItemName] = data;
                $scope.selectedServices[serviceName] = true;
            }
            localStorage.setItem('BegItems', JSON.stringify($scope.begItems));
            localStorage.setItem('slectedItem', JSON.stringify($scope.selectedServices));
            $rootScope.$broadcast('cart', { message: 'cart length changed' });
        };


        // handel back button
        $scope.backButton = function() {
            if(localStorage.getItem('favourite') == 'true') {
                localStorage.setItem('favourite', '');
                $state.go('favourite');
            }
            else if(localStorage.getItem("service_type")=='vendor'){
                localStorage.setItem('service_type', '');
                $state.go('app.home');
            }

            else{
                $state.go('vendorList');
            }
            // TODO
        };

        // handel on click overview button
        $scope.overviewButton = function() {
            window.localStorage.setItem("selectedTab", true);
            $state.go('vendorDetails',{'ven_id':$stateParams.vendor_id})
            // TODO
        };


        // handel on click proceed button
        $scope.proceedButton = function() {
            if(_.size($scope.selectedServices)>0){
                window.localStorage.setItem("selectedTab", true);
                $state.go('cart',{'ven_id':$stateParams.vendor_id});

            }
            else{
                alert('Please, select some services!')
            }
        };

    });

