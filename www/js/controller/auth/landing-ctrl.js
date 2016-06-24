app
.controller('LandingCtrl', ['$scope', '$http', '$state','$ionicHistory', '$timeout', function($scope, $http, $state, $ionicHistory, $timeout) {
	console.log("Landing Controller");
	$ionicHistory.clearCache();
    $ionicHistory.clearHistory();
    var appVersionInfo = {
        appversion: 0,
        appLive: 1
    }
    // remove this
    $state.go('app.home');
    // 
    var appVersion = 10;


    var quotes = {
        Items:[
        {
          quoteid: '1',
          quote: 'Everything has beauty, but not everyone sees it.'
        },
        {
          quoteid: '2',
          quote: 'People will stare, Make it worth their while.'
        },
        {
          quoteid: '3',
          quote: 'Beauty is power; a smile is its sword.'

        },
        {
          quoteid: '4',
          quote: 'Beauty is a good letter of introduction.'
        },
        {
          quoteid: '5',
          quote: 'Whatever you are, be a Good one.'
        },
        {
          quoteid: '6',
          quote: 'Don’t let anyone dull your sparkle.'
        },
        {
          quoteid: '7',
          quote: 'Be your own kind of beautiful.'
        },
        {
          quoteid: '8',
          quote: 'Open your eyes and see the beauty.'
        },
        {
          quoteid: '9',
          quote: 'Beauty is power and smile is its sword.'
        },
        {
          quoteid: '10',
          quote: 'To love beauty is to see light.'
        },
        {
          quoteid: '11',
          quote: 'Beauty is self confidence applied directly to the face.'
        },
        {
          quoteid: '12',
          quote: 'You can be gorgeous at thirty, charming at forty, and irresistible for the rest of your life.'
        },
        {
          quoteid: '13',
          quote: 'Beauty is being the best possible version of yourself, inside and out.'
        },
        {
          quoteid: '14',
          quote: 'The ideal has many names, and beauty is but one of them'
        },
        {
          quoteid: '15',
          quote: 'Beauty is the pilot of the young soul.'
        }]
    }
    $scope.quotes = quotes.Items[Math.floor(Math.random() * 15)];


    $timeout(function(){

		$http({
			url: 'http://139.162.53.146//api/appStatus',
			method: "POST"
		}).success(function(response){
			//console.log(response);
			//console.log(response.version);
			appVersionInfo.appversion = response.version;
			appVersionInfo.appLive = response.livestat;
			$scope.landingNavigation();
		})

    }, 5000);

    $scope.landingNavigation = function(){
        // console.log(appVersionInfo.appversion);
        // console.log(appVersionInfo.appLive);
        if(appVersionInfo.appLive == 0) {
          $state.go('updateInProcess');
        }else {
            if(appVersion == appVersionInfo.appversion) {

              //Check if firstTime var is stored in localstorage
      				//initially it will be null
      				if (localStorage.getItem("firstTime") != null) {
    			        //console.log(localStorage.getItem('firstTime'));
    			        var firstTime = localStorage.getItem('firstTime');
    			        //Show intro slider to the user only once
    			        if(firstTime=='false') {
    			        	$state.go('app.home');
    			        }else {
    			        	$state.go('intro-slider');
    			        }
    			    }else {
    			        $state.go('intro-slider');
    			    }
            } else {
             	$state.go('updateApp');
            }
        }
    }
}]);