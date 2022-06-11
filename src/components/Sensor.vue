<script setup lang="ts">
	import { onMounted, onUnmounted } from 'vue'
	const emit = defineEmits(['mounted', 'unmounted'])

	onMounted(() => emit('mounted'))
	onUnmounted(() => emit('unmounted'))
</script>

<template>

</template>