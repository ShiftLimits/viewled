<script setup lang="ts">
  import { computed } from 'vue'

  const props = withDefaults(defineProps<{
    prefix?:string,
    name:string
  }>(), {
    prefix: 'icon',
    name: 'info'
  })

  const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>

<template>
  <svg viewBox="0 0 1 1" aria-hidden="true" class="aspect-square">
    <use :xlink:href="symbolId" />
  </svg>
</template>