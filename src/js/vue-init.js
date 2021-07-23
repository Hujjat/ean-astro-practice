// Vendors
import Vue from 'vue';
import Slick from 'vue-slick';

// Global components
import ProductItem from './components/product-item.js';
import MaCode from './components/ma-code.vue';

// Template specific components
import Collection from './components/collection.js';
import Product from './components/product.js';
import ProductRelated from './components/product-related.js';
import CustomerAddresses from './components/customer-addresses.js';
import CustomerLogin from './components/customer-login.js';
import Cart from './components/cart.js';

function initVueInstance(element) {
    new Vue({
        el: element,

        delimiters: ['${', '}'],

        components: {
            Slick,

            ProductItem,
            MaCode,

            Collection,
            Product,
            ProductRelated,
            CustomerAddresses,
            CustomerLogin,
            Cart
        }
    });
}

document.querySelectorAll('[vue-init]').forEach(element => {
    initVueInstance(element);
});