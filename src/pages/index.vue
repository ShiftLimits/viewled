<script setup lang="ts">
	import { useWLEDClient } from "vue-wled"
	import { reactive, watch, h, ref, computed } from 'vue';
	import { cctToRGB, rgbToCCT } from "../lib/color"
	import throttle from 'lodash/throttle'
	import ColorPickerCCT from "../components/ColorPickerCCT.vue"

	const { state, setColor } = useWLEDClient()
	const throttleSetColor = throttle((color) => setColor(color, { transition: 1 }), 100)


	let isDraggingCCT = false
	const _kelvin = ref(4000)
	watch(() => state.segments[state.mainSegmentId||0], (segment) => {
		if (segment && !isDraggingCCT) {
			let [r, g, b] = (segment.colors || [[0, 0, 0]])[0]
			_kelvin.value = Math.min(12000, rgbToCCT({r,g,b}))
		}
	}, { immediate: true, flush: 'sync', deep: true })

	const kelvin = computed({
		get() {
			return _kelvin.value
		},
		set: (kelvin:number) => {
			_kelvin.value = kelvin
			const { r, g, b } = cctToRGB(kelvin)
			throttleSetColor([Math.round(r), Math.round(g), Math.round(b)])
		}
	})


	const handleCCTInput = (new_value:number) => kelvin.value = new_value
	const handleCCTPointerDown = ({}) => isDraggingCCT = true
	const handleCCTPointerUp = ({}) => isDraggingCCT = false
</script>

<template>
	<div class="h-full flex flex-col items-center justify-center p-1 bg-gradient-radial from-neutral-850 to-transparent">
		<div class="flex-1 self-stretch flex items-end md:items-center justify-center py-1">
			<div class="grid grid-stack">
				<div class="flex items-end justify-center text-3xl font-medium">{{ kelvin.toFixed(0) }}K</div>
				<ColorPickerCCT :kelvin="kelvin" @update:kelvin="handleCCTInput" @pointerdown="handleCCTPointerDown" @pointerup="handleCCTPointerUp" class="w-full max-w-20" />
			</div>
		</div>
	</div>
</template>