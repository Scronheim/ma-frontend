<script setup lang="ts">
const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
const props = withDefaults(
  defineProps<{
    modelValue: string
    items: { title: string; value: any }[]
    width?: string
    titleText?: string
    valueText?: string
    multiple?: boolean
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    items: [],
    width: '100%',
    titleText: 'title',
    valueText: 'value',
    multiple: false,
    disabled: false
  }
)
</script>

<template>
  <div class="w-full h-10">
    <select
      :value="props.modelValue"
      :disabled="props.disabled"
      :multiple="props.multiple"
      class="pl-3 h-full bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
      @change="emits('update:modelValue', $event.target.value)"
      :style="{ width: props.width }"
    >
      <option v-for="item in props.items" :value="item[props.valueText]">{{ item[props.titleText] }}</option>
    </select>
  </div>
</template>
