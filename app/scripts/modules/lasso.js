/* global _ */


'use strict';


angular.module('Lasso', [ 'ngCookies', 'Communications', 'Storage' ])

/*
 * Detect if a user is already logged in. Only works on same domain, so will not 
 * work from localhost / staging environments.
 * https://extranet.atlassian.com/jira/browse/ISLP-1516
 */
.run(function ($rootScope, $location, User) {


	/*
	 * Environment check to bounce between production and staging servers
	 */
	if (_.contains(['localhost', 'pperry', 'willyp', 'davep' ], $location.host())) {
		User.environment({
			api:	'https://id.stg.iam.atlassian.com',
			id:		'https://id.stg.iam.atlassian.com'
		});

	} else if ($location.host() === 'qa-wac.internal.atlassian.com') {
		User.environment({
			api:	'https://qa-wac.internal.atlassian.com/lasso',
			id:		'https://id.stg.iam.atlassian.com',
			gapps:	'https://qa-wac.internal.atlassian.com/googleAuthSessionData'			
		});	

	} else if ($location.host() === 'dev-cart.atlassian.com') {
		User.environment({
			api:	'http://dev-cart.atlassian.com/lasso',
			id:		'http://dev-cart.atlassian.com/id',
			gapps:	'http://dev-cart.atlassian.com/gapps'			
		});
	}		


	/*
	 * If we don't see that the user is logged in already, inject an iframe on the page
	 * that pulls from Lasso which will tell us if the user is signed in or not.
	 * If the user is signed in, then extract the xsrf token from the iframe and get 
	 * user details (which will fetch user profile data and store in localstorage)
	 */
	angular.element('<iframe/>')
		.attr('src', User.environment().id + '/id/xsrfToken.action?domain=atlassian.com')
		.hide()
		.appendTo(angular.element('body'))
		.load(function () {

			var IFRAME, tokenElement;
			try {
				IFRAME = (this.contentWindow && this.contentWindow.document) ? this.contentWindow.document : this.contentDocument;
			} catch (e) {}

			if (IFRAME) {
				tokenElement = angular.element(IFRAME).find('#xsrfToken');
				if (tokenElement.length === 1 && tokenElement.text() !== '') {
					User.xsrfToken(tokenElement.text());
					$rootScope.$broadcast('$lassoLoggedIn');
					User.getInformation();				
				} else {
					$rootScope.$broadcast('$lassoNotLoggedIn');
				}			
			}
		});
	
})


/*
 * Service for dealing with user logged in/out state, and storing user session data
 * between views. Necessary for any requests that deal with viewing user account data.
 * Documentation Here:
 * https://extranet.atlassian.com/display/IT/JIRA+BTF+Evaluation+APIs
 * https://extranet.atlassian.com/display/IT/New+Order+Form+APIs
 * https://extranet.atlassian.com/jira/browse/ISLP-1531
 * https://extranet.atlassian.com/display/IT/Lasso+API
 */ 
