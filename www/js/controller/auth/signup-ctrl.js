app.controller("SignupCtrl", function($scope, $http,$state, $cordovaDevice,$ionicLoading,$ionicPopup,
                                      $timeout,$rootScope){


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
    console.log("signUp function called!")
        firebase.auth().createUserWithEmailAndPassword($scope.user.email, $scope.user.password).then(function(data){
            console.log("uid",data.uid);
            if(data.uid){
                firebase.database().ref('users/data/'+data.uid)
                    .push($scope.user,function(response) {
                        console.log("user pushed", JSON.stringify(response));

                        if(response == null){
                            $scope.sendVerification();
                        }
                    })
            }
        })
            .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
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

    $scope.sendVerification = function(){
        $ionicLoading.show({
            template: 'Loading...'
        });
        $http({
            url:'http://139.162.3.205/api/sendOtp',
            method: 'POST',
            params: {
                mobno: $scope.user.mobile_num
            }
        }).success(function(response){
            $ionicLoading.hide();
            console.log(response);
            if(response.StatusCode == 200){
                $scope.otp = response.OTP;
                storedOTP.push($scope.otp);
                window.localStorage['previousOtp'] = JSON.stringify(storedOTP);
                $ionicPopup.alert({
                    title: 'Verification Code Sent',
                    template: 'We have sent a verification code to your registered mobile number'
                }).then(function(){
                    $scope.showOTPfield = true;
                    $scope.showPopup();
                })
            } else {
                $ionicPopup.alert({
                    title: 'Verification Code not sent',
                    template: 'An error occurred. Please try again later.'
                });
            }
        })
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
                            deviceId: $cordovaDevice.getDevice().uuid
                        }
                        $http.post("http://139.162.27.64/api/addUser", userData)
                           .success(function(response){
                              if(response.StatusCode == 200){
                                 alert(response.Message);
                              }
                              else if(response.StatusCode == 400){
                                  alert(response.Message);
                              }
                              else{
                                 alert('some thing went wrong!');
                              }
                           })
                           .error(function(response){
                              console.log("error");
                              console.log(response);
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
                })
            }
        }, 1000);
    }
});
