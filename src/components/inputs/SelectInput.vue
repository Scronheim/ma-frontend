<script setup lang="ts">
const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
const props = withDefaults(
  defineProps<{
    modelValue: string
    items: { title: string; value: any }[]
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    items: [],
    disabled: false
  }
)
</script>

<template>
  <select
    :value="props.modelValue"
    :disabled="props.disabled"
    class="pl-3 px-1 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
    @change="emits('update:modelValue', $event.target.value)"
  >
    <option v-for="item in props.items" :value="item.value">{{ item.title }}</option>
  </select>
</template>
