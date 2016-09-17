app
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
	if (!ionic.Platform.isIOS()) {
		$ionicConfigProvider.scrolling.jsScrolling(false);
	}
    // App starting controller

    $stateProvider.state('app-start', {
        url: '/app-start',
        abstract: false,
        templateUrl: 'templates/app/app-start.html',
        controller: 'appStartCtrl'
    });

    // App landing controller
    $stateProvider.state('landing', {
        url: '/landing',
        abstract: false,
        templateUrl: 'templates/app/app-landing.html',
        controller: 'appLandingCtrl'
    });

    	$stateProvider
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
			cache:false,
			views: {
				'menuContent': {
					templateUrl: 'templates/home/home.html',
					controller: 'HomeCtrl'
				}
			}
		})
		
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
		url: '/vendorDetails/:ven_id',
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
		cache:false,
		templateUrl: 'templates/user/bookings.html',
		controller: 'BookingsCtrl'
	});
	//State for booking detail
	$stateProvider.state('bookingDetail', {
		url: '/bookingDetail/:bookingId',
		cache:false,
		templateUrl: 'templates/user/bookingDetail.html',
		controller: 'BookingDetailCtrl'
	});

	//State for search
	$stateProvider.state('search', {
		url: '/search',
		cache:false,
		templateUrl: 'templates/home/search.html',
		controller: 'SearchCtrl'
	});

	//State for location
	$stateProvider.state('location', {
		url: '/location',
		cache:false,
		templateUrl: 'templates/home/location.html',
		controller: 'LocationCtrl'
	});

	//State for service list
	$stateProvider.state('salonServices', {
		url: '/salonServices',
		cache:false,
		templateUrl: 'templates/home/service-list.html',
		controller: 'ServiceListCtrl'
	});

	$stateProvider.state('contact', {
		url: '/contact',
		templateUrl: 'templates/legal/contact.html',
		controller:'ContactCtrl'

	});

	//State for favorates vendor
	$stateProvider.state('favorate', {
		url: '/favorate',
		templateUrl: 'templates/home/favorate.html',
		controller: 'FavorateCtrl'
	});

	//State for cart
	$stateProvider.state('cart', {
		url: '/cart/:ven_id',
		cache:false,
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
		cache:false,
		templateUrl: 'templates/vendor/vendorList.html',
		controller: 'VendorListCtrl'
	});

	$stateProvider.state('vendorMenu', {
		url: '/vendorMenu/:vendor_id',
		cache:false,
		templateUrl: 'templates/vendor/vendor-menu.html',
		controller: 'VendorServicesListCtrl'
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

	$stateProvider.state('map', {
		url: '/map/:lat/:lng/:add1/:add2/:name',
		templateUrl: 'templates/vendor/map.html',
		controller: 'mapCtrl'
	});


	// $stateProvider.state('new-slider', {
	// 	url: '/new-slider',
	// 	templateUrl: 'templates/home/new-slider.html',
	// 	controller: 'NewSliderCtrl'
	// });

	//State for user wallet
	$stateProvider.state('userWallet', {
		url: '/userWallet',
		templateUrl: 'templates/user/userWallet.html',
		controller: 'UserWalletCtrl'
	});

	//State for user wallet
	$stateProvider.state('vendor-services-list', {
		url: '/vendor-services-list/:vendor_id',
		templateUrl: 'templates/vendor/vendor-services-list.html',
		controller: 'VendorServicesListCtrl'
	});

	$stateProvider.state('profile', {
		url: '/profile',
		templateUrl: 'templates/user/profile.html',
		controller: 'profileCtrl',
		resolve: {
			currentAuth: function(AuthenticationService){
				return AuthenticationService.checkAuthentication();
			}
		}
	});

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

	// $urlRouterProvider.otherwise('/app-start');

	var hasCurrentBooking = checkLocalStorage('currentBooking');
	console.log("hasCurrentBooking",hasCurrentBooking);
	if(hasCurrentBooking == true){
		$urlRouterProvider.otherwise("/bill");
	}
	else if(window.localStorage.getItem('SkipIntro')== "true"){
		$urlRouterProvider.otherwise("/app/home");
	}else{
		$urlRouterProvider.otherwise("/app-start");
	}
});


