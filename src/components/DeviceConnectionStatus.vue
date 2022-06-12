<script setup lang="ts">
	import { computed } from 'vue'
	import { useWLEDClient } from 'vue-wled'

	const { linkState } = useWLEDClient()

	const color_map = {
		'error': 'bg-alert-500',
		'loading': 'bg-warning-500',
		'http': 'bg-success-500',
		'ws': 'bg-info-500'
	}
	const color = computed(() => color_map[linkState.value])
</script>

<template>
	<div class="rounded-full aspect-square min-h-1/3" :class="{ [color]: true }"></div>
</template>