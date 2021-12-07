<script setup lang="ts">
	import { computed, reactive, ref, watch } from 'vue'
	import { useWLEDClient } from 'vue-wled'
	import LedPreview from './LedPreview.vue'

	const { onLiveLEDs } = useWLEDClient()

	const leds = reactive<string[]>([])
	onLiveLEDs(({ leds: new_leds }) => {
		leds.length = 0
		leds.push(...new_leds)
	})
</script>

<template>
	<LedPreview :leds="leds" />
</template>