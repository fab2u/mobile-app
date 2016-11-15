app.factory('allVendorService', function ($q) {
    return {
        getVersion: function (cityId) {
            // var deffer = $q.defer();
            return $q(function (resolve, reject) {
                firebase.database().ref('vendorFilters/' + cityId+'/version')
                    .once('value').then(function (snapshot) {
                    resolve(snapshot.val());
                }, function (error) {
                    reject(error);
                });
            });
            // return deffer.promise;
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
        }
    }
});