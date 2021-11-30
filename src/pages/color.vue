<script setup lang="ts">
	import { useWLEDClient } from "vue-wled"
	import { reactive, watch, h, computed } from 'vue';
	import ColorPickerWheel from "../components/ColorPickerWheel.vue"
	import { hsvToRGB, rgbToHSV } from "../lib/color"
	import throttle from 'lodash/throttle'

	const { state, setColor } = useWLEDClient()
	const throttleSetColor = throttle((color) => setColor(color, { transition: 1 }), 100)

	let isDraggingColor = false
	const _color = reactive({ h: 0, s: 0, v: 1 })
	watch(() => state.segments[state.mainSegmentId||0], (segment) => {
		if (segment && !isDraggingColor) {
			let [r, g, b] = (segment.colors || [[0, 0, 0]])[0]
			let { h, s, v } = rgbToHSV({r,g,b})
			_color.h = 1-(h/360)
			_color.s = s/100
		}
	}, { immediate: true, flush: 'sync', deep: true })

	const hue = computed({
		get() {
			return _color.h
		},
		set: (hue:number) => {
			_color.h = hue
			const { r, g, b } = hsvToRGB({ h: (1-_color.h) * 360, s: _color.s * 100, v: _color.v * 100 })
			throttleSetColor([r, g, b])
		}
	})

	const saturation = computed({
		get() {
			return _color.s
		},
		set: (saturation:number) => {
			_color.s = saturation
			const { r, g, b } = hsvToRGB({ h: (1-_color.h) * 360, s: _color.s * 100, v: _color.v * 100 })
			throttleSetColor([r, g, b])
		}
	})

	const handleHueInput = (new_value:number) => hue.value = new_value
	const handleSaturationInput = (new_value:number) => saturation.value = new_value
	const handleColorPointerDown = ({}) => isDraggingColor = true
	const handleColorPointerUp = ({}) => isDraggingColor = false
</script>

<template>
	<div class="h-full flex flex-col items-center justify-center p-1 bg-gradient-radial from-neutral-850 to-transparent">
		<div class="flex-1 self-stretch flex items-end md:items-center justify-center p-1">
			<ColorPickerWheel :hue="hue" @update:hue="handleHueInput" :saturation="saturation" @update:saturation="handleSaturationInput" @pointerdown="handleColorPointerDown" @pointerup="handleColorPointerUp" class="w-full max-w-20" />
		</div>
	</div>
</template>