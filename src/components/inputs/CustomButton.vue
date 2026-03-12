<script setup lang="ts">
import { computed } from 'vue'

import { Icon } from '@iconify/vue'

const emits = defineEmits<{
  (e: 'click'): void
}>()
const props = withDefaults(
  defineProps<{
    text?: string
    color?: string
    startIcon?: string
    endIcon?: string
    loading?: boolean
    thin?: boolean
    disabled?: boolean
  }>(),
  {
    text: '',
    color: 'gray',
    startIcon: '',
    endIcon: '',
    loading: false,
    thin: false,
    disabled: false
  }
)

const buttonIconStart = computed((): string => {
  return `mdi:${props.startIcon}`
})

const buttonIconEnd = computed((): string => {
  return `mdi:${props.endIcon}`
})

const buttonYPadding = computed((): string => {
  return props.thin ? 'py-1' : 'py-2'
})
</script>

<template>
  <button
    class="px-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center cursor-pointer"
    :class="[buttonYPadding]"
    :disabled="props.disabled"
    @click="emits('click')"
  >
    <Icon v-if="props.loading" icon="mdi:loading" class="animate-spin" width="20" height="20" />
    <Icon v-if="props.startIcon" :icon="buttonIconStart" width="20" height="20" />
    <span class="mr-0">{{ props.text }}</span>
    <Icon v-if="props.endIcon" :icon="buttonIconEnd" width="20" height="20" />
  </button>
</template>
