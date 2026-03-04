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
    disabled?: boolean
  }>(),
  {
    text: '',
    color: 'gray',
    startIcon: '',
    endIcon: '',
    loading: false,
    disabled: false
  }
)

const buttonIconStart = computed((): string => {
  return `mdi:${props.startIcon}`
})

const buttonIconEnd = computed((): string => {
  return `mdi:${props.endIcon}`
})
</script>

<template>
  <button
    class="px-2 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center space-x-2 cursor-pointer"
    :disabled="props.disabled"
    @click="emits('click')"
  >
    <Icon v-if="props.loading" icon="mdi:loading" class="animate-spin" width="20" height="20" />
    <Icon v-if="props.startIcon" :icon="buttonIconStart" width="20" height="20" />
    <span>{{ props.text }}</span>
    <Icon v-if="props.endIcon" :icon="buttonIconEnd" width="20" height="20" />
  </button>
</template>
