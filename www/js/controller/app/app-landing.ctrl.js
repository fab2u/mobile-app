app.controller('appLandingCtrl', function($scope, $timeout, $ionicHistory, $ionicLoading, $state,
                                          $cordovaDevice,$cordovaToast, $cordovaNetwork, $ionicPopup,
                                          $rootScope,$http) {

    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
    $ionicLoading.show();
   // localStorage.clear();
    var appInfoNew = {};
    var location = {};
    $scope.updates = {};
    $scope.walletBalance = 0;
    $scope.data = {};

    $scope.myReferral = '';

    // var appInfo = {
    //
    //     'trackingIdStatusFlag': '',
    //     'customerid': '5677',
    //     'trackingId': '8111',
    //     'custInfo': {
    //         'dob': '',
    //         'name': 'sonam',
    //         'weight': '',
    //         'location': '',
    //         'mobile': '801067466',
    //         'gender': 'Female',
    //         'Height': '',
    //         'email': 'sonam@fab2u.com',
    //         'address': '',
    //         'anniversaryDate': ''
    //     },
    //     'deviceInfo': {
    //         'udid': '',
    //         'uuid': 'deeccd2ee4e13261',
    //         'os': '',
    //         'platform': '',
    //         'version': '',
    //         'model': '',
    //         'manufacture': 'dummy',
    //         'deviceToken': ''
    //     },
    //     'instanceId': ''
    // };

    // window.localStorage['appInfo'] = JSON.stringify(appInfo);


    function updateWallet(walletBalance,NewUid){
        $ionicLoading.show();
        console.log("step5")
        var walletTransactionId = db.ref('userWallet/' + NewUid+'/credit').push().key;
        var transactionDetail = {
            'amount': walletBalance,
            'transactionId': walletTransactionId,
            'bookingId': '',
            'creditDate': new Date().getTime(),
            'type':'Wallet Balance'
        };
        $scope.updates['userWallet/' +NewUid+'/credit/'+walletTransactionId] = transactionDetail;
    }

    function userUpdate(oldUserInfo,NewUid,myReferral,walletAmount) {
        $ionicLoading.show();
        console.log("step6")
        var userData = {
            activeFlag: true,
            createdTime: new Date().getTime(),
            deviceId: oldUserInfo.deviceInfo.uuid,
            deviceName: oldUserInfo.deviceInfo.manufacture,
            email: {
                userEmail: oldUserInfo.custInfo.email,
                verifiedTime: '',
                emailFlag: false
            },
            mobile: {
                mobileNum: oldUserInfo.custInfo.mobile,
                mobileFlag: true
            },
            myReferralCode: myReferral,
            name: oldUserInfo.custInfo.name,
            referralCode: '',
            referralName: '',
            referralContact: '',
            userId: NewUid,
            gender: oldUserInfo.custInfo.gender
        };
        var referralData = {
            uid: NewUid,
            amount: 25,
            amountReferred: 25,
            referredUsers: {},
            referredBy: '',
            referredDate: new Date().getTime()
        };
        var oldUserData = {
            oldUid:oldUserInfo.customerid,
            oldTrackingId:oldUserInfo.trackingId,
            newUid:NewUid,
            oldWalletInfo:{
                amount:walletAmount,
                transferredDate:new Date().getTime()
            }
        }
        firebase.database().ref('users/data/' + NewUid)
            .set(userData, function (response) {
                if (response == null) {
                    firebase.database().ref('oldUsers/data/' + NewUid)
                        .set(oldUserData, function (res) {
                            if(res == null){
                                firebase.database().ref('referralCode/' + myReferral)
                                    .set(referralData, function (response) {
                                        if (response == null) {
                                            db.ref().update($scope.updates).then(function () {
                                                console.log("success")
                                            });
                                        }
                                    })
                                window.localStorage.setItem("name", oldUserInfo.custInfo.name);
                                window.localStorage.setItem("mobileNumber", oldUserInfo.custInfo.mobile);
                                window.localStorage.setItem("email", oldUserInfo.custInfo.email);
                                window.localStorage.setItem("uid", NewUid);
                                window.localStorage.setItem("referralCode", '');
                                $rootScope.$broadcast('logged_in', {message: 'usr logged in'});
                                delete window.localStorage.appInfo;
                                $state.go('intro-slider');
                                $cordovaToast
                                    .show('Thank You', 'long', 'center')
                                    .then(function (success) {
                                        // success
                                    }, function (error) {
                                        // error
                                    });
                            }
                            else {
                                $cordovaToast
                                    .show('Try again!', 'long', 'center')
                                    .then(function (success) {
                                        // success
                                    }, function (error) {
                                        // error
                                    });
                            }
                        })

                }
                else {
                    $cordovaToast
                        .show('Try again!', 'long', 'center')
                        .then(function (success) {
                            // success
                        }, function (error) {
                            // error
                        });
                }
            })

    }

    $scope.userDataEntry = function(oldUserInfo,NewUid){
        $ionicLoading.show();
        console.log("inside user entry function step2")
        $http({
            url: 'http://139.162.53.146//api/InsertReferFriend',
            method: "POST",
            params: {
                customerId: oldUserInfo.customerid,
                trackId: oldUserInfo.trackingId
            }
        }).success(function(response) {
            console.log(response);
            $scope.myReferral = response.Items[0].code.toUpperCase();
            console.log("old referral code",$scope.myReferral)
            if($scope.myReferral) {
                console.log("inside if :step2")
                $http({
                    url: 'http://139.162.53.146//api/GetCustomerWalletAmount',
                    method: "GET",
                    params: {
                        customerId: oldUserInfo.customerid,
                        opt: 1
                    }
                }).success(function(response) {
                    console.log(response);
                    $scope.walletBalance = response.Items[0].walletAmount;
                    $ionicLoading.hide();

                    console.log("old balance step4",$scope.walletBalance)

                });
                if($scope.walletBalance){
                    console.log("step4 + if balance:")
                    updateWallet( $scope.walletBalance,NewUid);
                    userUpdate(oldUserInfo,NewUid,$scope.myReferral,$scope.walletBalance);
                }
                else{
                    $scope.walletBalance = 0;
                    console.log("step4 - no balance:")

                    userUpdate(oldUserInfo,NewUid,$scope.myReferral, $scope.walletBalance);
                }
            }

        });
       };

    $scope.signUp = function(oldData,password){
        $ionicLoading.show();
        firebase.auth().createUserWithEmailAndPassword(oldData.custInfo.email, password).then(function(data){
            $scope.uid = data.uid;
            if($scope.uid){
                console.log("authenticated")
                $timeout( function() {
                    $scope.userDataEntry(oldData,$scope.uid);
                    $ionicLoading.hide();
                },300);
            }
        })
            .catch(function(error) {
                // Handle Errors here.
                var Id = db.ref('oldErrorUsers/data/').push().key;

                firebase.database().ref('oldErrorUsers/data/' + Id)
                    .set(oldData, function (response) {
                        if(response == null){
                            delete window.localStorage.appInfo;
                            $state.go('login');
                        }
                    })
                var errorCode = error.code;
                var errorMessage = error.message;
                $ionicLoading.hide();
                alert(errorMessage);


                // $cordovaToast
                //     .show(errorMessage, 'long', 'center')
                //     .then(function(success) {
                //         // success
                //     }, function (error) {
                //         // error
                //     });                $timeout( function() {
                //     $ionicLoading.hide();
                // },300);
                console.log("errorCode",errorCode,errorMessage)
            })
    };
    function SignUpToNewApp(oldUserData){
        $ionicPopup.show({
            template: '<input type="password" ng-model="data.password">',
            title: 'Please enter your six digit password',
            // subTitle: 'Please use normal things',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.data.password) {
                            SignUpToNewApp(oldUserData);
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                        } else {
                            $scope.signUp(oldUserData,$scope.data.password);
                            // return $scope.data.password;
                        }
                    }
                }
            ]
        });

    }

    checkAppInfo();

    function checkAppInfo() {
        var hasAppInfo = checkLocalStorage("appInfo");
        var userSelectedLocation = checkLocalStorage("selectedLocation");

        if (!hasAppInfo) {
            initialiseAppInfo();
            if(!userSelectedLocation){
                initialiseLocation();
            }
        }
        checkAppStatus();
    }

    function checkAppStatus() {
        var checkNewUser = checkLocalStorage('appInfo');
        if (checkNewUser) {
            var oldUserInfo = JSON.parse(window.localStorage['appInfo']);
            firebase.database().ref('appStatus').once('value', function(snapshot) {
                var newStatus = snapshot.val();

                console.log("newStatus",newStatus)
                var currentStatus = JSON.parse(window.localStorage['appInfo']);
                if(checkNewUser){
                    $ionicLoading.hide();
                    SignUpToNewApp(oldUserInfo);
                    initialiseAppInfo();
                }
                else{
                    $ionicLoading.hide();
                    checkLoginStatus();
                }
                // if (newStatus.live == true) {
                //     console.log("1")
                //     if (newStatus.version > currentStatus.version) {
                //         $ionicLoading.hide();
                //         console.log("2")
                //         // $state.go('app-update');
                //         SignUpToNewApp(oldUserInfo);
                //     } else {
                //         checkLoginStatus();
                //     }
                // } else {
                //     console.log("3")
                //     $ionicLoading.hide();
                //     $state.go('under-construction');
                // }
            });
        } else {
            firebase.database().ref('appStatus').once('value', function(snapshot) {
                var newStatus = snapshot.val();
                if (newStatus.live == false) {
                    $ionicLoading.hide();
                    $state.go('under-construction');
                } else {
                    $ionicLoading.hide();
                    // $state.go('intro-slider');
                    var hasCurrentBooking = checkLocalStorage('currentBooking');
                    if(hasCurrentBooking == true){
                    	$state.go('bill');
                    }
                    else if(window.localStorage.getItem('SkipIntro')== "true"){
                        $state.go('app.home');
                        // $state.go('location');
                    }else{
                      $state.go('intro-slider');
                      // $state.go('location');
                    }
                }
            });
        }
    }

    function checkLoginStatus() {
        var checkLogin = checkLocalStorage('userUid');
        var hasCurrentBooking = checkLocalStorage('currentBooking');
        if(hasCurrentBooking == true){
            $state.go('bill');
        }
        else if (checkLogin) {
            $ionicLoading.hide();
            $state.go('app.home');
        } else {
            $ionicLoading.hide();
            $state.go('app.home');
            // $state.go('location');
        }
    }

    function initialiseAppInfo() {
        try {
            var date = new Date();
            var currTimeStamp = date.getTime();
            appInfoNew = {
                udid: '',
                uuid: currTimeStamp,
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
        } catch (e) {}
        registerDevice();
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
                appInfoNew.device = "notCordova";
                var newPostKey = firebase.database().ref().child('deviceInformation').push().key;
                firebase.database().ref('deviceInformation/notRegistered/' + newPostKey).update(appInfoNew).then(function() {});
            };
            window.localStorage['appInfoNew'] = JSON.stringify(appInfoNew);
        } else {
            appInfoNew.device = "notCordova";
            appInfoNew.error = "not cordova";
            var newPostKey = firebase.database().ref().child('deviceInformation').push().key;
            firebase.database().ref('deviceInformation/notRegistered/' + newPostKey).update(appInfoNew).then(function() {});
            window.localStorage['appInfoNew'] = JSON.stringify(appInfoNew);
        }
    }

    function initialiseLocation() {
        try {
            location = {
                cityId:"-KQJsLMldL5R6ReFbKr2",
                cityName: "Gurgaon",
                country: "India",
                latitude: 28.4595,
                locationId: "-KOe9LJSgmcLJx5GzaRJ",
                locationName: "Sohna Road",
                longitude: 77.0266,
                state: "Haryana",
                zoneId: "-KOe9DIxKASx33GdHx1P",
                zoneName: "Sohna Road"
            }
        } catch (e) {}
        window.localStorage['selectedLocation'] = JSON.stringify(location);
    }

    // All the booking id for active booking and their detail

    function bookingInfo() {
        var activeBookingId = [];
        var activeBookings = [];
        firebase.database().ref('userBookings/'+localStorage.getItem('uid')).once('value', function (response) {
            if(response.val()){
                angular.forEach(response.val(), function (value, key) {
                    if(value == 'active'){
                        activeBookingId.push(key);
                    }
                });
                for (var i = 0; i < activeBookingId.length; i++) {
                    firebase.database().ref('bookings/' + activeBookingId[i]).once('value', function (response) {
                        if (response.val()) {
                            activeBookings.push(response.val())
                            window.localStorage['activeBooking'] = JSON.stringify(activeBookings);
                        }
                    });
                }
            }
        })
    };
    if(localStorage.getItem('uid')){
        bookingInfo();
    }
    var hasActiveBookings = checkLocalStorage('activeBooking');
    if(hasActiveBookings) {
        var activeBookingInformation = JSON.parse(window.localStorage['activeBooking']);
        var sortedActiveBookings = _.sortBy(activeBookingInformation, function(o) { return o.appointmentTime; })
        if(sortedActiveBookings[0].appointmentTime < new Date().getTime()){
            window.localStorage['currentBooking'] = JSON.stringify(sortedActiveBookings[0]);
            $state.go('bill');

        }
    }
    $rootScope.$on('booking', function (event, args) {
        bookingInfo();
        var hasActiveBookings = checkLocalStorage('activeBooking');
        if(hasActiveBookings) {
            var activeBookingInformation = JSON.parse(window.localStorage['activeBooking']);
            var sortedActiveBookings = _.sortBy(activeBookingInformation, function(o) { return o.appointmentTime; })
            if(sortedActiveBookings[0].appointmentTime < new Date().getTime()){
                window.localStorage['currentBooking'] = JSON.stringify(sortedActiveBookings[0]);
                $state.go('bill');
            }
        }
    });

});
