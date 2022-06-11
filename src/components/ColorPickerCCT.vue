<script setup lang="ts">
	import { computed, reactive, ref, watch, toRef } from 'vue';
import { cctToRGB } from '../lib/color';
	import { useColorSpaceCCTShader } from '../lib/color-picker-cct'
	import SliderBezier from './SliderBezier.vue'

	const props = withDefaults(defineProps<{
		kelvin?:number,
		min?:number,
		max?:number
	}>(), {
		kelvin: 1000,
		min:1000,
		max:12000
	})

	const emit = defineEmits(['update:kelvin'])

	const color_space_background = ref<HTMLCanvasElement>()
	useColorSpaceCCTShader(color_space_background, toRef(props, 'min'), toRef(props, 'max'))

	const kelvin = ref(props.min)
	watch(() => props.kelvin, (new_value) => {
		kelvin.value = new_value
	}, { immediate: true, flush: 'sync' })
	watch(kelvin, (new_value) => emit('update:kelvin', new_value))
	const color = computed(() => cctToRGB(kelvin.value))
</script>

<template>
	<SliderBezier v-model="kelvin" :min="props.min" :max="props.max">
		<template #handle>
			<svg viewBox="0 0 100 100" class="w-3 h-3">
				<circle cx="50" cy="50" r="40" stroke-width="5" class="stroke-black fill-transparent" />
				<circle cx="50" cy="50" r="35" stroke-width="4" class="stroke-white" :style="{ 'fill': `rgb(${color.r}, ${color.g}, ${color.b})` }" />
			</svg>
		</template>
		<div class="relative min-w-1 flex items-center justify-center overflow-hidden">
			<canvas ref="color_space_background" class="flex-1 w-full aspect-square" />
		</div>
	</SliderBezier>
</template>