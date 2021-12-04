<script setup lang="ts">
import AbstractButton from './AbstractButton.vue'
import SvgIcon from './SvgIcon.vue'

const props = withDefaults(defineProps<{
  icon?: string,
	label?: string,
	activeClass?:string
	active?:boolean
}>(), {
	activeClass: "bg-neutral-250 text-black"
})

</script>

<template>
	<AbstractButton v-slot="{ isActive, href, navigate }" custom>
		<component :is="href ? 'a': 'button'" :href="href" v-bind="$attrs" @click="navigate" class="p-3/4 xs:px-1 md:py-1/2 md:px-1/2 flex items-center gap-1/4" :class="{ 'text-white bg-neutral-850 mouse:hover:bg-neutral-775 active:bg-neutral-900': !active && !isActive, [activeClass]: active || isActive }">
			<slot v-if="$slots.default" :active="active || isActive" />
			<template v-else>
				<SvgIcon v-if="icon" :name="icon" class="h-1-1/4 fill-current" />
				<div v-if="label" class="leading-2/3 flex justify-center">{{ label }}</div>
			</template>
		</component>
	</AbstractButton>
</template>