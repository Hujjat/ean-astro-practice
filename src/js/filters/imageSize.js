/**
 * Returns an optimised image URL.
 * 
 * Allowed size values:
 * 'pico', 'icon', 'thumb', 'small', 'compact', 'medium', 'large', 'grande', 'original'
 * '1024x1024', '768x', 'x768'
 * https://community.shopify.com/c/Shopify-Design/We-now-have-a-new-compact-size-for-product-images/m-p/95528
 *
 * @param {string} image URL of master image 
 * @param {string} size Desired size of image, see allowed values above
 * @return {string} URL of resized image
 */

import Vue from 'vue';

Vue.filter('imageSize', (image, size) => {
    return image.replace(/\/(.*)\.(\w{2,4})/g, '/$1_' + size + '.$2');
});