.service('User', [ '$rootScope', '$http', '$window', '$location', '$q', '$cookies', 'Application', 'LocalStorage', 'SessionStorage', 'CookieStorage', 'ErrorHandler',
	function ($rootScope, $http, $window, $location, $q, $cookies, Application, LocalStorage, SessionStorage, CookieStorage, ErrorHandler) {


	/*
	 * Empty user object as used throughout Lasso service. Should be the default
	 * for signed out user
	 */
	var createEmptyUser = function () {
		return {
			contactDetails: {
				firstName: '',
				lastName: '',
				email: ''				
			},
			exists: false,
			xsrfToken: null,
			organisationDetails: {
				address1: '',
				address2: '',
				city: '',
				state: '',
				postcode: '',
				isoCountryCode: '',
				organisationName: '',
				organisationType: null,
				taxId: ''				
			},
			gappsData: null 
		};
	};

	/*
	 * Lasso urls:
	 * 1. api	- the Lasso rest API. proxied. 
	 * 2. id	 - xsrf token iframe url. proxied.
	 * 3. gapps  - rest API url for validating google apps token. proxied.
	 * 4. interceptor - login & logout lasso interceptor. not proxied.
	 */

	var ENVIRONMENT = {
			api: 'https://www.atlassian.com/apis/id',
			id: 'https://id.atlassian.com',
			gapps: 'https://www.atlassian.com/googleAuthSessionData'
		},
		USER = createEmptyUser(),
		LOGGED_IN = false;


	/*
	 * If for any reason, authenticated actions begin throwing 403 errors,
	 * deauthenticate the user by running this function. This removes all
	 * user data from the app/browser, and announces to the app that the user 
	 * is logged out.
	 */
	function deAuthenticate () {
		if (LOGGED_IN) {
			USER = createEmptyUser();
			LocalStorage.remove('btf.cart.uuid');
			CookieStorage.remove('BTFCARTUUID');
			SessionStorage.clear();
			$rootScope.$broadcast('$lassoLoggedOut');
			LOGGED_IN = false;
		}	
	}

	function lassoErrorCallback (data, status, headers) {
		var reason;
		deAuthenticate();
		if (headers('Content-Type') === 'application/json' && _.has(data, 'error')) {
			reason = data.error;
		}
		ErrorHandler.redirect(reason);
	}


	return {

		/*
		 * Getter | Setter for XSRF Toekn
		 */
		xsrfToken: function (token) {
			if (token) {
				USER.xsrfToken = token;
			}
			return USER.xsrfToken;
		},

		/*
		 * Getter | Setter for Environment (set in run function above)
		 */		 
		environment: function (providedOpts) {
			if (providedOpts && _.isObject(providedOpts)) {
				ENVIRONMENT = _.extend(ENVIRONMENT, providedOpts);
			}
			return ENVIRONMENT;
		},

		/*
		 * Getter | Setter for User data object above.
		 */		 
		details: function (providedOpts) {
			if (providedOpts && _.isObject(providedOpts)) {
				_.extend(USER.contactDetails, providedOpts);
			}
			return USER.contactDetails;
		},

		exists: function () {
			return USER.exists;
		},

		/*
		 * Google apps OpenID handshake. If the global value is currently null, it will try to instantiate
		 * it with the provided token. If no token is provided, it will assume no connection, and supplement
		 * with the falsy version of the data. Create a new GAPPS token on staging at
		 * http://intsys-staging.private.atlassian.com:8481/my/googleAuth/domain
		 */
		gappsData: function () {

			var deferred = $q.defer();

			if (_.has($location.search(), 'gappsToken') && !USER.gappsData) {
				$http.get(ENVIRONMENT.gapps + '/' + $location.search().gappsToken)
					.success(function (data) {
						USER.gappsData = data;
						USER.gappsData.token = $location.search().gappsToken;
						deferred.resolve(USER.gappsData);
					})	   
					.error(function () {
						deferred.resolve(USER.gappsData);
					});

			} else {
				deferred.resolve(USER.gappsData);
			}
			return deferred.promise;
		},			

		/*
		 * Getter | Setter for organisation details object above.
		 */
		organizationDetails: function (providedOpts) {
			if (providedOpts && _.isObject(providedOpts)) {
				_.extend(USER.organisationDetails, providedOpts);
			} 
			return USER.organisationDetails;
		},		

		/*
		 * Quick check to see if the user is currently logged in
		 */
		isLoggedIn: function () {
			LOGGED_IN = USER.xsrfToken ? true : false;
			return LOGGED_IN;
		},

		/*
		 * If a login suddenly quits working, set Lasso state back to logged-out mode
		 */
		deAuthenticate: function () {
			deAuthenticate();
		},

		/*
		 * Get User Details from API. Can only be executed for a logged in User.
		 * https://extranet.atlassian.com/display/IT/New+Order+Form+APIs
		 * UPDATED: https://extranet.atlassian.com/display/IT/Lasso+API#LassoAPI-3.FetchDetailsforCurrentUser
		 */
		getInformation: function () {

			var deferred = $q.defer();

			/*
			 * You cannot get user details unless the user is signed in, and we already
			 * have the xsrfToken from the lasso iframe
			 */
			if (!USER.xsrfToken) {
				deferred.reject({ 'error': 'No xsrf token present' });

			/*
			 * Ok, so we don't have user data and we CAN get it.. go on a fetch
			 * quest to Lasso to get the info
			 */
			} else {	

				$http({
					url: ENVIRONMENT.api + '/profile/rest/user/',
					method: 'GET',
					headers: {
						'ATL-XSRF-Token': USER.xsrfToken,
						'content-type': 'application/json'
					},
					withCredentials: true

				// If successful, update the USER object, add to localStorage and broadcast the login event
				}).success(function (data, status, headers) {
					if (status === 200 && headers('Content-Type') === 'application/json;charset=UTF-8') {
						_.extend(USER.contactDetails, data.contactDetails);
						_.extend(USER.organisationDetails, data.organisationDetails);
						USER.exists = true;
						LOGGED_IN = true;
						$rootScope.$broadcast('$lassoUserDetails');
						deferred.resolve(USER);	
					
					// If failure in any way, deauthenticate and reject the deferred object
					} else {
						deferred.reject();
						lassoErrorCallback (data, status, headers);
					}
				}).error(lassoErrorCallback);
			}

			return deferred.promise;	
		},

		/*
		 * Convenience for checking if the user is an expert / reseller
		 */
		isExpert: function () {
			if (LOGGED_IN) {
				return USER.organisationDetails.organisationType === 'EXPERT';
			}	
			return false;
		},

		isReseller: function () {
			if (LOGGED_IN) {
				return USER.organisationDetails.organisationType === 'RESELLER';
			}
			return false;
		},

		canPayOnAccount: function () {
			if (LOGGED_IN) {
				return USER.organisationDetails.organisationType === 'EXPERT' && USER.organisationDetails.payOnAccount;
			}
			return false;
		},

		/*
		 * Checks if a user is a registered user or not by looking up their email address
		 * returns a simple { exists: true|false } object.
		 * https://extranet.atlassian.com/display/IT/JIRA+BTF+Evaluation+APIs
		 */
		isRegistered: function (providedOpts) {

			var options = _.extend({ recheck: false }, providedOpts),
				deferred = $q.defer();

			if (!USER.exists || options.recheck) {
				$http.get(ENVIRONMENT.api + '/profile/rest/user/' + options.email)
					.success(function (data) {
						USER.exists = data.exists;
						deferred.resolve(data);
					})
					.error(function () {
						deferred.reject({ exists: false });
					});				
			} else {
				deferred.resolve({ exists: USER.exists });
			}

			return deferred.promise;
		}
	};
}])


