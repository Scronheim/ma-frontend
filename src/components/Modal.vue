<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto" @click="handleOverlayClick">
        <!-- Затемнение фона -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

        <!-- Контейнер для центрирования модалки -->
        <div class="flex min-h-full items-center justify-center p-4">
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="modelValue"
              class="relative bg-gray-800 rounded-lg border border-gray-700 shadow-xl w-full"
              :class="modalSizeClasses"
              role="dialog"
              aria-modal="true"
              :aria-labelledby="titleId"
            >
              <!-- Заголовок модального окна -->
              <div v-if="title || $slots.title" class="flex items-center justify-between p-6 border-b border-gray-700">
                <div :id="titleId" class="text-xl font-bold text-white">
                  <slot name="title">{{ title }}</slot>
                </div>

                <!-- Кнопка закрытия -->
                <button
                  @click="closeModal"
                  class="text-gray-400 hover:text-white transition-colors duration-200 rounded-lg p-1 hover:bg-gray-700"
                  aria-label="Close modal"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Контент -->
              <div class="p-6" :class="{ 'max-h-[70vh] overflow-y-auto': scrollable }">
                <slot></slot>
              </div>

              <!-- Футер с действиями -->
              <div v-if="showFooter || $slots.footer" class="flex justify-end space-x-3 p-6 border-t border-gray-700">
                <slot name="footer">
                  <button
                    v-if="showCancelButton"
                    @click="handleCancel"
                    class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                  >
                    {{ cancelText }}
                  </button>
                  <button
                    v-if="showConfirmButton"
                    @click="handleConfirm"
                    :disabled="confirmDisabled"
                    :class="[
                      'px-4 py-2 rounded-lg transition-colors duration-200 font-medium',
                      confirmDisabled ? 'bg-gray-600 cursor-not-allowed opacity-50' : confirmButtonClass
                    ]"
                  >
                    {{ confirmText }}
                  </button>
                </slot>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    scrollable?: boolean
    closeOnClickOverlay?: boolean
    closeOnEsc?: boolean
    showFooter?: boolean
    showCancelButton?: boolean
    showConfirmButton?: boolean
    cancelText?: string
    confirmText?: string
    confirmDisabled?: boolean
    confirmButtonClass?: string
  }>(),
  {
    size: 'md',
    scrollable: true,
    closeOnClickOverlay: true,
    closeOnEsc: true,
    showFooter: false,
    showCancelButton: true,
    showConfirmButton: true,
    cancelText: 'Cancel',
    confirmText: 'Confirm',
    confirmDisabled: false,
    confirmButtonClass: 'bg-red-600 hover:bg-red-700 text-white'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'open'): void
}>()

// Генерация уникального ID для accessibility
const titleId = `modal-title-${Math.random().toString(36).substring(2, 9)}`

// Классы для размера модального окна
const modalSizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'max-w-md'
    case 'md':
      return 'max-w-lg'
    case 'lg':
      return 'max-w-2xl'
    case 'xl':
      return 'max-w-4xl'
    case 'full':
      return 'max-w-6xl'
    default:
      return 'max-w-lg'
  }
})

// Методы управления модальным окном
const closeModal = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleCancel = () => {
  emit('cancel')
  closeModal()
}

const handleConfirm = () => {
  if (!props.confirmDisabled) {
    emit('confirm')
  }
}

const handleOverlayClick = (event: MouseEvent) => {
  if (props.closeOnClickOverlay && event.target === event.currentTarget) {
    closeModal()
  }
}

// Обработка нажатия ESC
const handleKeyDown = (event: KeyboardEvent) => {
  if (props.closeOnEsc && event.key === 'Escape' && props.modelValue) {
    closeModal()
  }
}

// Блокировка скролла body при открытой модалке
watch(
  () => props.modelValue,
  newValue => {
    if (newValue) {
      document.body.style.overflow = 'hidden'
      emit('open')
    } else {
      document.body.style.overflow = ''
    }
  }
)

// Очистка при размонтировании
onUnmounted(() => {
  document.body.style.overflow = ''
})

// Добавление/удаление обработчика клавиш
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>
