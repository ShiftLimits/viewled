<script setup lang="ts">
	import { useWLEDClient } from 'vue-wled'
	import SvgIcon from '../components/SvgIcon.vue'
	import SubNavButton from '../components/SubNavButton.vue'

const {  } = useWLEDClient()
</script>

<template>
	<div class="h-full flex flex-col">
		<div class="order-7 md:order-2">
			<div class="h-3 flex overflow-x-auto divide-x divide-neutral-900 bg-neutral-875">
				<SubNavButton to="/settings/" icon="settings" label="Device" />
				<SubNavButton to="/settings/schedule" icon="clock" label="Time" />
				<SubNavButton to="/settings/WiFi" icon="wifi" label="WiFi" />
				<SubNavButton to="/settings/ui" icon="template" label="Interface" />
				<SubNavButton to="/settings/hardware" icon="hardware" label="Hardware" />
				<SubNavButton to="/settings/security" icon="shield" label="Security" />
				<SubNavButton to="/settings/update" icon="update" label="Update" />
			</div>
		</div>
		<div class="order-5 flex-1 overflow-y-auto">
			<router-view />
		</div>
	</div>
</template>