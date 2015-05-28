# next-js-setup [![Build Status](https://travis-ci.org/Financial-Times/next-js-setup.svg?branch=master)](https://travis-ci.org/Financial-Times/next-js-setup)

Set up of shared js dependencies

 - Initialises o-errors for error logging
 - Sets up tracking
 - polyfills fetch
 - initialises feature flags
 - initialises the user preferences api client
 - initialises the beacon client


## Initialisation

2 methods of initialisation are provided

### init
 ```js

 require('next-js-setup').init(options)

 ```

Where options can have properties `userPreferences`, `beacon` which can be used to pass config on to those components.

`init()` returns a promise for:

```javascript
{
	flags: // the instance of the [feature flags client](https://github.com/Financial-Times/next-feature-flags-client) in use by the client side code
}
```

### bootstrap

This module contains code to run the standard next cut the mustard test, polyfill missing features and run your application code.

#### javascript

```js
require('next-js-setup').bootstrap(callback, options);
```

Where callback is a function that starts your app and will be passed the result of `init()` as its first parameter. If callback returns a promise all post init actions (e.g. adding a `js-success` class to html) will be deferred until that promise resolves (useful for applications which contain a significant amount of asynchronous initialisation)

#### html

Include `{{>next-js-setup/templates/ctm}}` in the `<head>` and `{{>next-js-setup/templates/script-loader}}` just before the closing `</body>` tag

## Tracking

Include `{{>next-js-setup/templates/tracking}}` just before the closing `</body>` tag
