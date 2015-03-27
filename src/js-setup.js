/*jshint node:true*/
'use strict';

var flags = require('next-feature-flags-client');
var Raven = require('./raven');
var userPrefs = require('next-user-preferences');
var beacon = require('next-beacon-component');
var welcome = require('next-welcome');

function extendWithCoreFeatures (obj) {
	Object.keys(coreFeatures).forEach(function (key) {
		obj[key] = true;
	});
}

var coreFeatures = {
	personalisedContentApi: true, //TODO remove from core
	raven: true,
	beacon: true
};

var wrapperFeatures = extendWithCoreFeatures({
	welcome: true,
	header: true,
	footer: true,
	personalisedContentUi: true
});


var JsSetup = function () {};

JsSetup.noop = function () {};

JsSetup.prototype.init = function (opts) {

	// may be used for app specific config in future
	opts = opts || {};

	var features = opts.features === 'wrapper' 			? wrapperFeatures :
								typeof opts.features === 'object' ? extendWithCoreFeatures(opts.features) : coreFeatures;

	try {
		flags.setUrl(opts.flagsUrl || '/__flags.json');
	} catch(e) {
		if (opts.__testmode) {
			// safely ignore
		} else {
			throw(e);
		}
	}

	return flags.init().then(function() {

		if (features.raven && flags.get('clientErrorReporting').isSwitchedOn) {
			Raven.config('https://edb56e86be2446eda092e69732d8654b@app.getsentry.com/32594').install();

			// normalise client and server side method names
			Raven.captureMessage = Raven.captureException;
		} else {
			Raven.captureMessage = Raven.captureException = JsSetup.noop;
		}

		this.raven = Raven;

		if (features.personalisedContentApi && flags.get('userPreferencesAPI').isSwitchedOn) {
			var userPrefsOpts = opts.userPreferences || {};
			userPrefsOpts.flags = flags;
			userPrefs.init(userPrefsOpts);
		}

		if (features.beacon && flags.get('beacon').isSwitchedOn) {
			beacon.init && beacon.init(opts.beacon);
		}

		if (features.header) {
			header.init();
		}

		if (features.footer) {
			footer.init();
		}

		// doesn't exist yet - bundled in with user prefs
		// if (features.personalisedContentUi) {
		// 	personalisedContentUi.init();
		// }

		if (features.welcome && flags.get('welcomePanel').isSwitchedOn) {
			welcome.init();
		}

		return {
			flags: flags
		};
	}.bind(this));
};

JsSetup.prototype.bootstrap = function (callback, opts) {

	var success = function () {
		document.documentElement.classList.add('js-success');
	};

	var go = function () {
		this.bootstrapResult = this.init(opts).then(function (result) {
			var promise = callback(result);
			if (promise && typeof promise.then === 'function') {
				promise.then(success);
			} else {
				success();
			}
		});
	}.bind(this);

	var waitThenGo = function () {
		document.addEventListener('polyfillsLoaded', function () {
			go();
		});
	};

	window.ftNextInitCalled ? go() : waitThenGo();
};


module.exports = JsSetup;
