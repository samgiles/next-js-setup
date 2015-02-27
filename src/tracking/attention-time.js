/* jshint ignore:start */
var Track = require('./ft-tracking');

var totalAttentionTime = 0,
startAttentionTime,
endAttentionTime,
attentionTimeout,
constantAttentionInterval,
ATTENTION_INTERVAL = 5000,
ATTENTION_EVENTS = ['load', 'click', 'focus', 'scroll', 'mousemove', 'touchstart', 'touchend', 'touchcancel', 'touchleave'],
UNATTENTION_EVENTS = ['blur'],
eventToSend = ('onbeforeunload' in window) ? 'beforeunload' : 'unload',
hasSent = false,
i;

var hidden, visibilityChange;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
	hidden = "hidden";
	visibilityChange = "visibilitychange";
} else if (typeof document.mozHidden !== "undefined") {
	hidden = "mozHidden";
	visibilityChange = "mozvisibilitychange";
} else if (typeof document.msHidden !== "undefined") {
	hidden = "msHidden";
	visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
	hidden = "webkitHidden";
	visibilityChange = "webkitvisibilitychange";
}

	function startAttention(e) {
		clearTimeout(attentionTimeout);
		if(!startAttentionTime) {
			startAttentionTime = (new Date()).getTime();
		}
		attentionTimeout = setTimeout(endAttention, ATTENTION_INTERVAL);
	}

	function startConstantAttention() {
		constantAttentionInterval = setInterval(startAttention, ATTENTION_INTERVAL);
	}

	function endConstantAttention() {
		endAttention();
		clearInterval(constantAttentionInterval);
	}

	function endAttention() {
		if(startAttentionTime) {
			endAttentionTime = (new Date()).getTime();
			totalAttentionTime += Math.round((endAttentionTime - startAttentionTime)/1000);
			clearTimeout(attentionTimeout);
			startAttentionTime = null;
		}
	}

	function track(type, time) {
		if ( Track && Track.IJento ) {
			Track.IJento.getSiTracker().addTrackParam("attention",time);
			Track.IJento.getSiTracker().sendTrackParams();
		}
	}

	function addEvent(ev, func) {
		if(typeof window.addEventListener === 'function') {
			window.addEventListener(ev, func, false);
		} else if(typeof window.attachEvent === 'function') {
			window.attachEvent('on' + ev, func);
		}
	}

	function addVideoEvents() {
		var videoPlayers;
		if(window.FTVideo) {
			videoPlayers = document.getElementsByClassName('BrightcoveExperience');
			for(var i=0; i<videoPlayers.length;i++) {
				FTVideo.createPlayerAsync(videoPlayers[i].id, function(player) {
					player.on(player.MEDIA_PLAY_EVENT, startConstantAttention);
					player.on(player.MEDIA_STOP_EVENT, endConstantAttention);
				});
			}
		} else {
			videoPlayers = document.getElementsByTagName('video');
			for(var i=0; i<videoPlayers.length;i++) {
				videoPlayers[i].addEventListener('playing', startConstantAttention);
				videoPlayers[i].addEventListener('pause', endConstantAttention);
				videoPlayers[i].addEventListener('ended', endConstantAttention);
			}
		}
	}


	function handleVisibilityChange(e) {
		if(document[hidden]) {
			endAttention(e);
		} else {
			startAttention(e);
		}
	}


	function init() {
		//Add events for all the other Attention events
		for(i=0;i<ATTENTION_EVENTS.length; i++) {
			addEvent(ATTENTION_EVENTS[i], startAttention);
		}

		for(i=0;i<UNATTENTION_EVENTS.length; i++) {
			addEvent(UNATTENTION_EVENTS[i], endAttention);
		}

	//Use Page Visibility API if it exists
	if(hidden) {
		document.addEventListener(visibilityChange, handleVisibilityChange, false);
	}

	addVideoEvents();

	//Add event to send data on unload
	addEvent(eventToSend, function() {
		endAttention();
		track(eventToSend, totalAttentionTime);
	});

}

module.exports = {
	init: init
}
/* jshint ignore:end */
