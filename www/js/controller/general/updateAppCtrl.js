app.controller('updateAppCtrl', function($scope, $cordovaInAppBrowser, $cordovaDevice){

    $scope.downloadUpdate = function(){
        var options = {
            location: 'yes',
            clearcache: 'yes',
            toolbar: 'no'
        };

        if(window.cordova){
            var deviceInformation = $cordovaDevice.getDevice();
            var manufacture = deviceInformation.manufacturer;
        }
        if(manufacture != 'Apple') {
            $cordovaInAppBrowser.open('https://play.google.com/store/apps/details?id=com.ionicframework.fab2u641617', '_system', options);
        } else {
        }
    }

});
