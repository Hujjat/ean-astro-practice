import { app } from '../app.js';

export default {
    computed: {
        cart() {
            return app.cart;
        }
    },

    methods: {
        updateQuantity(...args) {
            app.updateQuantity(...args);
        }
    }
}