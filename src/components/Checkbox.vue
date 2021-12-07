<template>
	<div class="cursor-pointer relative overflow-hidden rounded-1/4 w-1 h-1 bg-neutral-800 focus-within:ring-1/8 text-neutral-200">
		<div v-if="value" class="p-1/8">
			<SvgIcon name="check" class="fill-current" />
		</div>
		<input class="opacity-0 absolute inset-0 cursor-pointer outline-none" type="checkbox" v-model="value" />
	</div>
</template>

<script lang="ts">
	import { computed, defineComponent, nextTick, ref, watch } from 'vue'
	import SvgIcon from '../components/SvgIcon.vue'

	export default defineComponent({
		props: ['modelValue'],
		components: { SvgIcon },
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
