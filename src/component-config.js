module.exports = {
    init: function (flags) {
        return {
            articleCard: {
                withVideo: flags.get('brightcove').isSwitchedOn && flags.get('videoInCard').isSwitchedOn,
                ...
            },
            header: {
                withSearch: flags.get('search').isSwitchedOn
            }
        }
    }
}


// example code for app

var setup = require('next-js-setup');

setup.init().then(function (flags) {
    require('next-article-card').init(document.body, setup.somponentConfig.articleCard)
});


// then article-card-component can be free of flags