<script setup lang="ts">
	import { useWLEDClient } from 'vue-wled'
	import Masthead from '../components/Masthead.vue'
	import SvgIcon from '../components/SvgIcon.vue'

	const { connecting } = useWLEDClient()
</script>

<template>
	<div v-if="connecting" class="h-full flex flex-col items-center justify-center">
		<SvgIcon name="connection-loader" class="h-14 fill-neutral-150 stroke-neutral-150" />
		<div class="text-4xl font-black">Connecting...</div>
	</div>
	<template v-else>
		<Masthead class="order-7 md:order-2 z-masthead" />
		<div class="order-5 flex-1 overflow-y-auto">
			<router-view />
		</div>
	</template>
</template>