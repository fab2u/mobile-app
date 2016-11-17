app.factory('signUpService', function ($q,$ionicLoading,$rootScope) {
    return {
        signUp: function(email,password,name){
            return $q(function (resolve,reject) {
                firebase.auth().createUserWithEmailAndPassword(email,password).then(function(data){
                    $ionicLoading.hide();
                    var user = firebase.auth().currentUser;
                    user.updateProfile({
                        displayName:name
                    }).then(function() {
                        // Update successful.
                    }, function(error) {
                        // An error happened.
                    });
                    resolve(data.uid);
                }, function (error) {
                    reject(error);
                    $ionicLoading.hide();
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    if (errorCode == 'auth/email-already-in-use') {
                        alert('Already exists an account with the given email address.Please try with another email address.');
                    }
                    else if (errorCode == 'auth/invalid-email') {
                        alert('The given email address is not valid.Please try with another email address.');
                    }
                    else if (errorCode == 'auth/operation-not-allowed') {
                        alert('Sorry, you can not sign Up by using email and password.');
                    }
                    else if (errorCode == 'auth/weak-password') {
                        alert('The password is too weak.Please enter at-least six digit password');
                    }
                    else if (errorCode == 'auth/network-request-failed') {
                        alert('Sorry network error.Please try again!');
                    }

                    console.log("errorCode",errorCode,errorMessage)
                })
            })

        },
        oldUserSignUp: function(oldUserInfo,password){
            return $q(function (resolve,reject) {
                firebase.auth().createUserWithEmailAndPassword(oldUserInfo.custInfo.email,password).then(function(data){
                    var user = firebase.auth().currentUser;
                    $ionicLoading.hide();

                    user.updateProfile({
                        displayName:oldUserInfo.custInfo.name
                    }).then(function() {
                        // Update successful.
                    }, function(error) {
                        // An error happened.
                    });
                    resolve(data.uid);
                }, function (error) {
                    $ionicLoading.hide();
                    reject(error);
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    if (errorCode == 'auth/email-already-in-use') {
                        alert('Already exists an account with the given email address.Please try with another email address.');
                        $rootScope.$broadcast('oldUserError', { message: 'usr logged in' });

                    }
                    else if (errorCode == 'auth/invalid-email') {
                        alert('The given email address is not valid.Please try with another email address.');
                        $rootScope.$broadcast('oldUserError', { message: 'usr logged in' });

                    }
                    else if (errorCode == 'auth/operation-not-allowed') {
                        alert('Sorry, you can not sign Up by using email and password.');
                        $rootScope.$broadcast('oldUserError', { message: 'usr logged in' });

                    }
                    else if (errorCode == 'auth/weak-password') {
                        alert('The password is too weak.Please enter at-least six digit password');
                        $rootScope.$broadcast('oldUserError', { message: 'usr logged in' });
                    }
                    else if (errorCode == 'auth/network-request-failed') {
                        alert('Sorry network error.Please try again!');
                        $rootScope.$broadcast('oldUserError', { message: 'usr logged in' });
                    }
                    console.log("errorCode",errorCode,errorMessage)
                })
            })

        }
    }
})