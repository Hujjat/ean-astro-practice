<template>
	<div class="zoom-on-hover" @mousemove="move" @mouseover="move" @mouseenter="zoom" @mouseleave="unzoom">
		<img class="normal lazyload" ref="normal" :data-src="imgNormal"/>
		<img class="zoom lazyload" ref="zoom" :data-src="imgZoom || imgNormal"/>
	</div>
</template>

<script>
/*
* Image Zoom Vue component
* ---
* Adapted from https://github.com/Intera/vue-zoom-on-hover
* Default zoom will be the image's true size
*
* Example usage:
* <image-zoom img-normal="{{ image | img_url: '1024x1024' }}" img-zoom="{{ image | img_url: '2048x2048' }}"></image-zoom>
*/

function pageOffset(el) {
	// -> {x: number, y: number}
	// get the left and top offset of a dom block element
	let rect = el.getBoundingClientRect(),
		scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
		scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	return {
		y: rect.top + scrollTop,
		x: rect.left + scrollLeft
	}
}

export default {
	props: {
		imgNormal: {
			type: String,
			required: true
		},
		imgZoom: {
			type: String
		},
		scale: {
			type: Number
		},
		isDisabled: {
			type: Boolean,
			default: false
		}
	},
	
	data() {
		return {
			scaleFactor: 1,
			resizeCheckInterval: null
		}
	},
    
	mounted() {
		if (this.scale) {
			this.scaleFactor = parseFloat(this.scale);
			this.$refs.zoom.style.transform = "scale(" + this.scaleFactor + ")";
		}
		this._initEventLoaded();
		this._initEventResized();
	},
    
	updated() {
		this._initEventLoaded();
	},
    
	beforeDestroy() {
		this.resizeCheckInterval && clearInterval(this.resizeCheckInterval);
	},

	methods: {
		zoom() {
			if (this.isDisabled) return;
			this.$refs.zoom.style.opacity = 1;
			this.$refs.normal.style.opacity = 0;
        },
        
		unzoom() {
			if (this.isDisabled) return;
			this.$refs.zoom.style.opacity = 0;
			this.$refs.normal.style.opacity = 1;
        },
        
		move(e) {
			if (this.isDisabled) return;
			let offset = pageOffset(this.$el);
			let zoom = this.$refs.zoom;
			let normal = this.$refs.normal;
			let relativeX = e.clientX - offset.x + window.pageXOffset;
			let relativeY = e.clientY - offset.y + window.pageYOffset;
			let normalFactorX = relativeX / normal.offsetWidth;
			let normalFactorY = relativeY / normal.offsetHeight;
			let x = normalFactorX * (zoom.offsetWidth * this.scaleFactor - normal.offsetWidth);
			let y = normalFactorY * (zoom.offsetHeight * this.scaleFactor - normal.offsetHeight);
			zoom.style.left = -x + "px";
			zoom.style.top = -y + "px";
        },
        
		_initEventLoaded() {
			// emit the "loaded" event if all images have been loaded
			let promises = [this.$refs.zoom, this.$refs.normal].map((image) => {
				return new Promise((resolve, reject) => {
					image.addEventListener("load", resolve);
					image.addEventListener("error", reject);
				});
			});
			let component = this;
			Promise.all(promises).then(() => {
				component.$emit("loaded");
			});
		},
        
		_initEventResized() {
			let normal = this.$refs.normal;
			let previousWidth = normal.offsetWidth;
			let previousHeight = normal.offsetHeight;
			let component = this;
			this.resizeCheckInterval = setInterval(() => {
				if ((previousWidth != normal.offsetWidth) || (previousHeight != normal.offsetHeight)) {
					previousWidth = normal.offsetWidth;
					previousHeight = normal.offsetHeight;
					component.$emit("resized", {
						width: normal.width,
						height: normal.height,
						fullWidth: normal.naturalWidth,
						fullHeight: normal.naturalHeight
					});
				}
			}, 1000);
		}
	}
}
</script>

<style lang="scss" scoped>
.zoom-on-hover {
	position: relative;
	overflow: hidden;

	@media only screen and (max-width: 767px) {
		pointer-events: none;
	}

	.normal {
		width: 100%;
	}

	.zoom {
		position: absolute;
		max-width: unset;
		min-width: 100%;
		opacity: 0;
		transform-origin: top left;
	}
}
</style>