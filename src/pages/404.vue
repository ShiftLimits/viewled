<script setup lang="ts">
import AbstractButton from "../components/AbstractButton.vue";
	
</script>

<template>
	<div class="h-full flex flex-col items-center justify-center p-1 bg-gradient-radial-side from-neutral-800 to-transparent">
		<img src="../assets/images/base-akemi.png" title="404 Not Found" class="w-full max-w-14 pixellated" />
		<div class="font-medium text-4xl"><span class="font-black">404</span> Not Found</div>
		<div>Akemi does not know where you are headed...</div>
		<AbstractButton to="/" class="mt-1 px-1 py-1/2 leading-1 rounded-1/2 bg-neutral-700 mouse:hover:bg-neutral-600">Back To Controls</AbstractButton>
	</div>
</template>