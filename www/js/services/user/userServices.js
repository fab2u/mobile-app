app.factory('userServices', function ($q) {
    return {
        getReferralCode: function (uId) {
            return $q(function (resolve, reject) {
                firebase.database().ref('/users/data/' + uId)
                    .once('value').then(function (snapshot) {
                    resolve(snapshot.val());
                }, function (error) {
                    reject(error);
                });
            });
        },
        getWalletInfo: function (uId) {
            return $q(function (resolve, reject) {
                firebase.database().ref('userWallet/' + uId)
                    .once('value').then(function (snapshot) {
                    resolve(snapshot.val());
                }, function (error) {
                    reject(error);
                });
            });
        },
        getReferralHistory: function (myReferralCode) {
            return $q(function (resolve, reject) {
                firebase.database().ref('referralCode/' + myReferralCode)
                    .once('value').then(function (snapshot) {
                    resolve(snapshot.val());
                }, function (error) {
                    reject(error);
                });
            });
        }
    }
})
