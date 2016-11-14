app.controller('SearchCtrl', function($state, $scope,$http,$timeout,$ionicLoading) {

    $scope.searchQuery = '';
    $scope.serviceIds = [];

    delete window.localStorage.slectedItems;
    delete window.localStorage.catItems;
    delete window.localStorage.serviceId;
    delete window.localStorage.selectedTab;
    window.localStorage.setItem("serviceId",'');

    var locationInfo = JSON.parse(window.localStorage['selectedLocation']);
    $scope.vendorList = [];
    $scope.vendorIds = [];
    $scope.vendorNames = []
    var tempList = {};
    firebase.database().ref('vendorList/'+locationInfo.cityId).once('value',function(response){
        var count1 = Object.keys(response.val()).length;
        var count = 0;
        $scope.vendorNames = _.uniq(_.toArray(response.val()));
        angular.forEach(response.val(),function(value,key){
            tempList[key] = value;
            $scope.vendorIds.push(key);
            count ++
            console.log("key",key)
            console.log("value",value)
        })
        if(count == count1){
            $scope.vendorList.push(tempList)
            console.log("dummy",$scope.vendorList)
        }
    });

    $scope.searchServices = function(){
        // $ionicLoading.show();

        if($scope.searchQuery != ''){

            console.log($scope.searchQuery);
        }

    };


    $scope.home = function(){
        $state.go('app.home');
    };

    $scope.vendorMenu = function(vendorId){
     console.log("gdvdv",vendorId)
            delete window.localStorage.slectedItems;
            delete window.localStorage.BegItems;
            window.localStorage.setItem("service_type",'vendor');
            // $state.go('vendorMenu',{vendor_id:vendorId});

    }


});