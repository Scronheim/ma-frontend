<script setup lang="ts">
const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
const props = withDefaults(
  defineProps<{
    modelValue: string
    rows?: number
    readonly?: boolean
    placeholder?: string
  }>(),
  {
    modelValue: '',
    rows: 10,
    readonly: false,
    placeholder: 'Введите...'
  }
)
</script>

<template>
  <textarea
    :placeholder="props.placeholder"
    :readonly="props.readonly"
    :rows="props.rows"
    class="w-full pl-4 px-1 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
    @input="emits('update:modelValue', $event.target.value)"
    :value="props.modelValue"
  />
</template>
