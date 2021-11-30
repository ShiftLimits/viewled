<script lang="ts" setup>
import { computed, defineComponent, reactive, ref, watch } from 'vue'
	const props = withDefaults(defineProps<{
		modelValue?: number,
		min?: number,
		max?: number
	}>(), {
		modelValue: 0,
		min: 0,
		max: 1
	})

	const emit = defineEmits(['update:modelValue'])

	function transformValue(value:number) {
		return value * (props.max - props.min) + props.min
	}
	function normalizeValue(value:number) {
		return (value - props.min) / (props.max - props.min)
	}

	const value = ref(normalizeValue(props.modelValue))
	const plane = ref<HTMLDivElement>()
	const moving = ref(false)

	watch(() => props.modelValue, (new_value) => {
		value.value = normalizeValue(new_value)
	})

	function updatePointByClientCoords(clientX:number, clientY:number) {
		if (plane.value) {
			let { x: plane_x, width: plane_width, y: plane_y, height: plane_height } = plane.value.getBoundingClientRect()

			let offset = plane_width * 0.1
			plane_x += offset
			plane_width -= offset*2

			value.value = Math.max(0, Math.min(1, (clientX - plane_x) / plane_width))
			emit('update:modelValue', transformValue(value.value))
		}
	}

	type Point = { x:number, y:number }
	function getQuadraticBezierXY(start_point:Point, control_point:Point, end_point:Point, t:number):Point {
		const x = Math.pow(1-t,2) * start_point.x + 2 * (1-t) * t * control_point.x + Math.pow(t,2) * end_point.x
		const y = Math.pow(1-t,2) * start_point.y + 2 * (1-t) * t * control_point.y + Math.pow(t,2) * end_point.y
		return { x, y }
	}
	// const bezier_point = computed(() => getQuadraticBezierXY({ x: 0.1, y: 0.325 }, { x: 0.5, y: 1.075 }, { x: 0.9, y: 0.325 }, value.value))
	const bezier_point = computed(() => getQuadraticBezierXY({ x: 0.1, y: 0.325 }, { x: 0.5, y: 1.025 }, { x: 0.9, y: 0.325 }, value.value))

	function handlePointerDown(e:PointerEvent) {
		document.addEventListener("pointermove", handlePointerMove)
		document.addEventListener("pointerup", handlePointerUp)
		moving.value = true

		updatePointByClientCoords(e.clientX, e.clientY)

		e.preventDefault()
	}
	function handlePointerMove({ clientX, clientY }:PointerEvent) {
		updatePointByClientCoords(clientX, clientY)
	}
	function handlePointerUp({}:PointerEvent) {
		document.removeEventListener("pointermove", handlePointerMove)
		document.removeEventListener("pointerup", handlePointerUp)
		moving.value = false
	}
</script>

<template>
	<div @pointerdown="handlePointerDown" @touchstart.prevent class="grid grid-stack w-full h-6">
		<div ref="plane" class="relative w-full h-full z-50">
			<div class="absolute transform -translate-x-50% -translate-y-50% top-0 left-0" :style="`left: ${ bezier_point.x * 100 }% !important; top: ${ (1-bezier_point.y) * 100 }% !important;`">
				<slot name="handle">
					<svg viewBox="0 0 100 100" class="w-3 h-3">
						<circle cx="50" cy="50" r="40" stroke-width="5" class="stroke-black fill-transparent" />
						<circle cx="50" cy="50" r="35" stroke-width="4" class="stroke-white fill-transparent" />
					</svg>
				</slot>
			</div>
		</div>
		<slot />
	</div>
</template>