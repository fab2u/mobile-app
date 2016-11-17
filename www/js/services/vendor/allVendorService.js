app.factory('allVendorService', function ($q) {
    return {
        getVersion: function (cityId) {
            return $q(function (resolve, reject) {
                firebase.database().ref('vendorFilters/' + cityId+'/version')
                    .once('value').then(function (snapshot) {
                    resolve(snapshot.val());
                }, function (error) {
                    reject(error);
                });
            });
        },
        getAllVendors: function (cityId) {
            return $q(function (resolve, reject) {
                firebase.database().ref('vendorFilters/' + cityId)
                    .once('value').then(function (snapshot) {
                    resolve(snapshot.val());
                }, function (error) {
                    reject(error);
                });
            });
        },
        getVlistVersion: function (cityId) {
            return $q(function (resolve, reject) {
                firebase.database().ref('vendorList/' + cityId+'/version')
                    .once('value').then(function (snapshot) {
                    resolve(snapshot.val());
                }, function (error) {
                    reject(error);
                });
            });
        },
        getVendorsList: function (cityId) {
            return $q(function (resolve, reject) {
                firebase.database().ref('vendorList/' + cityId)
                    .once('value').then(function (snapshot) {
                    resolve(snapshot.val());
                }, function (error) {
                    reject(error);
                });
            });
        }
    }
});