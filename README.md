# next-js-setup [![Build Status](https://travis-ci.org/Financial-Times/next-js-setup.svg?branch=js)](https://travis-ci.org/Financial-Times/next-js-setup)

Set up of shared js dependencies

 - Sets up of raven error reporting
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

Where callback is a function that starts your app and takes a single parameter which is the object the init promise resolves with.

#### html

Include `{{>next-js-setup/templates/ctm}}` in the `<head>` and `{{>next-js-setup/templates/script-loader}}` just before the closing `</body>` tag

## Tracking

Include `{{>next-js-setup/templates/tracking}}` just before the closing `</body>` tag

