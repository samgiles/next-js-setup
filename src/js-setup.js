/*jshint node:true*/
'use strict';

var flags = require('next-feature-flags-client');
var Raven = require('./raven');
var userPrefs = require('next-user-preferences');
var beacon = require('next-beacon-component');
var welcome = require('next-welcome');

var JsSetup = function () {};

JsSetup.noop = function () {};

JsSetup.prototype.init = function (opts) {

	// may be used for app specific config in future
	opts = opts || {};

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

		if (flags.get('clientErrorReporting').isSwitchedOn) {
			Raven.config('https://edb56e86be2446eda092e69732d8654b@app.getsentry.com/32594').install();

			// normalise client and server side method names
			Raven.captureMessage = Raven.captureException;
		} else {
			Raven.captureMessage = Raven.captureException = JsSetup.noop;
		}

		this.raven = Raven;

		if (flags.get('userPreferencesAPI').isSwitchedOn) {
			var userPrefsOpts = opts.userPreferences || {};
			userPrefsOpts.flags = flags;
			userPrefs.init(userPrefsOpts);
		}

		if (flags.get('beacon').isSwitchedOn) {
			beacon.init && beacon.init(opts.beacon);
		}

		if (flags.get('welcomePanel').isSwitchedOn) {
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
				return promise.then(success);
			} else {
				success();
			}
		}).catch(function (err) {
			if (result.flags.get('clientErrorReporting').isSwitchedOn) {
				setTimeout(function () {
					throw err;
				}, 0);
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
