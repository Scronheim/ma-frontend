<template>
  <Modal
    v-model="isOpen"
    :title="title"
    size="sm"
    :show-footer="true"
    :confirm-text="confirmText"
    :cancel-text="cancelText"
    :confirm-disabled="confirmDisabled"
    :confirm-button-class="confirmButtonClass"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @close="handleClose"
  >
    <div class="flex items-start space-x-4">
      <!-- Иконка в зависимости от типа -->
      <div class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" :class="iconBackgroundClass">
        <svg
          v-if="type === 'warning'"
          class="w-6 h-6 text-yellow-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>

        <svg
          v-else-if="type === 'danger'"
          class="w-6 h-6 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        <svg
          v-else-if="type === 'success'"
          class="w-6 h-6 text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        <svg v-else class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <!-- Сообщение -->
      <div class="flex-1">
        <p class="text-gray-300" v-html="message"></p>
        <p v-if="details" class="text-sm text-gray-400 mt-2">{{ details }}</p>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Modal from './Modal.vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    message: string
    details?: string
    type?: 'info' | 'warning' | 'danger' | 'success'
    confirmText?: string
    cancelText?: string
    confirmDisabled?: boolean
  }>(),
  {
    title: 'Confirm Action',
    type: 'info',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmDisabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'close'): void
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const iconBackgroundClass = computed(() => {
  switch (props.type) {
    case 'warning':
      return 'bg-yellow-500 bg-opacity-20'
    case 'danger':
      return 'bg-red-500 bg-opacity-20'
    case 'success':
      return 'bg-green-500 bg-opacity-20'
    default:
      return 'bg-blue-500 bg-opacity-20'
  }
})

const confirmButtonClass = computed(() => {
  switch (props.type) {
    case 'warning':
      return 'bg-yellow-600 hover:bg-yellow-700 text-white'
    case 'danger':
      return 'bg-red-600 hover:bg-red-700 text-white'
    case 'success':
      return 'bg-green-600 hover:bg-green-700 text-white'
    default:
      return 'bg-blue-600 hover:bg-blue-700 text-white'
  }
})

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
  isOpen.value = false
}

const handleClose = () => {
  emit('close')
}
</script>
