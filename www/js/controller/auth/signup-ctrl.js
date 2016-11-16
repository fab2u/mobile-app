app.controller("SignupCtrl", function($scope,signUpService, $http,$state, $cordovaDevice,$ionicLoading,$ionicPopup,
                                      $timeout,$rootScope,$cordovaToast){
    $scope.generatedCode = '';
    $scope.myReferral = '';
    $scope.walletMoney = 0;
    $scope.updates = {};
    $scope.apply_code = false;
    $scope.referralName = '';
    $scope.referralContact = '';
    $scope.user_device_register = false;
    $scope.user = {};

    var locationInfo = JSON.parse(window.localStorage['selectedLocation']);





    ////////////////   To check device is registered or not    /////////////////

    function deviceRegistered(){
        if((ionic.Platform.isIOS() == true)|| (ionic.Platform.isIPad() == true)||(ionic.Platform.isAndroid() ==true)){
            firebase.database().ref('deviceInformation/Registered/'+$cordovaDevice.getDevice().uuid).once('value',function(response){
                console.log("device_list",JSON.stringify(response.val()));
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
   deviceRegistered();

    /////////////////////////////// To check apply referral code valid or not ////////////////
    $scope.apply_promoCode = function (referralCode) {
     var newCode =  referralCode.toUpperCase();
        if (referralCode) {
            firebase.database().ref('referralCode/' + newCode)
                .once('value', function (response) {
                    console.log("response for all valid codes", JSON.stringify(response.val()))
                    if (response.val()) {
                            $scope.user.referral_code = newCode;
                        $cordovaToast
                            .show('Congratulation,you will get 25 rs. in your wallet', 'long', 'center')
                            .then(function(success) {
                                // success
                            }, function (error) {
                                // error
                            });
                    }
                    else {
                        $scope.user.referral_code = '';
                        $cordovaToast
                            .show('Please, enter a valid code', 'long', 'center')
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
                .show('Please, enter a code', 'long', 'center')
                .then(function(success) {
                    // success
                }, function (error) {
                    // error
                });
        }
    };

    ///////////////////   To check user entered referral code validation //////////

    $scope.checkValidCode = function(referralCode){
        firebase.database().ref('referralCode/'+referralCode)
            .once('value', function (response) {
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
                            firebase.database().ref('users/data/' + $scope.referredByUid)
                                .once('value', function (response) {
                                    $scope.referralName = response.val().name;
                                    $scope.referralContact = response.val().mobile.mobileNum;
                                })
                            $scope.updates['referralCode/'+$scope.myReferral+'/referredBy'] = $scope.referredByUid;
                            firebase.database().ref('referralCode/'+referralCode+'/referredUsers/')
                                .push({
                                    userUid:$scope.uid,
                                    userName:$scope.user.name,
                                    userReferralCode:$scope.myReferral,
                                    joinDate:new Date().getTime()
                                }, function (response) {
                                    console.log("uid pushed for used code :")
                                })
                    $scope.updates['userWallet/' + $scope.uid+'/credit/'+walletTransactionId] = transactionDetail;
                }
            })
    };


    //// To generate my referral code    //////////////////

    function getReferralCode(fname, lname) {
        var refchar;
        var refnum;
        if(lname == undefined || lname == null){
            lname = '';
        }
        // console.log(fname);
        fname = replaceSpaces(fname);
        var fnameLength = fname.length;
        // console.log(fname);
        if (fnameLength > 4) {
            refchar = fname.substring(0, 4);
            refnum = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

            var my_referral = refchar + refnum;
            $scope.myReferral = my_referral.toUpperCase();
        } else {
            if(fnameLength < 4){
                refchar = fname.substring(0, fnameLength) + lname.substring(0, (4 - fnameLength));
                var x = 8 - refchar.length;
                console.log("x",x)
                for(x, y = "", i = 0; i < x; ++i, y += Math.floor(Math.random()*9));
                refnum = parseInt(y);
                var my_referral = refchar + refnum;
                $scope.myReferral = my_referral.toUpperCase();

            }
            else{
                refchar = fname.substring(0, fnameLength) + lname.substring(0, (4 - fnameLength));
                refnum = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                var my_referral = refchar + refnum;
                $scope.myReferral = my_referral.toUpperCase();
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

    $scope.generateMyReferralCode = function(name){
        var res = name.split(" ");
        var firstName = res[0];
        var lastName = res[1];
        console.log(res,firstName,lastName);
        getReferralCode(firstName,lastName);
    };




    //////////////// end my referral code generation function /////////////



   $scope.user = {
      name: '',
      email: '',
      mobile_num: '',
      referral_code: '',
      gender: '',
      password:''
   };

     $scope.loginPage = function(){
        $state.go('login');
       };

        $scope.showMobileVerify = false;
        $scope.showOTPfield = false;

        $scope.newOtp= {
            code: ''
        };
        var storedOTP = [];

        //localStorage.removeItem('previousOtp');

        if(checkLocalStorage('previousOtp')){
            console.log('otp exists');
            $scope.showOTPfield = true;
            $scope.showMobileVerify = true;
            storedOTP = JSON.parse(window.localStorage['previousOtp'] || {});
        } else {
            console.log('otp not exists');
        }



    $scope.signup = function(){
        signUpService.signUp($scope.user.email,$scope.user.password,$scope.user.name).then(function(res){
            console.log("res",res);
            if($scope.user.referral_code){
                $scope.sendVerification();
                $scope.generateMyReferralCode($scope.user.name);
                $scope.checkValidCode($scope.user.referral_code);
            }
            else{
                $scope.sendVerification();
                $scope.generateMyReferralCode($scope.user.name);
            }
        })
    };

    // $scope.signup = function(){
    //     $ionicLoading.show();
    //     firebase.auth().createUserWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(data){
    //         $scope.uid = data.uid;
    //         if($scope.uid){
    //             $scope.sendVerification();
    //             $scope.generateMyReferralCode($scope.user.name);
    //             if($scope.user.referral_code){
    //                 $scope.checkValidCode($scope.user.referral_code);
    //             }
    //           $ionicLoading.hide();
    //         }
    //     })
    //         .catch(function(error) {
    //             $ionicLoading.hide();
    //
    //             // Handle Errors here.
    //         var errorCode = error.code;
    //         var errorMessage = error.message;
    //             $cordovaToast
    //                 .show(errorMessage, 'long', 'center')
    //                 .then(function(success) {
    //                     // success
    //                 }, function (error) {
    //                     // error
    //                 });
    //             console.log("errorCode",errorCode,errorMessage)
    //     })
    // };

    $scope.generateVerificationCode = function(){
        var a = Math.floor(100000 + Math.random() * 900000)
        $scope.generatedCode= a.toString().substring(0, 4);
        console.log("number",$scope.generatedCode)  ;
    };

    $scope.sendVerification = function(){
        $scope.generateVerificationCode();
        $ionicLoading.show();
        $http({
            url: 'http://139.162.27.64/api/send-otp?otp='+$scope.generatedCode+'&mobile='+
            $scope.user.mobile_num,
            method: 'POST',
            "async": true,
            "crossDomain": true
        }) .success(function (data, status, headers, config) {
            if(status == 200){
                $timeout( function() {
                    $ionicLoading.hide();
                },300);
                $scope.otp = $scope.generatedCode;
                storedOTP.push($scope.otp);
                window.localStorage['previousOtp'] = JSON.stringify(storedOTP);
                $ionicPopup.alert({
                    title: 'Verification Code Sent',
                    template: 'We have sent a verification code to your registered mobile number'
                }).then(function(){
                    $scope.showOTPfield = true;
                    $scope.showPopup();
                })
            }
        })
            .error(function (data, status, header, config) {
                $timeout( function() {
                    $ionicLoading.hide();
                },300);
                console.log(status,data)
                $cordovaToast
                    .show(data.msg, 'long', 'center')
                    .then(function(success) {
                        // success
                    }, function (error) {
                        // error
                    });
            });

    };
    $scope.reSendVerification = function(){
        $scope.generateVerificationCode();
        $ionicLoading.show();
        $http({
            method: 'POST',
            url:'http://139.162.27.64/api/send-otp?otp='+$scope.generatedCode+'&mobile='+
            $scope.user.mobile_num
        }) .success(function (data, status, headers, config) {
            if(status == 200){
                $timeout( function() {
                    $ionicLoading.hide();
                },300);
                $scope.otp = $scope.generatedCode;
                storedOTP.push($scope.otp);
                window.localStorage['previousOtp'] = JSON.stringify(storedOTP);
                $ionicPopup.alert({
                    title: 'Verification Code Sent',
                    template: 'We have sent a verification code to your registered mobile number'
                }).then(function(){
                    $scope.showOTPfield = true;
                    $scope.showPopup();
                })
            }
        })
            .error(function (data, status, header, config) {
                $timeout( function() {
                    $ionicLoading.hide();
                },300);
                $cordovaToast
                    .show(data.msg, 'long', 'center')
                    .then(function(success) {
                        // success
                    }, function (error) {
                        // error
                    });
            });

    };
    $scope.showPopup = function() {
            $scope.data = {};
            $ionicPopup.show({
                template: '<input type="tel" ng-model="data.otp">',
                title: 'Please, enter otp',
                scope: $scope,
                buttons: [
                    { text: 'Resend' ,
                    onTap:function () {
                        $scope.reSendVerification();
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
                                $scope.verifyOTP($scope.data.otp);
                               // return $scope.data.otp;
                            }
                        }
                    }
                ]
            });
    };

    $scope.verifyOTP = function(verify_otp){
        $scope.newOtp.code = verify_otp;
        console.log($scope.newOtp.code);
        console.log(storedOTP);
        var verified = false;
        for(var i = 0; i < storedOTP.length; i++){
            console.log($scope.newOtp.code, parseInt(storedOTP[i]));
            console.log("myReferral",$scope.myReferral);
            if($scope.myReferral.length != 8){
                $scope.generateMyReferralCode();
            }

            if($scope.newOtp.code == parseInt(storedOTP[i])){
                    verified = true;
                    $ionicPopup.alert({
                        title: 'Mobile Number Verified'
                    }).then(function(){
                        window.localStorage.setItem('mobile_verify','true');
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
                            referredBy:'',
                            referredDate:new Date().getTime()
                        };

                        $scope.updates['users/data/'+$scope.uid] = userData;
                        $scope.updates['referralCode/'+$scope.myReferral] = referralData;

                        db.ref().update($scope.updates).then(function(response){
                            if(response == null){
                                window.localStorage.setItem("name", $scope.user.name);
                                window.localStorage.setItem("mobileNumber", $scope.user.mobile_num);
                                window.localStorage.setItem("email", $scope.user.email);
                                window.localStorage.setItem("uid", $scope.uid);
                                window.localStorage.setItem("referralCode", $scope.user.referral_code);
                                $rootScope.$broadcast('logged_in', { message: 'usr logged in' });
                                if(localStorage.getItem('confirmation') == 'true'){
                                    localStorage.setItem('confirmation', '');
                                    $state.go('confirmation');
                                }
                                else{
                                    $state.go('app.home');
                                }
                                $cordovaToast
                                    .show('Your account is successfully created.', 'long', 'center')
                                    .then(function(success) {
                                        // success
                                    }, function (error) {
                                        // error
                                    });
                            }
                            else{
                                $cordovaToast
                                    .show('Try again!', 'long', 'center')
                                    .then(function(success) {
                                        // success
                                    }, function (error) {
                                        // error
                                    });
                            }
                        });
                    })

            }
        }
        $timeout(function(){
            if(i == storedOTP.length && !verified){
                $ionicPopup.alert({
                    title: 'Incorrect Code'
                }).then(function(){
                    $scope.newOtp = {
                        code: ''
                    }
                    $scope.showPopup();
                })
            }
        }, 1000);
    }
});
