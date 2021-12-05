<script setup lang="ts">
	import { useWLEDClient } from 'vue-wled'
	import Masthead from '../components/Masthead.vue'
	import SvgIcon from '../components/SvgIcon.vue'

	const { connecting, info } = useWLEDClient()
</script>

<template>
	<div v-if="connecting" class="h-full flex flex-col items-center justify-center">
		<SvgIcon name="connection-loader" class="h-14 fill-neutral-150 stroke-neutral-150" />
		<div class="text-4xl font-black">Connecting...</div>
	</div>
	<template v-else>
		<div class="lg:hidden p-1/2 bg-gradient-to-br from-neutral-750 to-neutral-850 leading-3/4 font-bold text-lg text-neutral-100">{{ info.name }}</div>
		<Masthead class="order-7 lg:order-2 z-masthead" />
		<div class="order-5 flex-1 overflow-y-auto">
			<router-view />
		</div>
	</template>
</template>