<template>
    <div class="collapsible" :class="{ 'collapsible--active': isActive }">
        <div @click="toggle()" class="collapsible__title" :class="{ 'd-flex align-item-center justify-content-between': !isDisabled }">
            <div><slot name="title"></slot></div>
            <div v-if="!isDisabled" class="collapsible__toggle" :class="{'collapsible__toggle--active': isActive}"></div>
        </div>
        <collapse-transition>
            <div v-show="isActive">
                <div class="collapsible__content">
                    <slot></slot>
                </div>
            </div>
        </collapse-transition>
    </div>
</template>

<script>
/*
* Collapsible Vue component
* ---
* Example usage:
*
* <collapsible>
*   <template v-slot:title>Accordion Title</template>
*   <template>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</template>
* </collapsible>
*/

import {CollapseTransition} from 'vue2-transitions';

export default {    
    components: {
        CollapseTransition
    },

    props: {
        isDisabled: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            isActive: false
        }
    },        

    created() {
        if (this.isDisabled) {
            this.isActive = true;
        }
    },

    methods: {
        toggle() {
            if (this.isDisabled) return;
            this.isActive = !this.isActive;
        },

        close() {
            if (this.isDisabled) return;
            this.isActive = false;
        },
        
        open() {
            if (this.isDisabled) return;
            this.isActive = true;
        }
    }
}
</script>
