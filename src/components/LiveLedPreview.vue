<script setup lang="ts">
	import { reactive } from 'vue'
	import { useWLEDClient } from 'vue-wled'
	import LedPreview from './LedPreview.vue'

	const { onLiveLEDs } = useWLEDClient()

	const leds = reactive<Uint8Array[]>([])
	onLiveLEDs(new_leds => {
		leds.length = 0
		leds.push(...new_leds)
	})
</script>

<template>
	<LedPreview :leds="leds" />
</template>