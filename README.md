# next-ui-setup

Generic global set up of common styling dependencies e.g. icons, fonts, buttons, typography

 - imports next-colors variables
 - assigns generic icon styles to the `.icon` class and points to build service for the icon font
 - imports fonts and sets up variables `$fontSans, $fontSerif, $fontBrand`
 - imports o-grid in non-silent mode


 This module is generally intended for direct consumption by applications (and should be included before all other sass) but may be included as a dependency of modules without adverse effects.