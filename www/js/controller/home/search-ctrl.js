app.controller('SearchCtrl', function($state, $scope,$http) {

    $scope.searchQuery = '';
    $scope.serviceIds = [];

    delete window.localStorage.slectedItems;
    delete window.localStorage.catItems;
    delete window.localStorage.serviceId;
    window.localStorage.setItem("serviceId",'');


    $scope.searchServices = function(){
        console.log($scope.searchQuery)
        if($scope.searchQuery != ''){
            $http.post("http://139.162.31.204/suggest?search_query="+$scope.searchQuery+"&typing_word="+$scope.searchQuery)
                .then(function (response) {
                    console.log(JSON.stringify(response)) ;

                    $scope.suggestedServices = response.data.suggestions;
                });
        }

    };

    $scope.home = function(){
        $state.go('app.home');
    };

    $scope.vendorList = function(serviceId){
        console.log(serviceId);
        $scope.serviceIds.push(serviceId);
        window.localStorage.setItem("serviceId",$scope.serviceIds );

        $state.go('vendorList');
    }
});