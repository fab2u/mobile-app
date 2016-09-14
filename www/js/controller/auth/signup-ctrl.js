app.controller("SignupCtrl", function($scope, $http,$state, $cordovaDevice,$ionicLoading,$ionicPopup,
                                      $timeout,$rootScope){
    $scope.generatedCode = '';

    console.log(ionic.Platform.isAndroid(),ionic.Platform.isIPad(),ionic.Platform.isIOS())

    if((ionic.Platform.isIOS() == true)|| (ionic.Platform.isIPad() == true)||(ionic.Platform.isAndroid() ==true)){
        console.log("if")
        firebase.database().ref('deviceInformation/Registered/'+$cordovaDevice.getDevice().uuid).once('value',function(response){
            console.log("device_list",JSON.stringify(response.val().registeredUsers));
            if(response.val().registeredUsers){
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

    // deviceInformation for Registered user
        // firebase.database().ref('deviceInformation/Registered/'+$cordovaDevice.getDevice().uuid).once('value',function(response){
        //     console.log("device_list",JSON.stringify(response.val().registeredUsers));
        //     if(response.val().registeredUsers){
        //         $scope.user_device_register = true;
        //     console.log("if")
        // }
        // else{
        //         $scope.user_device_register = false;
        //
        //         console.log("else")
        // }
        // });

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
        $ionicLoading.show({
            template: 'Loading...'
        });
        firebase.auth().createUserWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(data){
            console.log("uid",data.uid);
            $scope.uid = data.uid;
            if($scope.uid){
                $scope.sendVerification();
                $ionicLoading.hide();

            }
        })
            .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
                alert(errorMessage)
                $ionicLoading.hide();

                console.log("errorCode",errorCode,errorMessage)
            // ...
        })

     //    if(window.localStorage.getItem('mobile_verify') == 'true'){
     //        var userData = {
     //         name: $scope.user.name,
     //         email: $scope.user.email,
     //         mobileNum: $scope.user.mobile_num,
     //         referralCode: $scope.user.referral_code,
     //         deviceId: $cordovaDevice.getDevice().uuid
     //        }
     //        $http.post("http://139.162.27.64/api/addUser", userData)
     //           .success(function(response){
     //              if(response.StatusCode == 200){
     //                 alert(response.Message);
     //              }
     //              else if(response.StatusCode == 400){
     //                  alert(response.Message);
     //              }
     //              else{
     //                 alert('some thing went wrong!');
     //              }
     //           })
     //           .error(function(response){
     //              console.log("error");
     //              console.log(response);
     //         });
     //    }
     // else{
     //        $scope.sendVerification();
     //    }

    };

    $scope.generateVerificationCode = function(){
        var a = Math.floor(100000 + Math.random() * 900000)
        $scope.generatedCode= a.toString().substring(0, 4);

        console.log("number",$scope.generatedCode)  ;
    }

    $scope.sendVerification = function(){
        $scope.generateVerificationCode();
        $ionicLoading.show({
            template: 'Loading...'
        });
        $http({
            url: 'http://BULKSMS.FLYFOTSERVICES.COM/unified.php?usr=28221&pwd=password1&ph=' + $scope.user.mobile_num + '&sndr=IAMFAB&text=Greetings.' + $scope.generatedCode + ' is your FAB2U verification code&type=json ',
            method: 'POST',
            "async": true,
            "crossDomain": true
            // params: {
            //     mobno: $scope.user.mobile_num
            // }
        })
        $ionicLoading.hide();
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
        // }).success(function(response){
        //     $ionicLoading.hide();
        //     console.log(response);
        //     if(response.StatusCode == 200){
        //         $scope.otp = response.OTP;
        //         storedOTP.push($scope.otp);
        //         window.localStorage['previousOtp'] = JSON.stringify(storedOTP);
        //         $ionicPopup.alert({
        //             title: 'Verification Code Sent',
        //             template: 'We have sent a verification code to your registered mobile number'
        //         }).then(function(){
        //             $scope.showOTPfield = true;
        //             $scope.showPopup();
        //         })
        //     } else {
        //         $ionicPopup.alert({
        //             title: 'Verification Code not sent',
        //             template: 'An error occurred. Please try again later.'
        //         });
        //     }
        // })
    };
    $scope.showPopup = function() {
            $scope.data = {};
            $ionicPopup.show({
                template: '<input type="tel" ng-model="data.otp">',
                title: 'Please, enter otp',
                // subTitle: 'Please Enter Username',
                scope: $scope,
                buttons: [
                    { text: 'Resend' ,
                    onTap:function () {
                        $scope.sendVerification();
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
            if($scope.newOtp.code == parseInt(storedOTP[i])){
                    verified = true;
                    $ionicPopup.alert({
                        title: 'Mobile Number Verified'
                    }).then(function(){
                        window.localStorage.setItem('mobile_verify','true');
                        var userData = {
                            name: $scope.user.name,
                            email: $scope.user.email,
                            mobileNum: $scope.user.mobile_num,
                            referralCode: $scope.user.referral_code,
                            gender: $scope.user.gender,
                            mobileNumFlag:'true',
                            deviceId: $cordovaDevice.getDevice().uuid
                        }
                        firebase.database().ref('users/data/'+$scope.uid)
                            .set(userData,function(response) {
                                console.log("user pushed", JSON.stringify(response));
                                if(response == null){
                                    window.localStorage.setItem("name", $scope.user.name);
                                    window.localStorage.setItem("mobileNumber", $scope.user.mobile_num);
                                    window.localStorage.setItem("email", $scope.user.email);
                                    window.localStorage.setItem("uid", $scope.uid);
                                  alert('Registration successfully completed!')
                                }
                                else{
                                    alert('Try again!');
                                }
                            })



                        // $http.post("http://139.162.27.64/api/addUser", userData)
                        //    .success(function(response){
                        //       if(response.StatusCode == 200){
                        //          alert(response.Message);
                        //       }
                        //       else if(response.StatusCode == 400){
                        //           alert(response.Message);
                        //       }
                        //       else{
                        //          alert('some thing went wrong!');
                        //       }
                        //    })
                        //    .error(function(response){
                        //       console.log("error");
                        //       console.log(response);
                        //  });
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
