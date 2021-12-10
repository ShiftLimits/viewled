<script setup lang="ts">
	import { watch, withDefaults, defineProps, ref, nextTick } from 'vue'

	const props = withDefaults(defineProps<{
		modelValue:number|string
	}>(), {
		modelValue: 0
	})

	const emit = defineEmits(['update:modelValue'])
	const value = ref(props.modelValue)

	const flush = 'sync'
	let syncing = false
	watch(() => props.modelValue, (new_value) => {
		syncing = true
		value.value = new_value
		nextTick(() => syncing = false)
	}, { flush, immediate: true })
	watch(value, (new_value) => {
		if (syncing) syncing = false
		else emit('update:modelValue', new_value)
	}, { flush, immediate: false })
</script>

<template>
	<input type="number" v-model="value" v-bind="$attrs" class="rounded-3/8 text-white bg-neutral-750 px-1/2 py-1/4 leading-3/4 outline-none focus:ring-1/8 min-w-0" />
</template>