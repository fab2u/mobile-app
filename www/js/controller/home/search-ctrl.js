app.controller('SearchCtrl', function($state, $scope,$http) {

    $scope.searchQuery = '';
    $scope.serviceIds = [];

    // window.localStorage.setItem("serviceId",'');
    //
    // localStorage.setItem('slectedItems','');
    // localStorage.setItem('catItems', '');

    delete window.localStorage.slectedItems;
    delete window.localStorage.catItems;
    delete window.localStorage.serviceId;

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


    // $scope.searchresults = [
    //     {
    //         name: "Hair Cut",
    //         type: "Service"
    //     }, {
    //         name: "Massage",
    //         type: "Service"
    //     }, {
    //         name: "Melange Unisex Spa ",
    //         type: "Vendor"
    //     }
    // ];
    $scope.home = function(){
        $state.go('app.home');
    };

    $scope.vendorList = function(serviceId){
        console.log(serviceId);
        $scope.serviceIds.push(serviceId);
        window.localStorage.setItem("serviceId",$scope.serviceIds );

        $state.go('vendorList')
    }
});