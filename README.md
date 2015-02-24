# next-js-setup [![Build Status](https://travis-ci.org/Financial-Times/next-js-setup.svg?branch=js)](https://travis-ci.org/Financial-Times/next-js-setup)

Set up of shared js dependencies

 - Setting up of raven error reporting
 - Sets up tracking
 - polyfills Promise and fetch


 ```js

 require('next-js-setup').init()

 ```

 This module is mainly for direct consumption by applicationss, and `init()` should never be called within a component