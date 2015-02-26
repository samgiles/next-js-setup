/*jshint node:true*/
'use strict';

require('es6-promise').polyfill();
require('isomorphic-fetch');

var flags = require('next-feature-flags-client');
var Raven = require('./src/raven');
var userPrefs = require('next-user-preferences');

function init() {

	return flags.setUrl('/__flags.json').init().then(function() {

		if (flags.get('clientErrorReporting').isSwitchedOn) {
			Raven.config('https://edb56e86be2446eda092e69732d8654b@app.getsentry.com/32594').install();

			// normalise client and server side method names
			Raven.captureMessage = Raven.captureException;
		}

		if (flags.get('analytics').isSwitchedOn) {
			require('./src/tracking');
		}

		return flags;
	});
}

module.exports.raven = Raven;
module.exports.init = init;