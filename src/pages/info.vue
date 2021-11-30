<script setup lang="ts">
	import { useWLEDClient } from "vue-wled"
import SvgIcon from "../components/SvgIcon.vue"

const { info, reboot } = useWLEDClient()
</script>

<template>
	<div class="p-1">
		<div class="flex flex-col gap-1">
			<pre>{{ info }}</pre>
			<button @click="reboot" class="p-1/2 rounded-1/2 bg-neutral-700 hover:bg-neutral-800">Reboot</button>
		</div>
	</div>
</template>