/*jshint node:true*/
'use strict';

require('es6-promise').polyfill();
require('isomorphic-fetch');

var JsSetup = require('./src/js-setup');

module.exports = new JsSetup();
