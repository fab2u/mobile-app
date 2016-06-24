app.controller('SearchCtrl', function($state, $scope) {
    $scope.searchresults = [
        {
            name: "Hair Cut",
            type: "Service"
        }, {
            name: "Massage",
            type: "Service"
        }, {
            name: "Melange Unisex Spa ",
            type: "Vendor"
        }
    ];
});