<script setup lang="ts">
	import { computed, reactive, ref, watch } from 'vue';
import { hsvToRGB } from '../lib/color';
	import { useColorSpaceWheelShader } from '../lib/color-picker-wheel'
	import SliderPolar from './SliderPolar.vue'

	const props = withDefaults(defineProps<{
		hue?:number
		saturation?:number
	}>(), {

	})

	const emit = defineEmits(['update:hue', 'update:saturation'])

	const color_space_background = ref<HTMLCanvasElement>()
	useColorSpaceWheelShader(color_space_background)

	const point = reactive({ angle: 0, distance: 0 })
	watch(() => props.hue, (new_value) => {
		point.angle = new_value||0
	}, { immediate: true, flush: 'sync' })
	watch(() => props.saturation, (new_value) => {
		point.distance = new_value||0
	}, { immediate: true, flush: 'sync' })
	watch(point, ({ angle, distance }) => {
		emit('update:hue', angle)
		emit('update:saturation', distance)
	})

	const color = computed(() => hsvToRGB({ h: (1-point.angle) * 360, s: point.distance * 100, v: 100 }))
</script>

<template>
	<SliderPolar v-model:angle="point.angle" :angle-max="100" v-model:distance="point.distance" :distance-max="100">
		<template #handle>
			<svg viewBox="0 0 100 100" class="w-2-1/2 h-2-1/2">
				<circle cx="50" cy="50" r="40" stroke-width="5" class="stroke-black fill-transparent" />
				<circle cx="50" cy="50" r="35" stroke-width="4" class="stroke-white" :style="{ 'fill': `rgb(${color.r}, ${color.g}, ${color.b})` }" />
			</svg>
		</template>
		<div class="relative min-w-1" :style="{'aspect-ratio': '1/1'}">
			<canvas ref="color_space_background" class="absolute inset-0 w-full h-full rounded-full" />
		</div>
	</SliderPolar>
</template>