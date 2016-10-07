app.controller("SignupCtrl", function($scope, $http,$state, $cordovaDevice,$ionicLoading,$ionicPopup,
                                      $timeout,$rootScope){
    $scope.generatedCode = '';
    $scope.myReferral = '';
    $scope.validReferralcode = [];
    $scope.walletMoney = 0;
    $scope.updates = {};
    $scope.apply_code = false;


    /////////////////////////////// To check apply referral code valid or not ////////////////
    $scope.apply_promoCode = function (referralCode) {
        console.log("apply promo code called")
        if (referralCode) {
            firebase.database().ref('referralCode/' + referralCode)
                .once('value', function (response) {
                    console.log("response for all valid codes", JSON.stringify(response.val()))
                    if (response.val()) {
                        alert('Congratulation,you will get 25 rs. in your wallet')
                    }
                    else {
                        alert('Please, enter a valid code')
                    }
                })
        }
        else {
            alert('Please, enter a code')
        }
    };

    ///////////////////   To check user entered referral code validation //////////

    $scope.checkValidCode = function(referralCode){
        firebase.database().ref('referralCode/'+referralCode)
            .once('value', function (response) {
                console.log("response for all valid codes", JSON.stringify(response.val()))
                if(response.val()){
                    var walletTransactionId = db.ref('userWallet/' + $scope.uid+'/credit').push().key;
                    var transactionDetail = {
                        'amount': response.val().amountReferred,
                        'transactionId': walletTransactionId,
                        'bookingId': '',
                        'creditDate': new Date().getTime(),
                        'type':'userJoined'
                    };
                    firebase.database().ref('referralCode/'+referralCode)
                        .once('value', function (response) {
                            var referredByUid = response.val().uid;
                            $scope.updates['referralCode/'+$scope.myReferral+'/referredBy'] = referredByUid;
                            firebase.database().ref('referralCode/'+referralCode+'/referredUsers/')
                                .push({
                                    userUid:$scope.uid,
                                    userName:$scope.user.name,
                                    userReferralCode:$scope.myReferral,
                                    joinDate:new Date().getTime()
                                }, function (response) {
                                    console.log("uid pushed for used code :")
                                })
                        })
                    $scope.updates['userWallet/' + $scope.uid+'/credit/'+walletTransactionId] = transactionDetail;                }
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
            $scope.myReferral = refchar + refnum;
        } else {
            if(fnameLength < 4){
                refchar = fname.substring(0, fnameLength) + lname.substring(0, (4 - fnameLength));
                var x = 8 - refchar.length;
                console.log("x",x)
                for(x, y = "", i = 0; i < x; ++i, y += Math.floor(Math.random()*9));
                refnum = parseInt(y);
                $scope.myReferral = refchar + refnum;
            }
            else{
                refchar = fname.substring(0, fnameLength) + lname.substring(0, (4 - fnameLength));
                refnum = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                $scope.myReferral = refchar + refnum;
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

    if((ionic.Platform.isIOS() == true)|| (ionic.Platform.isIPad() == true)||(ionic.Platform.isAndroid() ==true)){
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
                $scope.generateMyReferralCode($scope.user.name);
                if($scope.user.referral_code){
                    $scope.checkValidCode($scope.user.referral_code);
                }
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
        })
    };

    $scope.generateVerificationCode = function(){
        var a = Math.floor(100000 + Math.random() * 900000)
        $scope.generatedCode= a.toString().substring(0, 4);
        console.log("number",$scope.generatedCode)  ;
    };

    $scope.sendVerification = function(){
        $scope.generateVerificationCode();
        $ionicLoading.show({
            template: 'Loading...'
        });
        $http({
            url: 'http://BULKSMS.FLYFOTSERVICES.COM/unified.php?usr=28221&pwd=password1&ph=' +
            $scope.user.mobile_num + '&sndr=IAMFAB&text=Greetings.' +
            $scope.generatedCode + ' is your FAB2U verification code&type=json ',
            method: 'POST',
            "async": true,
            "crossDomain": true
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
    };
    $scope.reSendVerification = function(){
        $scope.user.mobile_num = '8447785980';
        $scope.generateVerificationCode();
        $ionicLoading.show();
        $http({
            method: 'POST',
            url:'http://139.162.27.64/api/send?mob='+$scope.user.mobile_num+'&otp='+$scope.generatedCode
        }) .success(function (data, status, headers, config) {
            if(status == 200){
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
            }
        })
            .error(function (data, status, header, config) {
                $ionicLoading.hide();

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
                            userId:$scope.uid,
                            gender: $scope.user.gender,
                        };
                        var referralData = {
                            uid:$scope.uid,
                            amount:25,
                            amountReferred:25,
                            referredUsers:{},
                            referredBy:'',
                            referredDate:new Date().getTime()
                        };
                        firebase.database().ref('users/data/'+$scope.uid)
                            .set(userData,function(response) {
                                if(response == null){
                                    firebase.database().ref('referralCode/'+$scope.myReferral)
                                        .set(referralData,function(response){
                                            if(response == null){
                                                console.log("update json",JSON.stringify($scope.updates))
                                                db.ref().update($scope.updates).then(function(){
                                                    console.log("success")
                                                });
                                            }
                                        })
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
                                    alert('Registration successfully completed!')
                                }
                                else{
                                    alert('Try again!');
                                }
                            })
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
