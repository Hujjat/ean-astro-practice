<template>
    <div @click="handleClick">
        <slot></slot>
    </div>
</template>

<script>
/*
* Accordion Vue component
* ---
* Wrapper component for children components with open() and close() methods.
* Allows 0 or 1 open children.
* Example usage:
*
* <accordion>
*   <collapsible>...</collapsible>
*   <collapsible>...</collapsible>
*   <collapsible>...</collapsible>
* </accordion>
*/

const itemAttributeLabel = 'accordion-item';

export default {
    mounted() {        
        if (this.$children.length) {
            this.$children.forEach(function (child, i) {
                child.$el.setAttribute(itemAttributeLabel, i);
            });

            if (this.$children[0] && this.$children[0].hasOwnProperty('open')) {
                this.$children[0].open();
            }
        }
    },

    methods: {
        handleClick(e) {
            let item = e.target.closest('[' + itemAttributeLabel + ']');
            if (item) {
                this.closeAll(item.getAttribute(itemAttributeLabel));
            }
        },

        closeAll(except) {
            this.$children.forEach(function (child, i) {
                if (i != except && child.hasOwnProperty('close')) {
                    child.close();
                }
            });
        }
    }
}
</script>