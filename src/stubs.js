'use strict';

var initialised = false;

module.exports = {

	init: function () {
		if (!initialised) {
			// stub console
			if (!window.console) {
				window.console = {};
				var methods = ['info', 'log', 'warn', 'error'];
				for (var i = 0; i < methods.length; i++) {
					window.console[methods[i]] = function () {};
				}
			}
		}

		initialised = true;
	}

};
