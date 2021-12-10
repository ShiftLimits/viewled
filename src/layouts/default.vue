<script setup lang="ts">
	import { useWLEDClient } from 'vue-wled'
	import Masthead from '../components/Masthead.vue'
	import SvgIcon from '../components/SvgIcon.vue'
	import LiveLedPreview from '../components/LiveLedPreview.vue'

	const { connecting, info, live } = useWLEDClient()
</script>

<template>
	<div v-if="connecting" class="h-full flex flex-col items-center justify-center">
		<SvgIcon name="connection-loader" class="h-14 fill-neutral-150 stroke-neutral-150" />
		<div class="text-4xl font-black">Connecting...</div>
	</div>
	<template v-else>
		<div v-if="live.leds" class="order-4 lg:order-3 h-1-1/2 bg-gradient-to-b from-neutral-900 to-neutral-925 relative flex items-center justify-center z-peek">
			<LiveLedPreview class="absolute w-[300%] h-[300%] pointer-events-none" />
		</div>
		<Masthead class="order-7 lg:order-2" />
		<div class="order-5 flex-1 overflow-y-auto">
			<router-view />
		</div>
	</template>
</template>