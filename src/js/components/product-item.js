export default {
    props: {
        product: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            url: null
        }
    },

    computed: {
        isSale() {
            return this.product?.compare_at_price > this.product.price;
        }
    },

    created() {
        if (!this.product.url) {
            this.url = `/products/${this.product.handle}`;
        }
    }
}