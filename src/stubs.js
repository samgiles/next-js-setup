'use strict';

module.exports = {

	init: function () {
		// stub console
		if (!window.console) {
			window.console = {};
			var methods = ['info', 'log', 'warn', 'error'];
			for (var i = 0; i < methods.length; i++) {
				window.console[methods[i]] = function () {};
			}
		}
	}

};
