/**
 * Product Vue Component
 * ------------------------------------------------------------------------------
 * Main template in sections/product.liquid
 * Can be reused for other instances of a product
 */

import axios from 'axios';
import Slick from 'vue-slick';
import { getUrlWithVariant } from '@shopify/theme-product-form';

import ImageZoom from './image-zoom.vue';
import ReadMore from './read-more.vue';
import Accordion from './accordion.vue';
import Collapsible from './collapsible.vue';
import ButtonSpinner from './button-spinner.vue';

import { app } from '../app.js';
import { removeParameterFromUrl } from '../utils/helpers.js';

export default {
    components: {
        Slick,
        ImageZoom,
        ReadMore,
        Accordion,
        Collapsible,
        ButtonSpinner
    },

    props: {
        productHandle: {
            type: String,
            required: true
        },
        isProductPage: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            isLoading: false,
            isSubmitting: false,
            product: null,
            options: [],
            currentVariant: null,
            quantity: 1,

            currentSlide: 0,
            mainSlickOptions: {
                slidesToShow: 1,
                focusOnSelect: true,
                asNavFor: '.gallery__nav'
            },
            navSlickOptions: {
                slidesToShow: 4,
                focusOnSelect: true,
                asNavFor: '.gallery__main'
            }
        }
    },

    computed: {
        isSale() {
            return (this.currentVariant?.compare_at_price > this.currentVariant?.price) || (this.product?.compare_at_price > this.product?.price);
        }
    },

    created() {
        this.isLoading = true;

        axios.get(`/products/${this.productHandle}.js`).then((response) => {
            // console.log('product', response.data);
            this.product = response.data;

            // if the URL has ?variant=[variant.id], select that variant
            let queryStringValues = new URLSearchParams(window.location.search);
            if (queryStringValues.has('variant')) {
                let variantFromQueryString = this.product.variants.find((variant) => {
                    return variant.id == queryStringValues.get('variant');
                });
                if (variantFromQueryString) this.currentVariant = variantFromQueryString;

            } else if (this.product.variants.length == 1) {
                this.currentVariant = this.product.variants[0];
            }

            if (this.currentVariant) {
                for (let i = 1; i <= this.product.options.length; i++) {
                    this.options.push(this.currentVariant['option' + i]);
                }

                this.updateVariant();

            } else {
                for (let i = 1; i <= this.product.options.length; i++) {
                    this.options.push('');
                }
            }

        }).catch((error) => {
            console.log(error);

        }).finally(() => {
            this.isLoading = false;
        });
    },

    mounted() {
        if (this.$refs.main) {
            this.$refs.main.$on('afterChange', this.handleAfterChange);
        }

        // Vertical gallery nav -
        // Fix for Slick nav slider disappearing if change happens before everything is loaded and parsed
        // window.addEventListener("load", () => {
        //     const element = document.querySelector('.gallery__nav .slick-track');
        //     if (element) element.style.transform = "translate3d(0px, 0px, 0px)";
        // });
    },

    methods: {
        handleAfterChange(event, slick, currentSlide) {
            this.currentSlide = currentSlide;
        },

        updateVariant() {
            let variant = this._findVariant();
            this._setVariant(variant);
        },

        async handleAddToCart() {
            if (this.currentVariant) {
                this.isSubmitting = true;

                await app.addToCart(this.currentVariant.id, this.quantity).then((response) => {

                }).catch((error) => {
                    console.log('error', error);
                    alert('Cannot reach the server at this time, please try again later.');
                });

                this.isSubmitting = false;
            }
        },

        // When product has multiple options, we need to find the associated variant based on those options
        _findVariant() {
            for (let i = 0; i < this.product.variants.length; i++) {
                if (this.product.variants[i].option1 && this.product.variants[i].option1 != this.options[0]) continue;
                if (this.product.variants[i].option2 && this.product.variants[i].option2 != this.options[1]) continue;
                if (this.product.variants[i].option3 && this.product.variants[i].option3 != this.options[2]) continue;

                return this.product.variants[i];
            }

            return null;
        },

        _setVariant(variant) {
            if (!variant) {
                this.currentVariant = null;
                removeParameterFromUrl('variant');
                return;
            }

            this.currentVariant = variant;

            if (this.isProductPage) {
                if (variant.featured_image && this.product.images.length > 1)
                    this.$refs.main.goTo(variant.featured_image.position - 1);

                let url = getUrlWithVariant(window.location.href, variant.id);
                window.history.replaceState({path: url}, '', url);
            }
        }
    }
};