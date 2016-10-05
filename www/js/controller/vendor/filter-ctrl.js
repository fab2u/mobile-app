app.controller('filterCtrl', function($scope,$state,$ionicModal,$http,$ionicLoading){
    $scope.price_range = 1;
    $scope.range = 1;
    $scope.amenities = [];
    $scope.location = {};
    $scope.selectedLocation = [];
    if(localStorage.getItem('uid') == ''||localStorage.getItem('uid') ==null||localStorage.getItem('uid')==undefined){
        $scope.uid = '1';
    }
    else{
        $scope.uid = localStorage.getItem('uid');
    }

    $scope.location_selected = function(val){
        $scope.selectedLocation.push(val);
    };

    $scope.ratingsObject = {
        iconOn: 'ion-ios-star',
        iconOff: 'ion-ios-star-outline',
        iconOnColor: '#ffd11a',
        iconOffColor: '#b38f00',
        rating: 0,
        minRating: 0,
        readOnly:false,
        callback: function(rating) {
            $scope.ratingsCallback(rating);
        }
    };
    $scope.ratingsCallback = function(rating) {
        $scope.custReview.rating = rating;
    };
    $scope.custReview ={
        review:'',
        rating: 0
    };
    $scope.backButton = function(){
        $state.go('vendorList');
    };
    $scope.typeFn = function(val){
        $scope.type = val;
    };
    $scope.amenity_type = function(val){
        $scope.amenities.push(val);
        $scope.ame_type = val;
    };
    $ionicModal.fromTemplateUrl('templates/vendor/filter-location.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.location = modal;
    });
    $scope.open_location = function() {
        firebase.database().ref('location/' + JSON.parse(window.localStorage['selectedLocation']).cityId).once('value', function (response) {
            $scope.location_detail = response.val();
            console.log("location",JSON.stringify($scope.location_detail,null,2))
        });
        if( $scope.location_detail){
            $scope.location.show();
        }
    };
    $scope.close_location = function() {
        $scope.location.hide();
    };
    $scope.smFn = function(value){
        $scope.price_range = value;
    }

    $scope.apply = function () {
        $ionicLoading.show();
        var final_query = {
            'price':$scope.price_range,
            'amenities': $scope.amenities.join(),
            'service_type': $scope.type,
            'location':$scope.selectedLocation.join(),
            'rating':$scope.custReview.rating
        }
        $http.post("http://139.162.31.204/filter_results?user_id="+$scope.uid+"&vendor_type="+final_query.service_type+
            "&price_range_min="+final_query.price+"&price_range_max=200000"+"&rating="+final_query.rating+
            "&locations="+final_query.location+"&facilities="+final_query.amenities)
            .then(function (response) {
                $scope.vendorList = response.data.filtered_results;
                console.log("list",JSON.stringify($scope.vendorList,null,2))
                $ionicLoading.hide();
            });
        console.log("final_query",JSON.stringify(final_query,null,2))
    };

    $scope.refresh = function(){
        $state.go('filter',{reload:true});
            $scope.price_range = 1;
            $scope.amenities = [];
            $scope.type = '';
            $scope.selectedLocation = [];
            $scope.custReview.rating = 0;
    };


});
