import Vue from 'vue';
import axios from 'axios';
import "regenerator-runtime/runtime.js"; // Required for async functions

import { xhrRequestConfig } from './utils/api';
import { setContentHeight, insertAfter } from './utils/helpers';

import HeaderSearch from './components/header-search.js';

// Uncomment this to suppress Vue warnings in development mode
// Vue.config.silent = true;

export const app = new Vue({
    el: '#app',

    delimiters: ['${', '}'],
    
    components: {
        HeaderSearch
    },
    
    directives: {
        initMegamenu: {
            inserted(el, binding, vnode) {
                let dropdown = document.querySelector('[parent-item="' + binding.value + '"]');
                    
                if (!binding.value.includes('__')) { // If top level menu item
                    el.addEventListener('mouseover', () => {
                        if (window.matchMedia("(min-width: 992px)").matches) {
                            vnode.context.closeAllMegamenus();
                        }
                    });
                }
    
                if (dropdown) {
                    Vue.set(vnode.context.megamenuToggles, binding.value, false);
    
                    insertAfter(dropdown, el);
    
                    if (!binding.value.includes('__')) {
                        el.addEventListener('mouseover', () => {
                            if (window.matchMedia("(min-width: 992px)").matches) {
                                vnode.context.toggleMegamenu(binding.value);
                            }
                        });
                    }
    
                    el.addEventListener('click', (e) => {
                        if (window.matchMedia("(max-width: 991px)").matches) {
                            e.preventDefault();
                            vnode.context.toggleMegamenu(binding.value);
                        }
                    });
    
                } else {
                    el.querySelector('.menu__arrow').remove();
                }
            }
        }
    },

    data: {
        isMenuOpen: false,
        megamenuToggles: {},
        isSearchOpen: false,
        isMinicartOpen: false,
        isCartLoading: false,
        cart: null
    },

    watch: {
        isMenuOpen(value) {
            if (value) {
                document.querySelector('body').classList.add('no-scroll');
            } else {
                document.querySelector('body').classList.remove('no-scroll');
            }
        }
    },

    created() {
        this._getCart();
    },

    mounted() {
        // Hide content until header has loaded
        document.querySelector('body').classList.remove('d-none');

        // Fix for iOS Safari 100vh issue
        setContentHeight();
        window.addEventListener('resize', () => setContentHeight());
    },

    methods: {
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
            this.isSearchOpen = false;
            this.isMinicartOpen = false;
            this.closeAllMegamenus();
        },

        toggleMegamenu(parent) {
            if (!parent.includes('__')) { // If top level menu item
                for (let menu in this.megamenuToggles) {
                    if (menu != parent)
                        this.megamenuToggles[menu] = false;
                }
            }

            this.megamenuToggles[parent] = !this.megamenuToggles[parent];
        },

        closeAllMegamenus() {
            for (let menu in this.megamenuToggles) {
                this.megamenuToggles[menu] = false;
            }
        },

        toggleSearch() {
            this.isSearchOpen = !this.isSearchOpen;
            this.isMinicartOpen = false;
            this.isMenuOpen = false;
            this.closeAllMegamenus();

            if (this.isSearchOpen && this.$refs.search) {
                this.$nextTick(() => {
                    this.$refs.search.select();
                });
            }
        },

        toggleMinicart() {
            this.isMinicartOpen = !this.isMinicartOpen;
            this.isSearchOpen = false;
            this.isMenuOpen = false;
            this.closeAllMegamenus();
        },

        updateQuantity(item, quantity) {
            this.isCartLoading = true;
            item.isLoading = true;
            Vue.set(this.cart.items, this.cart.items.indexOf(item), item);

            let data = {
                "id": item.key,
                "quantity": quantity != undefined ? quantity : item.quantity // Can't use !, quantity could be 0
            }

            axios.post('/cart/change.js', data).then(async (response) => {
                await this._getCart();

                const currentItem = this.cart.items.find(newItem => item.key == newItem.key);
    
                if (currentItem?.quantity != item.quantity) {
                    currentItem.message = "All available stock is in your cart.";
                    Vue.set(this.cart.items, this.cart.items.indexOf(currentItem), currentItem);
                }

            }).catch((error) => {
                console.log(error);

            }).finally(() => {
                this.isCartLoading = false;
                item.isLoading = false;
            });
        },

        addToCart(variantId, quantity=1, properties) {
            if (!variantId) return;

            let data = {
                quantity: quantity,
                id: variantId
            }

            if (properties) {
                data.properties = properties;
            }

            return axios.post('/cart/add.js', data, xhrRequestConfig).then(async (response) => {
                await this._getCart();
                this.isMinicartOpen = true;

            }).catch((error) => {
                console.log(error.response);
                // Catch inventory errors
                if (error.response.status == 422) {
                    alert(error.response.data.description);
                } else {
                    alert('Cannot reach the server at this time, please try again later.');
                    throw error;
                }
            });
        },

        async _getCart() {
            this.isCartLoading = true;

            await axios.get('/cart?view=data').then(({ data }) => {
                this.cart = data;

            }).catch((error) => {
                console.log(error);
            });

            this.isCartLoading = false;
        }
    }
});