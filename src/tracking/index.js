'use strict';

module.exports = {
	init: function () {

		var Track = require('./ft-tracking');

		function sendNextChannel() {
			if(Track && Track.IJento) {
				Track.IJento.getSiTracker().addTrackParam('channel', 'next');
				Track.IJento.getSiTracker().sendTrackParams();
			}
		}

		sendNextChannel();
		require('./attention-time').init();

	}
};
