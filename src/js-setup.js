/*jshint node:true*/
'use strict';

var flags = require('next-feature-flags-client');
var Raven = require('./raven');
var userPrefs = require('next-user-preferences');
var beacon = require('next-beacon-component');
var tracking = require('./tracking');

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

		if (flags.get('analytics').isSwitchedOn) {
			tracking.init();
		}

		if (flags.get('userPreferences').isSwitchedOn) {
			userPrefs.init(opts.userPreferences);
		}

		if (flags.get('beacon').isSwitchedOn) {
			beacon.init && beacon.init(opts.beacon);
		}

		return {
			flags: flags
		}
	}.bind(this));
};

module.exports = JsSetup;
