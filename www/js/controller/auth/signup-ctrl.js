app.controller("SignupCtrl", function($scope,signUpService, $http,$state, $cordovaDevice,$ionicLoading,
                                      $ionicPopup, $timeout,$rootScope,$cordovaToast){
    $scope.generatedCode = '';
    $scope.myReferral = '';
    $scope.walletMoney = 0;
    $scope.updates = {};
    $scope.apply_code = false;
    $scope.referralName = '';
    $scope.referralContact = '';
    var appInfoNew = {};
    $scope.user_device_register = false;
    $scope.user = {
        name: '',
        email: '',
        mobile_num: '',
        referral_code: '',
        gender: '',
        password:''
    };
    $scope.showMobileVerify = false;
    $scope.showOTPfield = false;

    $scope.newOtp= {
        code: ''
    };
    var storedOTP = [];
    var locationInfo = JSON.parse(window.localStorage['selectedLocation']);

    $scope.loginPage = function(){
        $state.go('login');
    };

    $timeout(function () {
        $ionicLoading.hide();
    },60000)


    ////////////////   To check device is registered or not    /////////////////

    function deviceRegistered(){
        if((ionic.Platform.isIOS() == true)|| (ionic.Platform.isIPad() == true)||(ionic.Platform.isAndroid() ==true)){
            firebase.database().ref('deviceInformation/Registered/'+$cordovaDevice.getDevice().uuid).once('value',function(response){
                if(response.val()){
                    $scope.user_device_register = true;
                }
                else{
                    $scope.user_device_register = false;
                }
            });
        }
        else{
            console.log("else")
        }
    }
    //deviceRegistered();

    /////////////////////////////// To check apply referral code valid or not ////////////////


    $scope.checkPromoCode = function (referralCode) {
        var newCode =  referralCode.toUpperCase();
        if (newCode) {
            firebase.database().ref('referralCode/' + newCode)
                .once('value', function (response) {
                    if (response.val()) {
                        $scope.user.referral_code = newCode;
                        $cordovaToast
                            .show('Congratulation,you will get Rs.25 in your wallet', 'long', 'center')
                            .then(function(success) {
                                // success
                            }, function (error) {
                                // error
                            });
                    }
                    else {
                        $scope.user.referral_code = '';
                        $cordovaToast
                            .show('Please enter a valid code', 'long', 'center')
                            .then(function(success) {
                                // success
                            }, function (error) {
                                // error
                            });
                    }
                })
        }
        else {
            $cordovaToast
                .show('Please enter a code', 'long', 'center')
                .then(function(success) {
                    // success
                }, function (error) {
                    // error
                });
        }
    };

    ///////////////////////////check valid otp or not   ///////////////////////

    $scope.sendOtp = function(){
        $ionicLoading.show();
        $scope.generatedCode = generateVerificationCode();
        console.log($scope.generatedCode)
        if($scope.generatedCode){
            /////  do http request  to send otp to user //////////
            $http({
                url: 'http://139.162.27.64/api/send-otp?otp='+$scope.generatedCode+'&mobile='+
                $scope.user.mobile_num,
                method: 'POST',
                "async": true,
                "crossDomain": true
            }) .success(function (data, status, headers, config) {
                if(status == 200){
                    /////////////////       Store otp to firebase   /////////
                    var otpData = {
                        mobileNumber: $scope.user.mobile_num,
                        sendTime:new Date().getTime(),
                        otp:$scope.generatedCode
                    }
                    var otpInfo = {};
                    otpInfo['otp/sendOtp/' +  $scope.user.mobile_num] = otpData;
                    db.ref().update(otpInfo).then(function(response){
                       console.log("otp stored in database.")
                    })
                    storedOTP.push($scope.generatedCode);
                    window.localStorage['previousOtp'] = JSON.stringify(storedOTP);
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Verification Code Sent',
                        template: 'We have sent a verification code to your registered mobile number'
                    }).then(function(){
                        $scope.showOTPfield = true;
                        $ionicLoading.hide();
                        $scope.verifyOtpByUser();
                    })
                }
            }).error(function (data, status, header, config) {
                $ionicLoading.hide();
                    $cordovaToast
                        .show(data.msg, 'long', 'center')
                        .then(function(success) {
                            // success
                        }, function (error) {
                            // error
                    });
                });

        }
        else{
            $scope.sendOtp();
        }
    };
    function generateVerificationCode(){
        var a = Math.floor(100000 + Math.random() * 900000)
        var verificationCode = a.toString().substring(0, 4);
        console.log("number",verificationCode);
        return verificationCode;
    }

    $scope.verifyOtpByUser = function() {
        $scope.data = {};
        $ionicPopup.show({
            template: '<input type="tel" ng-model="data.otp">',
            title: 'Please, enter otp',
            scope: $scope,
            buttons: [
                { text: 'Resend' ,
                    onTap:function () {
                        reSendOtp();
                    }
                },
                {
                    text: '<b>Verify</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.data.otp) {
                            //don't allow the user to close unless he enters otp
                            e.preventDefault();
                        } else {
                            verifyOTP($scope.data.otp);
                            // return $scope.data.otp;
                        }
                    }
                }
            ]
        });
    };

    function reSendOtp(){
        $ionicLoading.show();
        $scope.generatedCode = generateVerificationCode();
        console.log($scope.generatedCode)
        if($scope.generatedCode){
            $http({
                method: 'POST',
                url:'http://139.162.27.64/api/resend-otp?otp='+$scope.generatedCode+'&mobile='+
                $scope.user.mobile_num
            }) .success(function (data, status, headers, config) {
                if(status == 200){
                    var otpInfo1 = {};
                    var otpData1 = {
                        mobileNumber: $scope.user.mobile_num,
                        sendTime:new Date().getTime(),
                        otp:$scope.generatedCode
                    }
                    otpInfo1['otp/resendOtp/' +  $scope.user.mobile_num] = otpData1;
                    db.ref().update(otpInfo1).then(function(response){
                        console.log("otp stored in database:")
                    })
                    storedOTP.push($scope.generatedCode);
                    window.localStorage['previousOtp'] = JSON.stringify(storedOTP);
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Verification Code Sent',
                        template: 'We have sent a verification code to your registered mobile number'
                    }).then(function(){
                        $scope.showOTPfield = true;
                        $ionicLoading.hide();
                        $scope.verifyOtpByUser();
                    })
                }
            }).error(function (data, status, header, config) {
                $ionicLoading.hide();
                    $cordovaToast
                        .show(data.msg, 'long', 'center')
                        .then(function(success) {
                            // success
                        }, function (error) {
                            // error
                        });
                });

        }
        else{
            reSendOtp();
        }
    }

    function verifyOTP(verify_otp){
        $ionicLoading.show();
        $scope.newOtp.code = verify_otp;
        console.log($scope.newOtp.code);
        console.log(storedOTP);
        var verified = false;
        for(var i = 0; i < storedOTP.length; i++){
            console.log($scope.newOtp.code, parseInt(storedOTP[i]));
            if($scope.newOtp.code == parseInt(storedOTP[i])){
                verified = true;
                $ionicPopup.alert({
                    title: 'Mobile Number Verified'
                }).then(function(){

                    window.localStorage.setItem('mobile_verify','true');

                    $ionicLoading.show();
                    signUpService.signUp($scope.user.email,$scope.user.password,$scope.user.name).then(function(res){
                        $scope.uid = res;
                        if($scope.user.referral_code){
                            $scope.myReferral = generateMyReferralCode($scope.user.name);
                            if($scope.myReferral){
                                updateWalletInfo($scope.user.referral_code);
                            }
                            else{
                                $scope.myReferral = generateMyReferralCode($scope.user.name);
                                $timeout(function () {
                                    updateWalletInfo($scope.user.referral_code);
                                },100)
                            }
                        }
                        else{
                            console.log("else")
                            $scope.myReferral = generateMyReferralCode($scope.user.name);
                            if($scope.myReferral){
                                pushUserInfo()
                            }
                            else{
                                $scope.myReferral = generateMyReferralCode($scope.user.name);
                                $timeout(function () {
                                    pushUserInfo()
                                },100)
                            }
                        }
                    })
                })

            }
        }
        $timeout(function(){
            $ionicLoading.hide();
            if(i == storedOTP.length && !verified){
                $ionicPopup.alert({
                    title: 'Incorrect otp'
                }).then(function(){
                    $scope.newOtp = {
                        code: ''
                    }
                })
            }
        }, 1000);
    }

    //// To generate my referral code    //////////////////
    function generateMyReferralCode(name){
        var res = name.split(" ");
        var firstName = res[0];
        var lastName = res[1];
        var myCodeToRefer = getReferralCode(firstName,lastName);
        return myCodeToRefer;
    }

    function getReferralCode(fname, lname) {
        var refchar;
        var refnum;
        if(lname == undefined || lname == null){
            lname = '';
        }
        fname = replaceSpaces(fname);
        var fnameLength = fname.length;
        if (fnameLength > 4) {
            refchar = fname.substring(0, 4);
            refnum = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
            var my_referral = refchar + refnum;
            var myReferralCode = my_referral.toUpperCase();
            return myReferralCode;
        }
        else {
            if(fnameLength < 4){
                refchar = fname.substring(0, fnameLength) + lname.substring(0, (4 - fnameLength));
                var x = 8 - refchar.length;
                for(x, y = "", i = 0; i < x; ++i, y += Math.floor(Math.random()*9));
                refnum = parseInt(y);
                var my_referral = refchar + refnum;
                var myReferralCode = my_referral.toUpperCase();
                return myReferralCode;

            }
            else{
                refchar = fname.substring(0, fnameLength) + lname.substring(0, (4 - fnameLength));
                refnum = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                var my_referral = refchar + refnum;
                var myReferralCode = my_referral.toUpperCase();
                return myReferralCode;
            }
        }

    }
    function replaceSpaces(str){
        var mystring = str;
        var newchar = ' '
        mystring = mystring.split('.').join(newchar);
        mystring = mystring.replace(/ /g,'')
        return mystring;
    }


    ///////////////////   To check user entered referral code validation //////////

    function updateWalletInfo(referralCode){
        console.log("referralCode",referralCode)

        firebase.database().ref('referralCode/'+referralCode)
            .once('value', function (response) {
                console.log(response.val())
                if(response.val()){
                    var walletTransactionId = db.ref('userWallet/' + $scope.uid+'/credit').push().key;
                    var transactionDetail = {
                        'amount': response.val().amountReferred,
                        'transactionId': walletTransactionId,
                        'bookingId': '',
                        'creditDate': new Date().getTime(),
                        'type':'userJoined'
                    };
                    $scope.referredByUid = response.val().uid;
                    if($scope.referredByUid){
                        $scope.updates['userWallet/' + $scope.uid+'/credit/'+walletTransactionId] = transactionDetail;
                        firebase.database().ref('users/data/' + $scope.referredByUid)
                            .once('value', function (response) {
                                $scope.referralName = response.val().name;
                                $scope.referralContact = response.val().mobile.mobileNum;
                        })
                        firebase.database().ref('referralCode/'+referralCode+'/referredUsers/')
                            .push({
                                userUid:$scope.uid,
                                userName:$scope.user.name,
                                userReferralCode:$scope.myReferral,
                                joinDate:new Date().getTime()
                            }, function (response) {

                                ///////////////call function to push data in user node /////
                                pushUserInfo();
                                console.log("uid pushed for used code :")
                        })
                    }
                    else {
                        $scope.updates['userWallet/' + $scope.uid + '/credit/' + walletTransactionId] = transactionDetail;
                        firebase.database().ref('referralCode/' + referralCode + '/referredUsers/')
                            .push({
                                userUid: $scope.uid,
                                userName: $scope.user.name,
                                userReferralCode: $scope.myReferral,
                                joinDate: new Date().getTime()
                            }, function (response) {

                                ///////////////call function to push data in user node /////
                                pushUserInfo();
                                console.log("uid pushed for used code :")
                            })
                    }
                }
                else{
                    $ionicLoading.hide();
                }
            })
    }

    function pushUserInfo(){
        var userData = {
            activeFlag:true,
            createdTime:new Date().getTime(),
            deviceId: $cordovaDevice.getDevice().uuid,
            deviceName:$cordovaDevice.getDevice().manufacturer,
            email:{
                userEmail:$scope.user.email,
                verifiedTime:'',
                emailFlag:false
            },
            mobile:{
                mobileNum: $scope.user.mobile_num,
                mobileFlag:true
            },
            myReferralCode:$scope.myReferral,
            name: $scope.user.name,
            referralCode: $scope.user.referral_code,
            referralName:$scope.referralName,
            referralContact:$scope.referralContact,
            userId:$scope.uid,
            gender: $scope.user.gender,
            userLocation:locationInfo
        };

        var referralData = {
            uid:$scope.uid,
            amount:25,
            amountReferred:25,
            referredUsers:{},
            referredDate:new Date().getTime()
        };

        if($scope.referredByUid){
            referralData.referredBy = $scope.referredByUid;
        } else {
            referralData.referredBy = '';
        }
        $scope.updates['users/data/'+$scope.uid] = userData;
        $scope.updates['referralCode/'+$scope.myReferral] = referralData;
        db.ref().update($scope.updates).then(function(response){
                if(response == null){
                    registerDevice();
                }
                else{
                    deleteUser();
                }
            },
            function (error) {
                deleteUser();
                console.log("error",error)
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
                firebase.database().ref('deviceInformation/Registered/' + appInfoNew.uuid)
                    .update(appInfoNew).then(function() {
                    localData();
                });

            } catch (e) {
                console.log("error",e.message);
                appInfoNew.error = e.message;
                appInfoNew.device = "errorCordova";
                var newPostKey = firebase.database().ref().child('deviceInformation').push().key;
                appInfoNew.uuid = newPostKey;
                firebase.database().ref('deviceInformation/notRegistered/' + newPostKey)
                    .update(appInfoNew).then(function() {
                    localData();
                });
            };
        } else {
            appInfoNew.device = "notCordova";
            appInfoNew.error = "not cordova";
            var newPostKey = firebase.database().ref().child('deviceInformation').push().key;
            appInfoNew.uuid = newPostKey;
            firebase.database().ref('deviceInformation/notRegistered/' + newPostKey)
                .update(appInfoNew).then(function() {
                localData()
            });
        };
    }


    function localData() {
        window.localStorage.setItem("name", $scope.user.name);
        window.localStorage.setItem("mobileNumber", $scope.user.mobile_num);
        window.localStorage.setItem("email", $scope.user.email);
        window.localStorage.setItem("uid", $scope.uid);
        window.localStorage.setItem("referralCode", $scope.user.referral_code);
        $rootScope.$broadcast('logged_in', { message: 'usr logged in' });
        var stateObj = $rootScope.from;
        $cordovaToast
            .show('Your account is successfully created.', 'long', 'center')
            .then(function(success) {
                // success
            }, function (error) {
                // error
            });
        if(stateObj) {
            if (stateObj.stateName != 'tagFeed') {
                $rootScope.from = {};
                $ionicLoading.hide();
                $state.go(stateObj.stateName);
            }
            else {
                $rootScope.from = {};
                $ionicLoading.hide();
                $state.go(stateObj.stateName, {tag: stateObj.params});
            }
        }
        else{
            $ionicLoading.hide();
            $state.go('app.home')
        }
    }

    function deleteUser() {
        $ionicLoading.hide();
        var user = firebase.auth().currentUser;
        $scope.user = {
            name: '',
            email: '',
            mobile_num: '',
            referral_code: '',
            gender: '',
            password:''
        };
        user.delete().then(function() {
            $cordovaToast
                .show('Registration failed, please try again!', 'long', 'center')
                .then(function(success) {
                    // success
                }, function (error) {
                    // error
                });
        }, function(error) {
            // An error happened.
        });
    }

});
