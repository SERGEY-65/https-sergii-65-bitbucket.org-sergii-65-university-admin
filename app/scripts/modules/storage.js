/* global _, escape, unescape */

'use strict';


angular.module('Storage', [])


/*
 * Abstraction library for storing data in the browser. Handles all the actual
 * browser interaction. LocalStorage, SessionStorage and CookieStorage services
 * will only be responsible for organizing the data to be stored, then will pass to this
 * service to communicate it to and from the browser.
 */
.service('BrowserStorage', [ '$window', '$document', function ($window, $document) {


	/*
	 * Prefix all keys stored in local storage to avoid overwrites with other apps / instances
	 */
	var prefix = 'com.atlassian.angular.sc',


	/*
	 * Check browser support for storage type, and save the resulting test in browserSupport obj 
	 */
	browserSupport = {},
	supports = function (storageType) {
		if (_.has(browserSupport, storageType)) {
			return browserSupport[storageType];
		}
		if (_.contains(['localStorage', 'sessionStorage'], storageType)) {
			try {
				browserSupport[storageType] = typeof $window[storageType] === 'object' && 
					typeof $window[storageType].setItem === 'function' && 
					typeof $window[storageType].getItem === 'function' && 
					typeof $window[storageType].clear   === 'function';
			} catch (e) {
				browserSupport[storageType] = false;
			}
		} else if (storageType === 'cookie') {
			try {
				browserSupport.cookie = typeof $document[0].cookie === 'string';
			} catch (e) {
				browserSupport.cookie = false;
			}
		}
		return browserSupport[storageType];	
	};



	return {

		/*
		 * Add to local or session storage. Can use nested keys to assign values
		 * to sub-properties of the main object. 
		 * Don't add null or undefined, but 0 and '' and false are okay
		 */	
		setItem: function (value, storageType) {
			if (supports(storageType)) {
				$window[storageType].setItem(prefix, JSON.stringify(value));
			}			
		},

		/*
		 * Get value from local or session storage. Can use nested keys to 
		 * retrieve properties nested deep within the storage object.
		 */
		getItem: function (storageType) {
			if (supports(storageType)) {
				return JSON.parse($window[storageType].getItem(prefix));
			}
			return null;
		},

		/*
		 * Clear browser storage of x type
		 */
		clear: function (storageType) {
			if (supports(storageType)) {
				$window[storageType].clear();
			}
		},

		/*
		 * Add cookie value. Accepts a hash of cookie options to set, or
		 * uses default values if not provided.
		 */
		setCookie: function (key, value, providedOptions) {

			var options = {
				end: Infinity,
				path: '/',
				domain: '.atlassian.com'
			};

			if (supports('cookie')) {
				if (providedOptions) {
					options = _.extend(options, providedOptions);
				}
				switch (options.end.constructor) {
					case Number:
						options.end = options.end === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + options.end;
						break;
					case String:
						options.end = '; expires=' + options.end;
						break;
					case Date:
						options.end = '; expires=' + options.end.toGMTString();
						break;
				}

				$document[0].cookie = escape(key) + 
				'=' + 
				escape(value) + 
				options.end + 
				'; domain=' + options.domain + 
				'; path=' + options.path;
			}
		},

		/*
		 * Retrieve a cookie value.
		 * Regex shamelessly stolen from https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
		 */
		getCookie: function (key) {
			return unescape($document[0].cookie
				.replace(new RegExp('(?:(?:^|.*;)\\s*' + escape(key).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
		},

		/*
		 * Clear a cookie by updating its expiry to an expired date
		 * Also shamelessly stolen from https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
		 */
		clearCookie: function (key) {
			var regex =  new RegExp('(?:^|;\\s*)' + escape(key).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=');
			if (regex.test($document[0].cookie)) {
				this.setCookie(key, '', { end: 'Thu, 01 Jan 1970 00:00:00 GMT' });
			}
		}
	};
}])


/*
 * Local storage service for keeping state in browser sessionStorage (if supported) so all work is
 * not lost on refresh. Based in part on https://github.com/grevory/angular-local-storage/blob/master/localStorageModule.js
 */
.service('LocalStorage', [ '$parse', 'BrowserStorage', function ($parse, BrowserStorage) {
	

	var STORAGE_OBJECT = {
		timestamp: Date.parse(new Date())
	};

	var priorStorage = BrowserStorage.getItem('localStorage');
	if (priorStorage && _.has(priorStorage, 'timestamp')) {
		var timestamp = new Date(priorStorage.timestamp),
			ageInDays = (new Date() - timestamp) / 1000 / 60 / 60 / 24;
		if (ageInDays > 30) {
			try {
				BrowserStorage.clear('localStorage');
			} catch (e) {}
		} else {
			STORAGE_OBJECT = priorStorage;
		}
	}
	
	return {

		/*
		 * Add value to local storage
		 */ 
		add: function (key, value) {
			// don't add null or undefined, but 0 and '' and false are okay
			if (!value && value !== 0 && value !== '' && value !== false) {
				return false;
			}	
			var setter = $parse(key).assign;
				setter(STORAGE_OBJECT, value);
			BrowserStorage.setItem(STORAGE_OBJECT, 'localStorage');
			// console.log('adding to local storage', STORAGE_OBJECT);
		},

		/*
		 * Retrieve a value from local storage
		 */
		get: function (key) {
			var storedData = BrowserStorage.getItem('localStorage');
			// console.log('retrieving from local storage', storedData);
			return $parse(key)(key, storedData);
		},

		/*
		 * "Remove" an item from the storage object. Basically, just nullify the value
		 */
		remove: function (key) {
			var setter = $parse(key).assign;
				setter(STORAGE_OBJECT, null);
			BrowserStorage.setItem(STORAGE_OBJECT, 'localStorage');
		},

		/*
		 * Clear all items from local storage for this app, and reset the 
		 * storage object in memory to it's initial empty value
		 */
		clear: function () {
			BrowserStorage.clear('localStorage');
			// console.log('cleared local storage', BrowserStorage.getItem('localStorage'))
		}
	};
}])


/*
 * Session storage service for keeping state in browser sessionStorage (if supported) so all work is
 * not lost on refresh. 
 */
.service('SessionStorage', [ '$parse', 'BrowserStorage', function ($parse, BrowserStorage) {
	

	var STORAGE_OBJECT = BrowserStorage.getItem('sessionStorage') || {};


	return {

		/*
		 * Add value to session storage
		 */ 
		add: function (key, value) {
			// don't add null or undefined, but 0 and '' and false are okay
			if (!value && value !== 0 && value !== '' && value !== false) {
				return false;
			}	
			var setter = $parse(key).assign;
				setter(STORAGE_OBJECT, value);
			BrowserStorage.setItem(STORAGE_OBJECT, 'sessionStorage');
			// console.log('adding to session storage', STORAGE_OBJECT);
		},

		/*
		 * Retrieve a value from session storage
		 */
		get: function (key) {
			var storedData = BrowserStorage.getItem('sessionStorage');
			// console.log('retrieving from session storage', storedData);
			return $parse(key)(key, storedData);
		},

		/*
		 * "Remove" an item from the storage object. Basically, just nullify the value
		 */
		remove: function (key) {
			var setter = $parse(key).assign;
				setter(STORAGE_OBJECT, null);
			BrowserStorage.setItem(STORAGE_OBJECT, 'sessionStorage');
		},		

		/*
		 * Clear all items from session storage for this app, and reset the 
		 * storage object in memory to it's initial empty value
		 */
		clear: function () {
			BrowserStorage.clear('sessionStorage');
			// console.log('cleared session storage', BrowserStorage.getItem('sessionStorage'))
		}
	};
}])


/*
 * Cookie storage service for storing data in cookies.
 */
.service('CookieStorage', [ 'BrowserStorage', function (BrowserStorage) {

	var COOKIES = {};

	return {

		add: function (key, value, options) {
			BrowserStorage.setCookie(key, value, options);
			COOKIES[key] = value;
		},

		get: function (key) {
			COOKIES[key] = BrowserStorage.getCookie(key);
			return COOKIES[key];
		},

		remove: function (key) {
			BrowserStorage.clearCookie(key);
			if (_.has(COOKIES, key)) {
				delete COOKIES[key];
			}
		},

		clear: function () {
			_.each(COOKIES, function (value, key) {
				BrowserStorage.clearCookie(key);
			});
			COOKIES = {};
		}
	};
}])


/*
 * Save this form element to sessio storage on data entry or anytime
 * the model data changes
 */
.directive('atlSessionStore', function (SessionStorage, $timeout) {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function (scope, elm, attr, ngModelCtrl) {

			var tag          = elm.prop('tagName').toLowerCase(),
				type         = elm.prop('type'),
				key          = _.compact([attr.atlSessionStore, attr.name]).join('.'),
				defaultValue = SessionStorage.get(key) || '',
				addToSessionStorage = function () {
					SessionStorage.add(key, ngModelCtrl.$viewValue);
				};

			if (defaultValue) {
				ngModelCtrl.$setViewValue(defaultValue);
				$timeout(function () {
					ngModelCtrl.$render();
				});
			}

			scope.$watch(function () {
				return scope.$eval(attr.ngModel);
			}, function (newVal, oldVal) {
				if (newVal || newVal !== oldVal) {
					addToSessionStorage();					
				}
			});
			
			if (tag === 'input' && _.contains(['text', 'email', 'phone', 'password'], type)) {
				elm.bind('keydown', addToSessionStorage);

			} else if (tag === 'input' && _.contains(['checkbox', 'radio'], type)) {
				elm.bind('click', addToSessionStorage);

			} else if (tag === 'select') {
				elm.bind('change', addToSessionStorage);
			}
		}
	};
});