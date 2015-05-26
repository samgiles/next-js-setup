var ua = new (require('ua-parser-js'))(window.navigator.userAgent);
var browser = (function () {
    var uaProps = ua.getBrowser();
    return uaProps.name + '_' + uaProps.major;
})();
var os = (function () {
    var uaProps = ua.getOS();
    return uaProps.name + '_' + uaProps.version;
})();

JsSetup.prototype.splunk = function (message, source) {

    var report = {
        msg: message,
        time: (new Date()).toISOString(),
        url: window.location.href,
        source: source || 'no file specified',
        appVersion: this.appVersion,
        app: this.appName,
        browser: browser,
        os: os
    };

    if (this.isProduction) {
        var request = new Image();
        request.src = 'http://track.ft.com/log?type=errors&' + Object.keys(report).filter(function (key) {
            return report[key];
        }).map(function (key) {
            return key + '=' + encodeURIComponent(report[key]);
        }).join('&');
    } else {
        console.log(errorData);
    }
}
