
app.controller('vendorMenuCtrl', function($scope,$stateParams, $state) {

    firebase.database().ref('vendors/'+JSON.parse(window.localStorage['selectedLocation']).cityId+'/'+$stateParams.vendor_id).once('value',function(response){
        $scope.vendor_menu = response.val().menu;
        console.log("vendor menu :",JSON.stringify($scope.vendor_menu))
        // angular.forEach(response.val().images, function(value, key) {
        //     $scope.images.push({id : key, src:value.url})
        // });
    });


    $scope.services = {
        "1001": {
            "serviceName": "Beard Styling",
            "serviceid": "1001"
        },
        "1002": {
            "serviceName": "Blow Dry",
            "serviceid": "1002"
        },
        "1003": {
            "serviceName": "Hair Coloring",
            "serviceid": "1003"
        },
        "1004": {
            "serviceName": "Hair Consulting",
            "serviceid": "1004"
        },
        "1005": {
            "serviceName": "Hair Cut",
            "serviceid": "1005"
        },
        "1007": {
            "serviceName": "Hair Extension",
            "serviceid": "1007"
        },
        "1008": {
            "serviceName": "Head Massage",
            "serviceid": "1008"
        },
        "1009": {
            "serviceName": "Hair Spa",
            "serviceid": "1009"
        },
        "1010": {
            "serviceName": "Hair Transplant",
            "serviceid": "1010"
        },
        "1011": {
            "serviceName": "Hair Wash",
            "serviceid": "1011"
        },
        "1012": {
            "serviceName": "Other Hair Treatments",
            "serviceid": "1012"
        },
        "1013": {
            "serviceName": "Straightening/ Perming",
            "serviceid": "1013"
        },
        "1014": {
            "serviceName": "Anti HairFall Treatment",
            "serviceid": "1014"
        },
        "2001": {
            "serviceName": "Face Bleach",
            "serviceid": "2001"
        },
        "2002": {
            "serviceName": "Eyebrow/Eyelash",
            "serviceid": "2002"
        },
        "2003": {
            "serviceName": "Face Threading",
            "serviceid": "2003"
        },
        "2004": {
            "serviceName": "Face Waxing",
            "serviceid": "2004"
        },
        "2005": {
            "serviceName": "Facials",
            "serviceid": "2005"
        },
        "2006": {
            "serviceName": "Clean-up",
            "serviceid": "2006"
        },
        "2007": {
            "serviceName": "Laser Treatment",
            "serviceid": "2007"
        },
        "2008": {
            "serviceName": "Shaving",
            "serviceid": "2008"
        },
        "2009": {
            "serviceName": "Skin Treatments",
            "serviceid": "2009"
        },
        "2010": {
            "serviceName": "Skincare Consultations",
            "serviceid": "2010"
        },
        "3001": {
            "serviceName": "Underarms",
            "serviceid": "3001"
        },
        "3002": {
            "serviceName": "Arms",
            "serviceid": "3002"
        },
        "3003": {
            "serviceName": "Legs",
            "serviceid": "3003"
        },
        "3004": {
            "serviceName": "Full Body",
            "serviceid": "3004"
        },
        "3005": {
            "serviceName": "Full Back",
            "serviceid": "3005"
        },
        "3006": {
            "serviceName": "Midriff",
            "serviceid": "3006"
        },
        "3007": {
            "serviceName": "Bikini",
            "serviceid": "3007"
        },
        "3008": {
            "serviceName": "Side Locks",
            "serviceid": "3008"
        },
        "3009": {
            "serviceName": "Laser Hair Removal",
            "serviceid": "3009"
        },
        "4001": {
            "serviceName": "Body Polishing",
            "serviceid": "4001"
        },
        "4002": {
            "serviceName": "Body Toning",
            "serviceid": "4002"
        },
        "4003": {
            "serviceName": "Body Bleach",
            "serviceid": "4003"
        },
        "4004": {
            "serviceName": "Body Scrub",
            "serviceid": "4004"
        },
        "4005": {
            "serviceName": "Boby Wrap",
            "serviceid": "4005"
        },
        "4006": {
            "serviceName": "Body Treatments",
            "serviceid": "4006"
        },
        "4007": {
            "serviceName": "Botox Treatment",
            "serviceid": "4007"
        },
        "4008": {
            "serviceName": "Body Shaping and Contouring",
            "serviceid": "4008"
        },
        "4009": {
            "serviceName": "Tanning",
            "serviceid": "4009"
        },
        "5001": {
            "serviceName": "Pedicure",
            "serviceid": "5001"
        },
        "5002": {
            "serviceName": "Manicure",
            "serviceid": "5002"
        },
        "5003": {
            "serviceName": "Cleanings",
            "serviceid": "5003"
        },
        "6001": {
            "serviceName": "Nail Art",
            "serviceid": "6001"
        },
        "6002": {
            "serviceName": "Nail Extension/ Bar",
            "serviceid": "6002"
        },
        "7001": {
            "serviceName": "Packages",
            "serviceid": "7001"
        },
        "8001": {
            "serviceName": "Spa & Massages",
            "serviceid": "8001"
        },
        "9001": {
            "serviceName": "Fitness",
            "serviceid": "9001"
        },
        "1101": {
            "serviceName": "Wedding & Party",
            "serviceid": "1101"
        },
        "1201": {
            "serviceName": "Tattoo",
            "serviceid": "1111"
        }
    };

});