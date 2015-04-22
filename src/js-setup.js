/*jshint node:true*/
'use strict';

require('./stubs').init();
var flags = require('next-feature-flags-client');
var Raven = require('./raven');
var myFtClient = require('next-myft-client');
var myFtUi = require('next-myft-ui');
var beacon = require('next-beacon-component');
var welcome = require('next-welcome');
var attachFastClick = require('fastclick');
var hoverable = require('o-hoverable');

var JsSetup = function () {};

JsSetup.noop = function () {};

JsSetup.prototype.init = function (opts) {

	// may be used for app specific config in future
	opts = opts || {};

	attachFastClick(document.body);
	hoverable.init();

	return flags.init({ url: opts.flagsUrl || '/__flags.json' }).then(function() {

		if (flags.get('clientErrorReporting')) {
			Raven.config('https://edb56e86be2446eda092e69732d8654b@app.getsentry.com/32594').install();

			// normalise client and server side method names
			Raven.captureMessage = Raven.captureException;
		} else {
			Raven.captureMessage = Raven.captureException = JsSetup.noop;
		}

		this.raven = Raven;

		if (flags.get('userPreferencesAPI')) {

			var myFtOpts = opts.myFtOpts || {};
			myFtOpts.follow = flags.get('follow');
			myFtOpts.saveForLater = flags.get('saveForLater');
			myFtOpts.recommend = flags.get('recommend');
			myFtClient.init(myFtOpts);

			// todo move into next-ui eventually
			myFtUi.init();
		}

		if (flags.get('beacon')) {
			beacon.init && beacon.init(opts.beacon);
			beacon.fire('pageview');
		}

		if (flags.get('welcomePanel')) {
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
		var flags;
		this.bootstrapResult = this.init(opts).then(function (result) {
			flags = result.flags;
			var promise = callback(result);
			if (promise && typeof promise.then === 'function') {
				return promise.then(success);
			} else {
				success();
			}
		}).catch(this._throw);
	}.bind(this);

	var waitThenGo = function () {
		document.addEventListener('polyfillsLoaded', function () {
			go();
		});
	};

	window.ftNextInitCalled ? go() : waitThenGo();
};


JsSetup.prototype._throw = function (err) {
	setTimeout(function () {
		throw err;
	}, 0);
};

module.exports = JsSetup;
