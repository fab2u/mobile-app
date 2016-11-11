app.controller('SearchCtrl', function($state, $scope,$http,$ionicLoading) {

    $scope.searchQuery = '';
    $scope.serviceIds = [];

    delete window.localStorage.slectedItems;
    delete window.localStorage.catItems;
    delete window.localStorage.serviceId;
    delete window.localStorage.selectedTab;
    window.localStorage.setItem("serviceId",'');


    $scope.searchServices = function(){
        $ionicLoading.show();

        if($scope.searchQuery != ''){
            $http.post("http://139.162.31.204/suggest?search_query="+$scope.searchQuery+"&typing_word="+
                $scope.searchQuery)
                .then(function (response) {
                    if(response){
                        console.log("response",response)
                        $scope.suggestedServices = response.data.suggestions;
                        $ionicLoading.hide();
                    }
                });
        }

    };


    $scope.home = function(){
        $state.go('app.home');
    };

    $scope.vendorList = function(service){
        if(service.type=='service'){
            $scope.serviceIds.push(service.value.service_id);
            window.localStorage.setItem("serviceId",$scope.serviceIds);
            $state.go('vendorList');
        }
        else if(service.type == 'vendor'){
            delete window.localStorage.slectedItems;
            delete window.localStorage.BegItems;
            window.localStorage.setItem("service_type",'vendor');
            $state.go('vendorMenu',{vendor_id:service.value.vendor_id});
        }

    }
});