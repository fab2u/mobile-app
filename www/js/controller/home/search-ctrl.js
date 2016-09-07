app.controller('SearchCtrl', function($state, $scope,$http) {

    $scope.searchQuery = '';

    $scope.searchServices = function(){
        console.log($scope.searchQuery)
        $http.post("http://139.162.31.204/suggest?search_query="+$scope.searchQuery+"&typing_word="+$scope.searchQuery)
            .then(function (response) {
               console.log(JSON.stringify(response.data.suggestions)) ;

                $scope.suggestedServices = response.data.suggestions;
            });
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
});