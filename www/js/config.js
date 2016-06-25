app
.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider

	.state('landing', {
		url: '/landing',
		templateUrl: 'templates/auth/landing.html',
		controller: 'LandingCtrl'
	})
	.state('intro-slider', {
		url: '/intro-slider',
		templateUrl: 'templates/auth/intro-slider.html',
		controller: 'IntroSliderCtrl'
	})

	.state('app', {
	    url: '/app',
	    abstract: true,
	    templateUrl: 'templates/home/menu.html',
	    controller: 'AppCtrl'
	})

	.state('app.home', {
	    url: '/home',
	    views: {
	      'menuContent': {
	        templateUrl: 'templates/home/home.html',
	        controller: 'HomeCtrl'
	      }
      },
       resolve: {
            currentAuth: function(AuthenticationService){
               return AuthenticationService.checkAuthentication();
            }
         }
	})

	// Legal info

    .state('termsnConditions', {
        url: '/termsnConditions',
        templateUrl: 'templates/legal/termsnConditions.html'
    })
    .state('privacyPolicy', {
        url: '/privacyPolicy',
        templateUrl: 'templates/legal/privacyPolicy.html'
    });

	//State for vendor details
    $stateProvider.state('vendorDetails', {
        url: '/vendorDetails',
        templateUrl: 'templates/vendor/vendorDetails.html',
        controller: 'VendorDetailsCtrl'
    });

    //State for refer a friend
    $stateProvider.state('refer', {
        url: '/refer',
        templateUrl: 'templates/user/refer.html',
        controller: 'ReferCtrl'
    });

    //State for referral details
    $stateProvider.state('referralDetails', {
        url: '/referralDetails',
        templateUrl: 'templates/user/referralDetails.html',
        controller: 'ReferralDetailsCtrl'
    });

    //State for date time
    $stateProvider.state('dateTime', {
        url: '/dateTime',
        templateUrl: 'templates/checkout/dateTime.html',
        controller: 'DateTimeCtrl'
    });

    //State for bookings
    $stateProvider.state('bookings', {
        url: '/bookings',
        templateUrl: 'templates/user/bookings.html',
        controller: 'BookingsCtrl'
    });

    //State for search
    $stateProvider.state('search', {
        url: '/search',
        templateUrl: 'templates/home/search.html',
        controller: 'SearchCtrl'
    });

    //State for cart
    $stateProvider.state('cart', {
        url: '/cart',
        templateUrl: 'templates/checkout/cart.html',
        controller: 'CartCtrl'
    });

	//State for login
	$stateProvider.state('login', {
        url: '/login',
        templateUrl: 'templates/auth/login.html',
        controller: 'LoginCtrl'
    });

    //State for signup
    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'templates/auth/signup.html',
        controller: 'SignupCtrl'
    });

	 //State for email verification
	 $stateProvider.state('verify', {
	   url: '/verify',
	   templateUrl: 'templates/auth/verify-email.html',
	   controller: 'verifyEmailCtrl'
	});

    //State for wallet
	$stateProvider.state('wallet', {
        url: '/wallet',
        templateUrl: 'templates/user/wallet.html',
        controller: 'WalletCtrl'
    });

    //State for vendorList
    $stateProvider.state('vendorList', {
        url: '/vendorList',
        templateUrl: 'templates/vendor/vendorList.html',
        controller: 'VendorListCtrl'
    });

    //State for confirmation
    $stateProvider.state('confirmation', {
        url: '/confirmation',
        templateUrl: 'templates/checkout/confirmation.html',
        controller: 'ConfirmationCtrl'
    });

    //State for bill
    $stateProvider.state('bill', {
        url: '/bill',
        templateUrl: 'templates/checkout/bill.html',
        controller: 'BillCtrl'
    });


    $stateProvider.state('new-slider', {
        url: '/new-slider',
        templateUrl: 'templates/home/new-slider.html',
        controller: 'NewSliderCtrl'
    });

    //State for user wallet
    $stateProvider.state('userWallet', {
        url: '/userWallet',
        templateUrl: 'templates/user/userWallet.html',
        controller: 'UserWalletCtrl'
    });

    //State for user wallet
    $stateProvider.state('vendor-services-list', {
        url: '/vendor-services-list',
        templateUrl: 'templates/vendor/vendor-services-list.html',
        controller: 'VendorServicesListCtrl'
    });

	//  Edit Deepank Start
	 $stateProvider.state('profile', {
		 url: '/profile',
		 templateUrl: 'templates/user/profile.html',
		 controller: 'profileCtrl'
	 });
	 // Edit Deepank End

	 $stateProvider
	 .state('feed', {
		 url: '/feed',
		 templateUrl: 'templates/feed/feed.html',
		 controller: 'FeedCtrl'
	 })
	 .state('tagFeed', {
      url: '/tag/:tag',
      templateUrl: 'templates/feed/tag-feed.html',
      controller: 'tagFeedCtrl'
   })
   .state('userFeed', {
      url: '/user/:user_id',
      templateUrl: 'templates/feed/user-feed.html',
      controller: 'userFeedCtrl'
   })
   .state('newFeed', {
      url: '/new-feed',
      templateUrl: 'templates/feed/new-feed.html',
      controller: 'newFeedCtrl'
   });


	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/landing');

});
