<template>
    <button type="submit" class="button" :disabled="isLoading">
        <slot v-if="!isLoading"></slot>
        <span v-else class="spinner">{{ loadingLabel }}</span>
    </button>
</template>

<script>
/*
 * Button Spinner Vue component
 * ---
 * Example usage:
 *
 * <button-spinner :is-loading="isSubmitting" loading-label="Submitting..." class="button button--primary">
 *   <span>Submit</span>
 * </button-spinner>
 */

export default {
    props: {
        isLoading: {
            type: Boolean,
            required: true
        },
        loadingLabel: {
            type: String,
            default: 'Loading'
        }
    }
}
</script>

<style lang="scss" scoped>
$spinner-size: 20px;
$spinner-margin-left: 10px;

.spinner {
    position: relative;
    left: -(($spinner-margin-left + $spinner-size) / 2);
    padding-left: ($spinner-margin-left + $spinner-size) / 2;
    padding-right: ($spinner-margin-left + $spinner-size) / 2;

    &:after {
        content: '';
        position: absolute;
        top: 50%;
        width: $spinner-size;
        height: $spinner-size;
        margin-top: -($spinner-size / 2);
        margin-left: $spinner-margin-left;
        border-radius: 50%;
        border: 2px solid #ccc;
        border-top-color: currentColor;
        box-sizing: border-box;
        animation: spinner .6s linear infinite;
    }
}

@keyframes spinner {
    to {
        transform: rotate(360deg);
    }
}
</style>
