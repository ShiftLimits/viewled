<script setup lang="ts">
	import { computed, reactive, ref, watch } from 'vue';

	const props = withDefaults(defineProps<{
		angle?:number
		distance?:number
		angleMin?: number
		angleMax?: number
		distanceMin?: number
		distanceMax?: number
	}>(), {
		angleMin: 0,
		angleMax: 0,
		distanceMin: 0,
		distanceMax: 0,
	})

	const emit = defineEmits(['update:angle', 'update:distance'])

	const point = reactive({
		x: 0,
		y: 0.5
	})
	const polar_point = computed({
		get() {
			const x_from_center = (point.x*2) - 1
			const y_from_center = (point.y*2) - 1

			return {
				angle: (Math.atan2(y_from_center, x_from_center) + Math.PI) / (Math.PI*2),
				distance: Math.sqrt(x_from_center*x_from_center + y_from_center*y_from_center)
			}
		},
		set({ angle, distance }) {
			let radians = angle * (Math.PI*2) - Math.PI
			const x_from_center = distance * Math.cos(radians)
			const y_from_center = distance * Math.sin(radians)

			point.x = (x_from_center+1)/2
			point.y = (y_from_center+1)/2
		}
	})
	watch(() => props.angle, (new_value) => {
		polar_point.value = { ...polar_point.value, angle: new_value||0 }
	}, { immediate: true, flush: 'sync' })
	watch(() => props.distance, (new_value) => {
		const distance = (new_value||0) * (1 - 0.5) + 0.5
		polar_point.value = { ...polar_point.value, distance }
	}, { immediate: true, flush: 'sync' })

	function updatePointByClientCoords(clientX:number, clientY:number) {
		if (plane.value) {
			let { x: plane_x, width: plane_width, y: plane_y, height: plane_height } = plane.value.getBoundingClientRect()

			point.x = Math.max(0, Math.min(1, (clientX - plane_x) / plane_width))
			point.y = Math.max(0, Math.min(1, (clientY - plane_y) / plane_height))

			const distance = Math.min(1.0, Math.max(0.5, polar_point.value.distance))
			polar_point.value = { ...polar_point.value, distance }
			emit('update:angle', polar_point.value.angle)
			emit('update:distance', (distance-0.5) / (1.0 - 0.5))
		}
	}

	// const p2c = pt => [pt[0] * Math.cos(pt[1]), pt[0] * Math.sin(pt[1])];
	const plane = ref<HTMLDivElement>()
	const moving = ref(false)
	function handlePointerDown(e:PointerEvent) {
		document.addEventListener("pointermove", handlePointerMove)
		document.addEventListener("pointerup", handlePointerUp)
		moving.value = true

		updatePointByClientCoords(e.clientX, e.clientY)
	}
	function handlePointerMove(e:PointerEvent) {
		updatePointByClientCoords(e.clientX, e.clientY)
	}
	function handlePointerUp({}:PointerEvent) {
		document.removeEventListener("pointermove", handlePointerMove)
		document.removeEventListener("pointerup", handlePointerUp)
		moving.value = false
	}
</script>

<template>
	<div @pointerdown.prevent="handlePointerDown" @touchstart.prevent class="grid grid-stack">
		<!-- Point Plane -->
		<div ref="plane" class="relative w-full h-full z-50">
			<div class="absolute transform -translate-x-50% -translate-y-50% top-0 left-0" :style="`left: ${ point.x * 100 }% !important; top: ${ point.y * 100 }% !important;`">
				<slot name="handle">
					<svg viewBox="0 0 100 100" class="w-2 h-2">
						<circle cx="50" cy="50" r="40" stroke-width="6" class="stroke-black fill-transparent" />
						<circle cx="50" cy="50" r="34" stroke-width="5" class="stroke-white fill-transparent" />
					</svg>
				</slot>
			</div>
		</div>

		<!-- Background Slot -->
		<slot />
	</div>
</template>