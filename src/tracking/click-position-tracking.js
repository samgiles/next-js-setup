//NOTE: Reverse engineered from FT.com click pos tracking and removed jQuery and FT specific stuff

var oDom = require('o-dom');
var Delegate = require('dom-delegate');
var delegate = new Delegate(document.body);

var alreadyClickedLinks = [];

    /**
     * Returns a string with the element info in the format of SI tracking.
     * @param info Object Info about the elements in the format returned by the getElementInfo function
 */
function getSiFormatOfElementInfo(info) {
    return [
        info.zone,
        info.container,
        info.pos,
        info.name,
        info.storyPackage
    ].filter(function (obj) { return (obj); }).join('/');
}

//next has a different URL structure so use our own link formatting function
//note: this means that the chrome plugin will show link incorrectly
function getNextLinkName(element) {
    var name = element.getAttribute('href') || '';
    name = (name.indexOf('/search') === 0) ? name.split('?q=')[1] : name;
    return name.replace(/"/g, '').replace(/:/g, '-').replace(/ /, '-').toLowerCase();
}
/**
 * Returns the element positioning info:
 * zone, component view, component name, component index and position
 *
 * @param element Object The element clicked.
 */
function getElementInfo(element) {
    var zone = oDom.getClosestMatch(element, '[data-track-zone], [data-zone]'),
        container = oDom.getClosestMatch(element, '[data-track-comp-view], [data-track-comp-name], [data-comp-view], [data-comp-name]'),
        pos = oDom.getClosestMatch(element, '[data-track-pos], [data-pos]'),
        name = getNextLinkName(element),
        story = oDom.getClosestMatch(element, '.contentPackage, [data-track-region]'); // Data track region would allow us to specify something other than "story" in the future.

    // Build in error coping, as above assumes all attributes are there and available.
    zone = (zone ? (zone.getAttribute('data-track-zone') || zone.getAttribute('data-zone')) : null);
    container = (container ? (container.getAttribute('data-track-comp-view') || container.getAttribute('data-track-comp-name') || container.getAttribute('data-comp-view') || container.getAttribute('data-comp-name')) : null);
    pos = (pos ? (typeof pos.getAttribute('data-track-pos') !== "undefined" ? pos.getAttribute('data-track-pos') : pos.getAttribute('data-pos')).toString() : null);
    
    story = !!story.length;

  
    // Remove slashes as final outcome is slash delimited

    return {
        zone: zone,
        container: container,
        pos: pos,
        name: name,
        storyPackage: (story ? 'storyPackage' : null)
    };
}

function getPosition(element) {
    return getSiFormatOfElementInfo(getElementInfo(element));
}

/**
 * Tracks the click on a link that has a position and sends the analytics info
 * to the Site Intelligence.
 *
 * @param element Object The element clicked.
 */
function trackLink(element) {

    if (alreadyClickedLinks.indexOf(element) === -1) {
        alreadyClickedLinks.push(element);
        var analyticsInfo = getPosition(element);

        if (analyticsInfo.length) {
            element.setAttribute('si:link', analyticsInfo);

            if (element.hostname) {
                if (element.hostname.indexOf('ft.com') !== -1) {
                    Track.IJento.getSiTracker().trackLink(element);
                } else {
                    Track.IJento.getSiTracker().trackExternalLink(element);
                }
            }
        }
    }
}

function addEventListeners(d) {
    delegate.on('mouseup', '[data-pos] a, [data-track-pos] a', function (event, el) {

        if (event.which === 1 || event.which === 2) { // left and middle buttons only
            trackLink(el);
        }
    });
    delegate.on('click', '[data-pos] a, [data-track-pos] a', function (event, el) {
        trackLink(el);
    });
}

function destroy() {
    delegate.off();
}

function init(d) {
    if (typeof d === "undefined") {
        d = document;
    } else {
        d = d;
    }

    destroy();
    addEventListeners(d);
}

module.exports = {
    init: init,
    getPosition: getPosition,
    alreadyClickedLinks: function () { return alreadyClickedLinks; },
    destroy: destroy
};
