<template>
	<div class="cursor-pointer  relative overflow-hidden rounded-full w-2 h-1 bg-neutral-500 focus-within:ring-1/8 text-black">
		<div class="h-full flex items-stretch transition-transform duration-100 ease-in-out transform w-[200%]" :class="{ '-translate-x-50%': !value }">
			<div class="w-50% bg-green-500"></div>
			<div class="w-50% bg-red-500"></div>
		</div>
		<div class="absolute inset-0 transition-transform duration-100 ease-in-out transform" :class="{ 'translate-x-full': value }">
			<div class="w-1 h-1 bg-white rounded-full transition-transform duration-100 ease-in-out transform" :class="{ '-translate-x-full': value }"></div>
		</div>
		<input class="opacity-0 absolute inset-0 cursor-pointer outline-none" type="checkbox" v-model="value" />
	</div>
</template>

<script lang="ts">
	import { computed, defineComponent, nextTick, ref, watch } from 'vue'

	export default defineComponent({
		props: ['modelValue'],
		setup (props, { emit }) {
			const value = ref<string>('')

			const flush = 'sync'
			let syncing = false
			watch(() => props.modelValue, (new_value) => {
				syncing = true // Mark as syncing so when we set the internal value it doesn't also emit again
				value.value = new_value
				nextTick(() => syncing = false) // Mark as not syncing on the next tick; since flush is 'sync' both watches will be processed at once; after that we need not be marked as syncing
			}, { flush, immediate: true })
			watch(value, (new_value) => {
				if (syncing) syncing = false
				else emit('update:modelValue', new_value)
			}, { flush, immediate: false })

			return {
				value
			}
		}
	})
</script>
