<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="visible"
        ref="menuRef"
        class="fixed z-50 min-w-[200px] bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden"
        :style="{
          left: position.x + 'px',
          top: position.y + 'px'
        }"
        @contextmenu.prevent
      >
        <!-- Заголовок (опционально) -->
        <div v-if="title" class="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-700 bg-gray-750">
          {{ title }}
        </div>

        <!-- Список пунктов меню -->
        <div class="py-1">
          <template v-for="(item, index) in items" :key="index">
            <!-- Разделитель -->
            <div v-if="item.divider" class="my-1 border-t border-gray-700"></div>

            <!-- Пункт меню -->
            <button
              v-else
              @click="handleItemClick(item)"
              @mouseenter="item.disabled ? null : (hoveredItem = index)"
              @mouseleave="hoveredItem = null"
              class="w-full text-left px-3 py-2 flex items-center space-x-3 transition-colors duration-150"
              :class="[
                item.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : hoveredItem === index
                    ? item.danger
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-white'
                    : item.danger
                      ? 'text-red-400'
                      : 'text-gray-300'
              ]"
              :disabled="item.disabled"
            >
              <!-- Иконка слева -->
              <Icon :icon="`mdi:${item.icon}`" />

              <!-- Текст -->
              <span class="flex-1 text-sm">{{ item.label }}</span>

              <!-- Shortcut / горячая клавиша -->
              <span v-if="item.shortcut" class="text-xs text-gray-500">{{ item.shortcut }}</span>

              <!-- Подменю (стрелка) -->
              <svg v-if="item.children" class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>

              <!-- Checkbox для множественного выбора -->
              <div v-else-if="item.checked !== undefined" class="ml-2">
                <div
                  class="w-4 h-4 border rounded flex items-center justify-center transition-colors duration-150"
                  :class="item.checked ? 'bg-red-600 border-red-600' : 'border-gray-600'"
                >
                  <svg v-if="item.checked" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </button>
          </template>
        </div>

        <!-- Футер (опционально) -->
        <div v-if="$slots.footer" class="border-t border-gray-700 p-2 bg-gray-750">
          <slot name="footer"></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

export interface ContextMenuItem {
  label?: string
  icon?: any
  iconSvg?: string
  iconClass?: string
  disabled?: boolean
  danger?: boolean
  divider?: boolean
  shortcut?: string
  checked?: boolean
  children?: ContextMenuItem[]
  action?: () => void
  [key: string]: any
}

const props = withDefaults(
  defineProps<{
    visible: boolean
    items: ContextMenuItem[]
    position: { x: number; y: number }
    title?: string
    closeOnClick?: boolean
    closeOnClickOutside?: boolean
    boundaryPadding?: number
  }>(),
  {
    closeOnClick: true,
    closeOnClickOutside: true,
    boundaryPadding: 10
  }
)

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'close'): void
  (e: 'item-click', item: ContextMenuItem): void
}>()

const menuRef = ref<HTMLElement | null>(null)
const hoveredItem = ref<number | null>(null)

// Корректировка позиции, чтобы меню не выходило за границы экрана
const adjustedPosition = ref({ x: props.position.x, y: props.position.y })

watch(
  () => props.visible,
  async newVal => {
    if (newVal) {
      await nextTick()
      adjustPosition()
    }
  }
)

watch(
  () => props.position,
  () => {
    if (props.visible) {
      adjustPosition()
    }
  }
)

const adjustPosition = () => {
  if (!menuRef.value) return

  const menu = menuRef.value.getBoundingClientRect()
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  let x = props.position.x
  let y = props.position.y

  // Корректировка по горизонтали
  if (x + menu.width > viewport.width - props.boundaryPadding) {
    x = viewport.width - menu.width - props.boundaryPadding
  }

  // Корректировка по вертикали
  if (y + menu.height > viewport.height - props.boundaryPadding) {
    y = viewport.height - menu.height - props.boundaryPadding
  }

  // Не даём уйти за левый край
  x = Math.max(props.boundaryPadding, x)

  // Не даём уйти за верхний край
  y = Math.max(props.boundaryPadding, y)

  adjustedPosition.value = { x, y }
}

// Обработка клика по пункту меню
const handleItemClick = (item: ContextMenuItem) => {
  if (item.disabled) return

  emit('item-click', item)

  if (item.action) {
    item.action()
  }

  if (item.children) {
    // Для подменю не закрываем
    return
  }

  if (props.closeOnClick) {
    closeMenu()
  }
}

// Закрытие меню
const closeMenu = () => {
  emit('update:visible', false)
  emit('close')
}

// Обработка клика вне меню
const handleClickOutside = (event: MouseEvent) => {
  if (!props.closeOnClickOutside || !props.visible) return

  const target = event.target as HTMLElement
  if (menuRef.value && !menuRef.value.contains(target)) {
    closeMenu()
  }
}

// Обработка клавиши Escape
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.visible) {
    closeMenu()
  }
}

// Обработка изменения размера окна
const handleResize = () => {
  if (props.visible) {
    adjustPosition()
  }
}

// Жизненный цикл
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Анимация появления */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
