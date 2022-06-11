<script setup lang="ts">
	import { computed, nextTick, ref, watch } from 'vue';
	import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
	import SvgIcon from './SvgIcon.vue'
import { isNumber } from 'lodash';

	const props = defineProps<{
		modelValue?:number
		enum:{[key:string]:any}
	}>()

	const emit = defineEmits(['update:modelValue'])

	const	selected = ref<[any|undefined, number|undefined]>([props.modelValue != undefined ? props.enum[props.modelValue] : undefined, props.modelValue])
	const enum_filtered = computed(() => Object.fromEntries(Object.entries(props.enum).filter(([_, id]) => {
		return isNaN(id.toString().charAt(0))
	})))

	const flush = 'sync'
	let syncing = false
	watch(() => props.modelValue, (new_value) => {
		syncing = true // Mark as syncing so when we set the internal value it doesn't also emit again
		selected.value = [new_value != undefined ? props.enum[new_value] : undefined, new_value]
		nextTick(() => syncing = false) // Mark as not syncing on the next tick; since flush is 'sync' both watches will be processed at once; after that we need not be marked as syncing
	}, { flush, immediate: true })
	watch(selected, ([_, id]) => {
		if (syncing) syncing = false
		else emit('update:modelValue', id)
	}, { flush, immediate: false })
</script>

<template>
  <Listbox as="div" v-model="selected" class="relative flex not-prose" v-slot="{ open }">
    <ListboxButton class="flex-1 flex items-center rounded-3/8 px-1/2 py-1/4 text-left text-white bg-neutral-750 border-b border-neutral-850" :class="{ 'rounded-b-none': open }">
			<div class="flex-1">{{ selected[0] || 'Select...' }}</div>
			<SvgIcon name="chevron-down" class="h-3/4 fill-current" :class="{'rotate-180':open}" />
		</ListboxButton>
    <ListboxOptions class="absolute top-100% inset-x-0 p-0 z-popover max-h-14 overflow-y-auto rounded-b-3/8">
			<ListboxOption
				v-for="(value, id) in enum_filtered"
				:key="id"
				:value="[value, parseInt(id.toString())]"
				class="px-1/2 py-1/4 bg-neutral-775 cursor-pointer can-hover:hover:bg-neutral-700"
			>
				{{ value }}
			</ListboxOption>
    </ListboxOptions>
  </Listbox>
</template>