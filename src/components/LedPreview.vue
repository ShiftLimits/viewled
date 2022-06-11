<script setup lang="ts">
	import { computed, reactive, ref, watch } from 'vue'
	import { useLEDPreviewShader } from '../lib/led-preview'

	const props = withDefaults(defineProps<{
		leds?:Uint8Array[]
	}>(), {
		leds: () => []
	})

	const canvas = ref<HTMLCanvasElement>()
	useLEDPreviewShader(canvas, props.leds)
</script>

<template>
	<div class="relative min-w-1">
		<canvas ref="canvas" class="absolute inset-0 w-full h-full" />
	</div>
</template>