/*
 * Login directive. Allows you to create a link that will prompt a login modal
 * window for the user to login. A callback function can be passed in to execute
 * upon successful login. 
 * 
 * USAGE:
 * <div 
 * 		lasso-login 									
 * 		theme="button|link"	  // the link to login can be a text link or a green button. Defaults to 'button' 
 * 		text="link text"	  // the text in the link or button. Defaults to 'Log In'
 *	  size="small|inline"		  // optional: additional button classes
 * ></div>
 */
.directive('lassoLogin', function (User, $window, $location) {
	return {
		restrict: 'A',
		template: '<a ng-click="login()" ng-show="theme==\'link\'">{{text}}</a><button class="button {{size}}" ng-click="login()" ng-show="theme==\'button\'"><span class="buttonTxt kulturista">{{text}}</span></button>',
		scope: {
			theme: '@',
			text: '@',
			size: '@'
		},
		link: function (scope) {
			scope.login = function () {
				$window.location.href = User.environment().id + '/id/login.action?continue=' + $location.absUrl();
			};
		}
	};
})


/*
 * Environment aware links (mac or lasso). Replace with staging environments
 * if running on QA or local dev envs. Only use when an href is explicitly set
 * in the markup
 */
.directive('atlEnvLink', function ($location) {

	var getEnvironment = function (href) {
		var devEnvs = [ 'localhost', 'pperry', 'willyp', 'davep', 'qa-wac.internal.atlassian.com', 'dev-cart.atlassian.com' ];
		if (_.contains(devEnvs, $location.host())) {
			href = href
				.replace(/https?\:\/\/my\.atlassian\.com/, 'http://my.dev1.intsys.atlassian.com')
				.replace(/https?\:\/\/id\.atlassian\.com/, 'https://id.stg.iam.atlassian.com');
		}
		return href;
	};

	return {
		restrict: 'A',
		link: function (scope, elm, attr) {
			elm.bind('mousedown', function () {
				var href = getEnvironment(elm.attr('href'));
				if (href !== attr.href || href !== elm.attr('href')) {
					elm.attr('href', href);
				}					
			});
		}
	};
});
