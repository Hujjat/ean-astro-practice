import '../../scss/theme.scss';

import {focusHash, bindInPageLinks} from '@shopify/theme-a11y';

import '../filters/currency';
import '../filters/currencyFromCents';
import '../filters/imageSize';

import '../app';
import '../vue-init';

// Common a11y fixes
focusHash();
bindInPageLinks();

// Apply a specific class to the html element for browser support of cookies.
if (window.navigator.cookieEnabled) {
  document.documentElement.className = document.documentElement.className.replace(
    'supports-no-cookies',
    'supports-cookies',
  );
}