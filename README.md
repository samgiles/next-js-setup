# next-js-setup [![Build Status](https://travis-ci.org/Financial-Times/next-js-setup.svg?branch=js)](https://travis-ci.org/Financial-Times/next-js-setup)

Set up of shared js dependencies

 - Sets up of raven error reporting
 - Sets up tracking
 - polyfills fetch
 - initialises feature flags
 - initialises the user preferences api client
 - initialises the beacon client

 ```js

 require('next-js-setup').init(options)

 ```

 Where options can have properties `userPreferences`, `beacon` which can be used to pass config on to those components.

`init()` returns:

```javascript
{
	flags: // the instance of the [feature flags client](https://github.com/Financial-Times/next-feature-flags-client) in use by the client side code
}
```

This module is mainly for direct consumption by applications, and `init()` should never be called within a component
