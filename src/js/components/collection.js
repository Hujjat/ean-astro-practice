/**
 * Collection Vue Component
 * ------------------------------------------------------------------------------
 * Template in sections/collection.liquid
 *
 */

import Vue from 'vue';
import axios from 'axios';
import debounce from 'lodash-es/debounce';

import ProductItem from './product-item.js';
import Collapsible from './collapsible.vue';

import { storefrontRequestConfig } from '../utils/api';
import { productQuery, transformGraphqlProduct } from './../utils/data';
import { fromEntries, getElementOffset } from './../utils/helpers';

const DEFAULT_PAGINATION = 16;

export default {
    components: {
        ProductItem,
        Collapsible
    },

    props: {
        collectionHandle: {
            type: String,
            default: 'all'
        },
        defaultSort: {
            type: String
        },
        paginateBy: {
            type: Number,
            default: DEFAULT_PAGINATION
        }
    },

    data() {
        return {
            isLoading: false,
            allProducts: [],
            filteredProducts: [],
            sortValue: null,
            filters: {},
            numberOfProductsToShow: this.paginateBy,
            isPaginationEnabled: true
        }
    },

    computed: {
        productsShowing() {
            // show products based on pagination number (no extra call to Shopify for pagination)
            return this.filteredProducts.slice(0,this.numberOfProductsToShow);
        }
    },

    mounted() {
        // Load filters and sort from URL params.
        // This is done in mounted so that initFilter directive is run first.

        const url = new URL(window.location.toString());
        const params = fromEntries(url.searchParams);

        for (let k in params) {
            if (k == 'sort') {
                this.sortValue = params[k];

            } else if (k in this.filters) {
                this.filters[k] = decodeURI(params[k]).split(',');
            }
        }

        this.sortCollection();
    },

    directives: {
        initFilter: {
            bind(el, binding, vnode) {
                Vue.set(vnode.context.filters, binding.value, []);
            }
        },

        infiniteScroll: {
            bind(el, binding, vnode) {
                window.addEventListener('scroll', debounce(function() {
                    if (!vnode.context.isPaginationEnabled || vnode.context.isLoading) return;

                    // First check if pagination should trigger.
                    const elementBottom = el.scrollHeight + getElementOffset(el).top;
                    const hasReachedBottom = window.scrollY + window.innerHeight > elementBottom;

                    // Then add pagination amount to the number of items to show.
                    // This automatically shows more items based on the computed value.
                    if (hasReachedBottom) {
                        vnode.context.numberOfProductsToShow += vnode.context.paginateBy;
                        // if we are at the end of pagination, stop checking
                        vnode.context.isPaginationEnabled = vnode.context.numberOfProductsToShow < vnode.context.filteredProducts.length;
                    }
                }, 100));
            }
        }
    },

    methods: {
        sortCollection() {
            let sortKey = null, reverse = null;

            switch (this.sortValue || this.defaultSort) {
                case 'manual':
                    sortKey = 'RELEVANCE';
                    reverse = false;
                    break;

                case 'created':
                    sortKey = 'CREATED_AT';
                    reverse = true;
                    break;

                case 'best-selling':
                    sortKey = 'BEST_SELLING';
                    reverse = false;
                    break;

                case 'price-descending':
                    sortKey = 'PRICE';
                    reverse = true;
                    break;

                case 'price-ascending':
                    sortKey = 'PRICE';
                    reverse = false;
                    break;

                case 'title-ascending':
                    sortKey = 'TITLE';
                    reverse = false;
                    break;

                case 'title-descending':
                    sortKey = 'TITLE';
                    reverse = true;
                    break;
            }

            this.allProducts = [];
            this._getProducts(sortKey, reverse);

            if (this.sortValue) {
                let url = new URL(window.location.toString());
                url.searchParams.set('sort', this.sortValue);
                window.history.replaceState({path: url.toString()}, '', url.toString());
            } else {
                this.sortValue = this.defaultSort; // Set sort v-model
            }
        },

        filter() {
            this.isPaginationEnabled = true;
            let isFiltered = false;
            const url = new URL(window.location.toString());

            for (const k in this.filters) {
                if (this.filters[k].length) {
                    url.searchParams.set(k, encodeURI(this.filters[k]));
                    isFiltered  = true;
                } else {
                    url.searchParams.delete(k);
                }
            }

            if (!isFiltered) {
                this.filteredProducts = this.allProducts;

            } else {
                this.filteredProducts = [];
                this.numberOfProductsToShow = this.paginateBy;

                this.allProducts.forEach(product => {
                    // check all products loaded from graphQL against filter options
                    // if the product contains tags from each chosen filter group, it gets pushed into allProductsFiltered
                    // if the product doesn't contain tags from each filter group, the return will move to next product

                    for (const k in this.filters) {
                        if (this.filters[k].length && !product.tags.some(tag => this.filters[k].includes(tag))) {
                            return;
                        }
                    }

                    this.filteredProducts.push(product);
                });
            }

            window.history.replaceState({path: url.toString()}, '', url.toString());
        },

        _getProducts(sortKey, reverse, lastCursor=null) {
            this.isLoading = true;

            let args = `first: 250, sortKey: ${ sortKey }, reverse: ${ reverse }`;
            if (lastCursor) {
                args += `, after: "${ lastCursor }"`;
            }

            let data;
            if (this.collectionHandle == 'all') {
                data = `{
                    products(${ args }) {
                        edges {
                            node {
                                ${ productQuery }
                            }
                            cursor
                        }
                        pageInfo {
                            hasNextPage
                        }
                    }
                }`;
            } else {
                data = `{
                    collectionByHandle(handle: "${ this.collectionHandle }") {
                        id
                        description
                        products(${ args }) {
                            edges {
                                node {
                                    ${ productQuery }
                                }
                                cursor
                            }
                            pageInfo {
                                hasNextPage
                            }
                        }
                    }
                }`;
            }

            axios.post(`//${Shopify.shop}/api/graphql`, data, storefrontRequestConfig).then(response => {
                const products = this.collectionHandle == 'all' ? response.data.data.products : response.data.data.collectionByHandle.products;

                this.allProducts = [...this.allProducts, ...products.edges.map(product => transformGraphqlProduct(product.node, this.collectionHandle))]

                if (products.pageInfo.hasNextPage) {
                    // if there are more results to get, run function again to get more
                    this._getProducts(sortKey, reverse, products.edges[products.edges.length - 1].cursor);
                } else {
                    // otherwise filter products
                    this.filter();
                    this.isLoading = false;
                }

            }).catch((error) => {
                console.log(error);
                this.isLoading = false;
            });
        }
    }
}