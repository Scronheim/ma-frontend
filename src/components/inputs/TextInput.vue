<script setup lang="ts">
const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
const props = withDefaults(
  defineProps<{
    modelValue: string
    width?: string
    readonly?: boolean
    placeholder?: string
  }>(),
  {
    modelValue: '',
    width: '100%',
    readonly: false,
    placeholder: 'Введите...'
  }
)
</script>

<template>
  <div class="w-full h-10">
    <input
      :placeholder="props.placeholder"
      :readonly="props.readonly"
      class="pl-4 px-1 py-0 h-full bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
      @input="emits('update:modelValue', $event.target.value)"
      :value="props.modelValue"
      :style="{ width: props.width }"
    />
  </div>
</template>
