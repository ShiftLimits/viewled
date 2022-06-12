<script setup lang="ts">
	import { useWLEDClient } from "vue-wled"
	import { reactive, watch, h, ref, computed } from 'vue';
	import { cctToRGB, rgbToCCT } from "../lib/color"
	import throttle from 'lodash/throttle'
	import ColorPickerCCT from "../components/ColorPickerCCT.vue"

	const { state, setColor, setCCT, updateState } = useWLEDClient()
	const throttleSetColor = throttle((color) => setColor(color, { transition: 1 }), 100)
	const throttleSetCCT = throttle((color) => setCCT(color, { transition: 1 }), 100)
	const throttleUpdateState = throttle((state) => updateState(state, { transition: 1 }), 100)
	const kelvin_min = parseInt(import.meta.env.WLED_KELVIN_MIN || 1000)
	const kelvin_max = parseInt(import.meta.env.WLED_KELVIN_MAX || 12000)


	let isDraggingCCT = false
	const _kelvin = ref(kelvin_min)
	watch(() => state.segments[state.mainSegmentId||0], (segment) => {
		if (segment && !isDraggingCCT) {
			_kelvin.value = (segment.cct / 255) * (kelvin_max - kelvin_min) + kelvin_min
		}
	}, { immediate: true, flush: 'sync', deep: true })

	const kelvin = computed({
		get() {
			return _kelvin.value
		},
		set: (kelvin:number) => {
			_kelvin.value = kelvin
			throttleUpdateState({
				segments: [
					{
						colors: [[0,0,0,255]],
						cct: Math.round(((kelvin-kelvin_min) / (kelvin_max - kelvin_min)) * 255)
					}
				]
			})
		}
	})


	const handleCCTInput = (new_value:number) => kelvin.value = new_value
	const handleCCTPointerDown = ({}) => isDraggingCCT = true
	const handleCCTPointerUp = ({}) => isDraggingCCT = false
</script>

<template>
	<div class="h-full flex flex-col items-center justify-center p-1 bg-gradient-radial from-neutral-850 to-transparent">
		<div class="flex-1 self-stretch flex items-end lg:items-center justify-center py-1">
			<div class="grid grid-stack">
				<div class="flex items-end justify-center text-3xl font-medium">{{ Math.round(kelvin/100)*100 }}K</div>
				<ColorPickerCCT :kelvin="kelvin" :min="kelvin_min" :max="kelvin_max" @update:kelvin="handleCCTInput" @pointerdown="handleCCTPointerDown" @pointerup="handleCCTPointerUp" class="w-full max-w-20" />
			</div>
		</div>
	</div>
</template>