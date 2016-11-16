app.controller('appLandingCtrl', function($scope, $timeout, $ionicHistory, $ionicLoading, $state,
                                          $cordovaDevice,$cordovaToast, $ionicPopup,
                                          $rootScope,$http,signUpService) {


    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
    $ionicLoading.show();

    var appVersion = 1; ///////version increase when upload
    var appInfoNew = {};
    var updates = {};

    function checkAppStatus() {
        firebase.database().ref('appStatus').once('value', function (snapshot) {
            var newStatus = snapshot.val();
            if (newStatus.live == true) {
                if (newStatus.version > appVersion) {
                    $state.go('updateApp');
                }
                else {
                    var hasAppInfo = checkLocalStorage("appInfo");
                    if(hasAppInfo){
                    //    Old user
                        signUpOldUser();
                    }
                    else{
                    //    New user
                    //    Check if first time user
                        var firstTimeUser = !checkLocalStorage("appInfoNew");
                        if(firstTimeUser){
                        //    first time user
                            initialiseAppInfo();
                        }
                        else{
                        //    Not first time user
                        //    Check if user is logged in
                            checkLoginStatus();
                        }
                    }
                }

            }
            else {
                $state.go('under-construction');
            }
        });
    };
    checkAppStatus();

    function signUpOldUser(){
        $ionicPopup.show({
            template: '<input type="password" ng-model="password">',
            title: 'Set your password',
            subTitle: 'We have found that you have not setup your password yet! Please enter minimum six digit password.',
            scope: $scope,
            buttons: [
                {
                    text: '<b>Set Password</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.password) {
                            signUpOldUser();
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                        } else {
                            if($scope.password.length ==6||$scope.password.length>6){
                                registerOldUser();
                            }
                            else{
                                $cordovaToast
                                    .show('Please enter at-least six digit password!', 'long', 'center')
                                    .then(function (success) {
                                        // success
                                    }, function (error) {
                                        // error
                                    });
                            }
                        }
                    }
                }
            ]
        });

    }

    function registerOldUser(){
        var oldUserInfo = JSON.parse(window.localStorage['appInfo']);
        signUpService.oldUserSignUp(oldUserInfo, $scope.password).then(function(res){
            console.log("res",res)
            $scope.uid = res;
            oldUserDataRecords(oldUserInfo);
        })
    };


    function oldUserDataRecords(oldUserInfo){
        $http({
            url: 'http://139.162.53.146//api/InsertReferFriend',
            method: "POST",
            params: {
                customerId: oldUserInfo.customerid,
                trackId: oldUserInfo.trackingId
            }
        }).success(function(response) {
            $scope.myReferral = response.Items[0].code.toUpperCase();
            if($scope.myReferral) {
                $http({
                    url: 'http://139.162.53.146//api/GetCustomerWalletAmount',
                    method: "GET",
                    params: {
                        customerId: oldUserInfo.customerid,
                        opt: 1
                    }
                }).success(function(response) {
                    $scope.walletAmount = response.Items[0].walletAmount;
                    oldUserDataUpdate(oldUserInfo);
                });
            }

        });
    };

    function oldUserDataUpdate(oldUserInfo) {
        var userData = {
            activeFlag: true,
            createdTime: new Date().getTime(),
            deviceId: oldUserInfo.deviceInfo.uuid,
            deviceName: oldUserInfo.deviceInfo.manufacture,
            email: {
                userEmail: oldUserInfo.custInfo.email,
                emailFlag: false
            },
            mobile: {
                mobileNum: oldUserInfo.custInfo.mobile,
                mobileFlag: true
            },
            myReferralCode: $scope.myReferral,
            name: oldUserInfo.custInfo.name,
            userId: $scope.uid,
            gender: oldUserInfo.custInfo.gender
        };

        var referralData = {
            uid: $scope.uid,
            amount: 25,
            amountReferred: 25,
            referredUsers: {},
            referredBy: '',
            referredDate: new Date().getTime()
        };

        var walletTransactionId = db.ref('userWallet/' + $scope.uid+'/credit').push().key;

        var transactionDetail = {
            'amount': $scope.walletAmount,
            'transactionId': walletTransactionId,
            'creditDate': new Date().getTime(),
            'type':'Old Wallet Balance Transferred'
        };

        var oldUserData = {
            oldUid:oldUserInfo.customerid,
            newUid:$scope.uid,
            oldWalletInfo:{
                amount:$scope.walletAmount,
                transferredDate:new Date().getTime(),
                transactionId: walletTransactionId
            }
        };
        updates['users/data/' + $scope.uid] = userData;
        updates['oldUsers/data/' + $scope.uid] = oldUserData;
        updates['referralCode/' + $scope.myReferral] = referralData;
        updates['userWallet/' +$scope.uid+'/credit/'+walletTransactionId] = transactionDetail;

        db.ref().update(updates).then(function(res){
            if(res == null){
                $rootScope.$broadcast('logged_in', {message: 'usr logged in'});
                delete window.localStorage.appInfo;
                // $state.go('intro-slider');
                $scope.oldUser = true;
                initialiseAppInfo();
                $cordovaToast
                    .show('Thank you.Your password set successfully!', 'long', 'center')
                    .then(function (success) {
                        // success
                    }, function (error) {
                        // error
                    });
            }
            else{

                /////////////////delete old app history and user data and switch to old user as new user? /////////
                var Id = db.ref('oldErrorUsers/data/').push().key;

                firebase.database().ref('oldErrorUsers/data/' + Id)
                    .set(oldUserInfo, function (response) {

                        delete window.localStorage.appInfo;
                        $ionicPopup.show({
                            template: '<p>Kindly contact our customer care at contact@fab2u.com or call us at 0124-406-5593</p>',
                            title: 'Registration Error',
                            subTitle: 'We cannot find your registration details. We apologize for the inconvenience.',
                            scope: $scope,
                            buttons: [
                                {
                                    text: '<b>Ok</b>',
                                    type: 'button-positive',
                                    onTap: function(e) {
                                        location.reload();
                                    }
                                }
                            ]
                        });
                    });
            }

        });
    }


    function initialiseAppInfo() {

            var date = new Date();
            var currTimeStamp = date.getTime();
            appInfoNew = {
                udid: '',
                uuid: '',
                os: '',
                platform: '',
                version: '',
                model: '',
                manufacture: '',
                deviceToken: 0,
                error: null,
                device: null,
                timeStamp: currTimeStamp
            };
        initialiseLocation();
    }

    function initialiseLocation(){
        db.ref('defaultLocation').once('value', function (snapshot) {
            $timeout(function(){
                var locationInfo = snapshot.val();
                window.localStorage['selectedLocation'] = JSON.stringify(locationInfo);
                registerDevice();
            },200);
        });
    }

    function registerDevice() {
        if (window.cordova) {
            try {
                var deviceInformation = $cordovaDevice.getDevice();
                appInfoNew.udid = deviceInformation.serial;
                appInfoNew.uuid = deviceInformation.uuid;
                appInfoNew.os = "1";
                appInfoNew.platform = deviceInformation.platform;
                appInfoNew.version = deviceInformation.version;
                appInfoNew.model = deviceInformation.model;
                appInfoNew.manufacture = deviceInformation.manufacturer;
                appInfoNew.device = "cordova";
                firebase.database().ref('deviceInformation/Registered/' + appInfoNew.uuid).update(appInfoNew).then(function() {});

            } catch (e) {
                console.log("error",e.message);
                appInfoNew.error = e.message;
                appInfoNew.device = "errorCordova";
                var newPostKey = firebase.database().ref().child('deviceInformation').push().key;
                appInfoNew.uuid = newPostKey;
                firebase.database().ref('deviceInformation/notRegistered/' + newPostKey).update(appInfoNew).then(function() {});
            };
        } else {
            appInfoNew.device = "notCordova";
            appInfoNew.error = "not cordova";
            var newPostKey = firebase.database().ref().child('deviceInformation').push().key;
            appInfoNew.uuid = newPostKey;
            firebase.database().ref('deviceInformation/notRegistered/' + newPostKey).update(appInfoNew).then(function() {});
        };
        window.localStorage['appInfoNew'] = JSON.stringify(appInfoNew);
        if($scope.oldUser){
            $state.go('location');
        }else{
            $state.go('intro-slider');
        }

    }


    function checkLoginStatus() {
        var user = firebase.auth().currentUser;
        if(user){
            var hasCurrentBooking = checkLocalStorage('currentBookingId');
            if(hasCurrentBooking == true){
                $state.go('bill');
            }
            else{
                $state.go('app.home');
            }
        }
        else{
            $state.go('app.home');
        }
    }

});
