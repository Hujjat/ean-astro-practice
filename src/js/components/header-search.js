/**
 * Search Bar Vue Component
 * ------------------------------------------------------------------------------
 * Template in snippets/header-search.liquid
 * 
 */

import axios from 'axios';
import debounce from 'lodash-es/debounce';

import { app } from '../app.js';

export default {
    props: {
        defaultValue: {
            type: String,
            default: null
        },
        isSearchOpen: {
            type: Boolean
        }
    },

    data() {
        return {
            isSearchLoading: false,
            search: this.defaultValue,
            results: []
        }
    },

    watch: { // Debounce and watchers - https://vuejs.org/v2/guide/computed.html#Watchers
        search(value) {
            if (value) {
                this.isSearchLoading = true;
                this.debouncedPerformSearch();
                
            } else {
                this.results = [];
            }
        },

        isSearchOpen(value) {
            if (value) {
                this.$nextTick(() => {
                    this.$refs.search.focus();
                });
            }
        }
    },

    created() {
        this.debouncedPerformSearch = debounce(this.performSearch, 500);
    },

    methods: {
        toggleSearch() {
            app.toggleSearch();
        },

        async performSearch() {
            if (this.search) {
                // Predictive Search API - https://shopify.dev/docs/themes/ajax-api/reference/predictive-search
                await axios.get(`/search/suggest.json?q=${this.search}&resources[type]=product&resources[limit]=8`).then(({ data }) => {
                    this.results = data.resources.results.products;
    
                }).catch((error) => {
                    console.log(error);
                    error;
                });
            }

            this.isSearchLoading = false;
        }
    } 
}