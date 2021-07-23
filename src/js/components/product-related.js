/*
* product-related Vue component
* ---
* Related products retrieved via Product Recommendations Ajax API
* https://shopify.dev/docs/themes/ajax-api/reference/product-recommendations
*
* Example usage:
*
* <product-related inline-template product-id="{{ product.id }}"/>
*/

import axios from 'axios';
import Slick from 'vue-slick';
import Cookies from 'js-cookie';

import Tabs from './tabs.vue';
import Tab from './tab.vue';
import ProductItem from './product-item.js';

import { storefrontRequestConfig } from '../utils/api';
import { productQuery, transformGraphqlProduct, transformAjaxProduct } from './../utils/data';

const COOKIE_RECENTLY_VIEWED = 'recently_viewed';

export default {
    components: {
        Slick,
        Tabs,
        Tab,
        ProductItem
    },

    props: {
        productId: {
            type: String,
            required: true
        }
    },

    data() {
        return {
            isLoading: true,
            recommendedProducts: [],
            recentlyViewedProducts: [],
            slickOptions: {
                slidesToShow: 4,
                responsive: [
                    {
                        breakpoint: 1025,
                        settings: {
                            slidesToShow: 3
                        }
                    },
                    {
                        breakpoint: 576,
                        settings: {
                            slidesToShow: 1,
                            arrows: false
                        }
                    }
                ]
            }
        }
    },

    async created() {
        // Recommended products
        const recommendedPromise =  this._getRecommendedProducts();

        // Recently viewed products
        let recentPromise = [];
        if (Cookies.get(COOKIE_RECENTLY_VIEWED)) {
            const recentlyViewed = JSON.parse(Cookies.get(COOKIE_RECENTLY_VIEWED));

            if (!recentlyViewed.includes(this.productId))
                Cookies.set(COOKIE_RECENTLY_VIEWED, [this.productId, ...recentlyViewed], { expires: 1 });

            recentPromise = this._getRecentlyViewedProducts(recentlyViewed.slice(0, 6));

        } else {
            Cookies.set(COOKIE_RECENTLY_VIEWED, [this.productId], { expires: 1 });
        }

        // Needs to be initialised in this order so that the tab order is correct
        await Promise.all([recommendedPromise, recentPromise]).then(data => {
            this.recommendedProducts = data[0];
            this.recentlyViewedProducts = data[1];
        }).catch(error => {
            console.log(error);
        });

        this.isLoading = false;
    },

    methods: {
        _getRecentlyViewedProducts(productIds) {
            let graphqlIds = [];
            for (let i = 0; i < productIds.length; i++) {
                if (productIds[i] != this.productId)
                    graphqlIds.push('"' + btoa('gid://shopify/Product/' + productIds[i]) + '"');
            }

            let data = `{
                nodes(ids: [${ graphqlIds }]) {
                    id
                    ... on Product {
                        ${ productQuery }
                    }
                }
            }`;

            return axios.post(`https://${Shopify.shop}/api/graphql`, data, storefrontRequestConfig).then(({ data }) => {
                const transformedProducts = data.data.nodes.map(product => transformGraphqlProduct(product));

                // Remove products that aren't available to Storefront API
                return transformedProducts.filter(product => product);

            }).catch((error) => {
                console.log('Pecently viewed products', error);
                throw error;
            });
        },

        _getRecommendedProducts() {
            return axios.get(`/recommendations/products.json?product_id=${ this.productId }`).then(({ data }) => {
                return data.products.map(product => transformAjaxProduct(product));
            }).catch((error) => {
                console.log('Recommended products', error);
                throw error;
            });
        }
    }
}