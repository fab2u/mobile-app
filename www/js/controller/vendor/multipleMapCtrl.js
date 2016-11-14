app.controller('multipleMapCtrl', function($scope, $ionicPlatform, $state, $timeout, $ionicLoading, $ionicHistory, $http) {


    var serviceId = window.localStorage.getItem("serviceId");
    $scope.locations = [];
    $scope.serviceIds = [];
    if(localStorage.getItem('catItems')){
        angular.forEach(JSON.parse(localStorage.getItem('catItems')), function(value, key) {
            $scope.serviceIds.push(value.id);
        })
    }


    $scope.centerLocation = JSON.parse(window.localStorage['selectedLocation'] || '{}');

    var centerLat = $scope.centerLocation.latitude;
    var centerLong = $scope.centerLocation.longitude;

    $scope.showPrevious = function(){
        $scope.hashistory = Object.keys($ionicHistory.viewHistory().views).length;

        if(  $scope.hashistory != 1){
            $ionicHistory.goBack();
        }
        else{
            $state.go('app.home');
        }
    }

    if(localStorage.getItem('uid') == ''||localStorage.getItem('uid') ==null||localStorage.getItem('uid')==undefined){
        $scope.uid = '1';
    }
    else{
        $scope.uid = localStorage.getItem('uid');
    }
    var hasVendorFilter = checkLocalStorage('vendorsFilter');

    if (hasVendorFilter) {
        $scope.vendorsDetail = JSON.parse(window.localStorage['vendorsFilter'])
    }


    $scope.vendorList = function(){
        if($scope.serviceIds.length>0){
            var serviceIdList = $scope.serviceIds.join();
            $http.post("http://139.162.31.204/search_services?services="+$scope.serviceIds+
                "&user_id="+$scope.uid+"&user_city="+$scope.centerLocation.cityId+"&user_gender=''&user_lat=''&user_lon=''")
                .then(function (response) {
                    $scope.vendorList = response.data.results;
                    var loc = [];
                    angular.forEach($scope.vendorList,function(value,key){
                        loc.push(value.vendor_name);
                        loc.push(value.address.address1);
                        loc.push(value.address.latitude);
                        loc.push(value.address.longitude);
                        loc.push(value.vendor_id);
                        $scope.locations.push(loc)
                        loc = [];
                        var htm= "<a href=\"javascript:google.maps.event.trigger(gmarkers['"+value.vendor_name+"'],'click');\" class=\"button3\"></a>"
                        $('#locations').append(htm);
                    })
                    mapInt($scope.locations);
                    $ionicLoading.hide();
                });
        }
        else{
                    var loc = [];
                    angular.forEach( $scope.vendorsDetail,function(value,key){
                        if(key != 'version'){
                            loc.push(value.vendorName);
                            loc.push(value.address.address1);
                            loc.push(value.address.latitude);
                            loc.push(value.address.longitude);
                            loc.push(value.vendorId);
                            $scope.locations.push(loc)
                            loc = [];
                            var htm= "<a href=\"javascript:google.maps.event.trigger(gmarkers['"+value.vendor_name+"'],'click');\" class=\"button3\"></a>"
                            $('#locations').append(htm);
                        }
                    })
                    mapInt($scope.locations);
                    $ionicLoading.hide();
        }

    }
    $scope.vendorList();

    function mapInt(locations) {
        //console.log(locations);


        gmarkers = [];

        var map = new google.maps.Map(document.getElementById('map-canvas'), {
            zoom: 10,
            center: new google.maps.LatLng(centerLat, centerLong),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        var markers = [];
        var infowindow = new google.maps.InfoWindow({
            maxWidth: 500
        });
        for (var i = 0; i < locations.length; i++) {

            var loc = locations[i][0] + "<br>" + locations[i][1] + "<br>" + "<a href='#/vendorDetails/" + locations[i][4] + "' id='DetailsButton'>Show details</a>";
            gmarkers[locations[i][0]] =
                createMarker(new google.maps.LatLng(locations[i][2], locations[i][3]), loc);
        }


        var markerCluster = new MarkerClusterer(map, markers, {
            maxZoom: 12,
            gridSize: 20
        });

        function createMarker(latlng, html) {
            var marker = new google.maps.Marker({
                position: latlng,
                map: map
            });
            markers.push(marker);
            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent(html);
                infowindow.open(map, marker);
            });

            return marker;
        }

    }

    $scope.showSalonList = function(){
        $scope.hashistory = Object.keys($ionicHistory.viewHistory().views).length;

        if(  $scope.hashistory != 1){
            $ionicHistory.goBack();
        }
        else{
            $state.go('app.home');
        }
    }

});



