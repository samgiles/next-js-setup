/*global require,describe,afterEach,xit,beforeEach,it,expect*/
'use strict';

var jsSetup = require('../main');
var JsSetup = require('../src/js-setup');
var sinon = require('sinon');
var flagsClient = require('next-feature-flags-client');
var Raven = require('../src/raven');
var userPrefs = require('next-user-preferences');
var beacon = require('next-beacon-component');

var ravenCaptureException = Raven.captureException;

var flags = {
	"clientErrorReporting": {
		"isSwitchedOn": true,
		"isSwitchedOff": false,
		"isPastSellByDate": false,
	},
	"analytics": {
		"isSwitchedOn": true,
		"isSwitchedOff": false,
		"isPastSellByDate": false,
	},
	"userPreferencesAPI": {
		"isPastSellByDate": false,
		"isSwitchedOff": false,
		"isSwitchedOn": true
	},
	"beacon": {
		"isPastSellByDate": false,
		"isSwitchedOff": false,
		"isSwitchedOn": true
	}
};

describe('js setup', function() {

	it('should polyfill fetch', function () {
		expect(window.fetch).to.be.a('function');
	});

	it('should have an init method', function () {
		expect(jsSetup.init).to.be.a('function');
	});

	it('should have an bootstrap method', function () {
		expect(jsSetup.bootstrap).to.be.a('function');
	});

	describe('init with flags off', function () {
		var server;
		beforeEach(function () {
			Raven.captureException = ravenCaptureException;
			server = sinon.fakeServer.create();
			server.respondWith("GET", "/__flags.json", [200, { "Content-Type": "application/json" },'[]']);
		});

		afterEach(function () {
			server.restore();
		});

		it('should not configure raven', function (done) {
			var spy = sinon.stub(Raven, 'config');
			var promise = new JsSetup().init({__testmode: true});
			server.respond();
			promise.then(function () {
				expect(spy.called).not.to.be.true;
				spy.restore();
				done();
			});
		});

		it('should export raven instance with noop functions', function (done) {
			var setup = new JsSetup();
			var promise = setup.init({__testmode: true});
			server.respond();
			promise.then(function () {
				expect(setup.raven).to.be.an('object');
				expect(setup.raven.captureMessage).to.be.a('function');
				expect(setup.raven.captureMessage).to.equal(JsSetup.noop);
				expect(setup.raven.captureException).to.equal(JsSetup.noop);
				done();
			});
		});

		it('should not init user userPreferences', function (done) {
			var spy = sinon.stub(userPrefs, 'init');
			var promise = new JsSetup().init({__testmode: true});
			server.respond();
			promise.then(function () {
				expect(spy.called).not.to.be.true;
				spy.restore();
				done();
			});

		});

		// beacon.init not defined yet
		xit('should not init beacon', function (done) {
			var spy = sinon.stub(beacon, 'init');
			var promise = new JsSetup().init({__testmode: true});
			server.respond();
			promise.then(function () {
				expect(spy.called).not.to.be.true;
				spy.restore();
				done();
			});

		});

		it('should return promise of flags', function (done) {
			var promise = new JsSetup().init({__testmode: true});
			server.respond();
			promise.then(function (result) {
				expect(result).to.be.an('object');
				expect(result.flags.getAll).to.be.a('function');
				done();
			});
		});
	});

	describe('init with flags on', function () {
		var server;
		var flagStub;
		beforeEach(function () {
			Raven.captureException = ravenCaptureException;
			server = sinon.fakeServer.create();
			server.respondWith("GET", "/__flags.json", [200, { "Content-Type": "application/json" }, JSON.stringify(flags)]);
			flagStub = sinon.stub(flagsClient, 'get', function (name) {
				return flags[name];
			});
		});

		afterEach(function () {
			server.restore();
			flagStub.restore();
		});

		it('should configure raven', function (done) {
			var spy = sinon.spy(Raven, 'config');
			var setup = new JsSetup();
			var promise = setup.init({__testmode: true});
			server.respond();
			promise.then(function () {
				expect(setup.raven).to.be.an('object');
				expect(spy.called).to.be.true;
				expect(setup.raven.captureMessage).to.be.a('function');
				expect(setup.raven.captureMessage).to.equal(setup.raven.captureMessage);
				expect(setup.raven.captureException).not.to.equal(JsSetup.noop);
				spy.restore();
				done();
			});
		});

		it('should init user userPreferences', function (done) {
			var ravenStub = sinon.stub(Raven, 'config', function () {
				return {install: function () {}};
			});
			var spy = sinon.stub(userPrefs, 'init');
			var promise = new JsSetup().init({__testmode: true});
			server.respond();
			promise.then(function () {
				expect(spy.called).to.be.true;
				spy.restore();
				ravenStub.restore();
				done();
			});

		});

		// beacon.init not defined yet
		xit('should init beacon', function (done) {
			var ravenStub = sinon.stub(Raven, 'config', function () {
				return {install: function () {}};
			});
			var spy = sinon.stub(beacon, 'init');
			var promise = new JsSetup().init({__testmode: true});
			server.respond();
			promise.then(function () {
				expect(spy.called).to.be.true;
				spy.restore();
				ravenStub.restore();
				done();
			});

		});

		it('should return promise of flags', function (done) {
			var ravenStub = sinon.stub(Raven, 'config', function () {
				return {install: function () {}};
			});
			var promise = new JsSetup().init({__testmode: true});
			server.respond();
			promise.then(function (result) {
				expect(result).to.be.an('object');
				expect(result.flags.getAll).to.be.a('function');
				ravenStub.restore();
				done();
			});
		});
	});

	describe('bootstrap', function () {
		var result = {};
		beforeEach(function () {
			sinon.stub(jsSetup, 'init', function () {
				return Promise.resolve(result);
			});
		});

		afterEach(function () {
			window.ftNextInitCalled = undefined;
			document.querySelector('html').classList.remove('js-success');
			jsSetup.init.restore();
		});

		it('should wait for polyfills to load if ftNextInit not called', function (done) {
			var callback = sinon.stub();
			jsSetup.bootstrap(callback).then(function () {
				expect(callback.calledOnce).to.be.false;
			});

			document.dispatchEvent(new Event('polyfillsLoaded'));

			setTimeout(function () {
				expect(callback.calledOnce).to.be.true;
				expect(callback.calledWith(result)).to.be.true;
				done();
			}, 0);
		});

		it('should run a callback with result of init immediately if ftNextInit already called', function (done) {
			window.ftNextInitCalled = true;
			var callback = sinon.stub();
			jsSetup.bootstrap(callback).then(function () {
				expect(callback.calledOnce).to.be.true;
				expect(callback.calledWith(result)).to.be.true;
				done();
			});
		});

		it('should pass an options object to init', function (done) {
			window.ftNextInitCalled = true;
			var callback = sinon.stub();
			var options = {};
			jsSetup.bootstrap(callback, options).then(function () {
				expect(jsSetup.init.calledWith(options)).to.be.true;
				done();
			});
		});

		it('should add js-success class if callback executes ok', function (done) {
			window.ftNextInitCalled = true;
			jsSetup.bootstrap(function () {	}).then(function () {
				expect(document.querySelector('html').classList.contains('js-success')).to.be.true;
				done();
			});
		});

		it('should not add js-success class if callback fails', function (done) {
			window.ftNextInitCalled = true;
			jsSetup.bootstrap(function () {
				throw 'error';
			})
			.catch(function () {
				expect(document.querySelector('html').classList.contains('js-success')).to.be.false;
				done();
			});
		});
	});
});
