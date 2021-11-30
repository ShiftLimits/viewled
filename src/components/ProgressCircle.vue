<script setup lang="ts">
	import { computed, ref } from "vue"

	const props = withDefaults(defineProps<{
		progress?: number
	}>(), {
		progress: 0
	})

	const r = ref(42)
	const fill_length = computed(() => 2 * Math.PI * r.value)
	const offset = computed(() => (100-props.progress) * fill_length.value/100)
</script>

<template>
	<svg viewBox="0 0 100 100" fill="none" stroke-linecap="round" class="stroke-5/8">
		<circle cx="50" cy="50" :r="r" class="origin-center -rotate-90" :style="{ 'stroke-dashoffset': offset, 'stroke-dasharray': fill_length }"></circle>
		<circle cx="50" cy="50" :r="r" class="opacity-20"></circle>
	</svg>
</template>