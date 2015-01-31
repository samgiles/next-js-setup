# next-ui-setup

Generic global set up of common styling dependencies e.g. icons, fonts, buttons, typography

 - imports next-colors variables
 - assigns generic icon styles to the `.icon` class and points to build service for the icon font
 - imports fonts and sets up variables `$fontSans, $fontSerif, $fontBrand`
 - imports o-grid in non-silent mode


 This module is generally intended for direct consumption by applications (and should be included before all other sass) but may be included as a dependency of modules without adverse effects.
 
## Standardised names for classes & data attributes

Documented here as it seems as good a place as any

```yaml
data-content-id: 
  {capi uuid} or fastft-{fastft id} or ... extend sensibly as we bring in other content sources
  
data-concept-id:
  id of metadatum, wherever they be used (container for stream, tags etc.)
  
data-trackable:
  used by the tracking system to determine the dom path to the element being tracked
```
