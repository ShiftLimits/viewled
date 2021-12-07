<script setup lang="ts">
	import { useWLEDClient } from "vue-wled"

const { info, reboot } = useWLEDClient()
</script>

<template>
	<div class="p-1">
		<div class="flex flex-col gap-1">
			<h1>Credits</h1>
			<h2>WLED</h2>
			<p>WLED is created by Christian Schwinne (aka AirCookie)</p>
			<h2>VieWLED</h2>
			<p>VieWLED is created by Jeff Schofield</p>
			<h3>Icons</h3>
			<p>Nightlight Icon from the Unicons set by Iconscout</p>
			<p>Shield Icon by Font Awesome</p>
			<p>Hardware Icon created by WEBTECHOPS LLP from NounProject.com</p>
		</div>
	</div>
</template>