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

When next-mustard is used by your app to handle cutting the mustard, polyfill loading etc. the boostrap method should be used

```js
require('next-js-setup').bootstrap(callback, options);
```

Where callback is a function that starts your app and takes a single parameter which is the object the init promise resolves with.


This module is mainly for direct consumption by applications, and `init()` should never be called within a component
