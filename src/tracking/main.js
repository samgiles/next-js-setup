function sendNextChannel() {
	if(Track && Track.IJento) {
		Track.IJento.getSiTracker().addTrackParam('channel', 'next');
		Track.IJento.getSiTracker().sendTrackParams();
	}
}

sendNextChannel();
require('./click-position-tracking').init();
