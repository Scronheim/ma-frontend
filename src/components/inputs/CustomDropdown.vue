<template>
  <div class="custom-dropdown relative inline-block" ref="dropdownRef">
    <!-- Кнопка-триггер -->
    <button
      @click="toggleDropdown"
      @mouseenter="hover && openDropdown()"
      @mouseleave="hover && closeDropdown()"
      class="dropdown-trigger flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200"
      :class="[
        triggerClass,
        {
          'bg-gray-700 text-white': !transparent,
          'bg-transparent hover:bg-gray-700': transparent,
          'border border-gray-700': bordered,
          'opacity-50 cursor-not-allowed': disabled
        }
      ]"
      :disabled="disabled"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
    >
      <span class="flex-1 text-left">{{ title }}</span>

      <!-- Иконка справа -->
      <svg class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Выпадающее меню -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="dropdown-menu absolute z-50 mt-2 min-w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden"
        :class="[menuWidth === 'auto' ? 'min-w-[200px]' : `w-${menuWidth}`, menuPosition === 'left' ? 'left-0' : 'right-0']"
        @mouseenter="hover && clearTimeout(timeoutId)"
        @mouseleave="hover && closeDropdown()"
      >
        <!-- Заголовок меню (опционально) -->
        <div v-if="menuTitle" class="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-700">
          {{ menuTitle }}
        </div>

        <!-- Поиск (опционально) -->
        <div v-if="searchable" class="p-2 border-b border-gray-700">
          <div class="relative">
            <svg class="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search..."
              class="w-full pl-8 pr-3 py-1.5 bg-gray-750 border border-gray-700 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
              @click.stop
            />
          </div>
        </div>

        <!-- Список пунктов -->
        <div class="max-h-60 overflow-y-auto">
          <!-- Группы (если есть) -->
          <template v-for="(item, index) in filteredItems" :key="index">
            <div v-if="item.divider" class="my-1 border-t border-gray-700"></div>

            <div v-else-if="item.header" class="px-4 py-1 text-xs font-semibold text-gray-500 uppercase bg-gray-750">
              {{ item.label }}
            </div>

            <button
              v-else
              @click="selectItem(item)"
              class="w-full text-left px-4 py-2.5 hover:bg-gray-750 transition-colors duration-150 flex items-center space-x-3"
              :class="[
                item.disabled ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : '',
                item.danger ? 'text-red-400 hover:text-red-300' : 'text-gray-300 hover:text-white',
                item.active ? 'bg-red-600 bg-opacity-20 text-red-400' : ''
              ]"
              :disabled="item.disabled"
            >
              <!-- Иконка слева -->
              <component v-if="item.icon" :is="item.icon" class="w-4 h-4" :class="item.iconClass" />
              <span v-else-if="item.iconSvg" v-html="item.iconSvg" class="w-4 h-4"></span>

              <!-- Текст -->
              <span class="flex-1">{{ item.label }}</span>

              <!-- Shortcut / Badge -->
              <span v-if="item.shortcut" class="text-xs text-gray-500">{{ item.shortcut }}</span>
              <span v-if="item.badge" class="px-1.5 py-0.5 text-xs rounded-full" :class="item.badgeClass || 'bg-gray-700'">
                {{ item.badge }}
              </span>

              <!-- Checkbox для множественного выбора -->
              <div v-if="multiple" class="ml-2">
                <div
                  class="w-4 h-4 border rounded flex items-center justify-center transition-colors duration-150"
                  :class="isSelected(item) ? 'bg-red-600 border-red-600' : 'border-gray-600'"
                >
                  <svg v-if="isSelected(item)" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <!-- Радио для одиночного выбора -->
              <div v-else-if="!hideSelectedIcon" class="ml-2">
                <div v-if="isSelected(item)" class="w-2 h-2 bg-red-600 rounded-full"></div>
              </div>
            </button>
          </template>

          <!-- Пустое состояние -->
          <div v-if="filteredItems.length === 0" class="px-4 py-8 text-center text-gray-500">
            <svg class="w-8 h-8 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm">No items found</p>
          </div>
        </div>

        <!-- Футер (опционально) -->
        <div v-if="$slots.footer" class="border-t border-gray-700 p-2 bg-gray-750">
          <slot name="footer"></slot>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

export interface DropdownItem {
  title: string
  value: string
  icon?: any
  iconSvg?: string
  iconClass?: string
  disabled?: boolean
  danger?: boolean
  active?: boolean
  divider?: boolean
  header?: boolean
  shortcut?: string
  badge?: string
  badgeClass?: string
  group?: string
}

const props = withDefaults(
  defineProps<{
    title: string
    items: (DropdownItem | { divider: boolean } | { header: boolean; title: string })[]
    modelValue?: any
    multiple?: boolean
    disabled?: boolean
    hover?: boolean
    transparent?: boolean
    bordered?: boolean
    triggerClass?: string
    menuWidth?: 'auto' | number
    menuPosition?: 'left' | 'right'
    menuTitle?: string
    searchable?: boolean
    hideSelectedIcon?: boolean
    closeOnSelect?: boolean
    closeOnClickOutside?: boolean
  }>(),
  {
    modelValue: null,
    multiple: false,
    disabled: false,
    hover: false,
    transparent: false,
    bordered: true,
    triggerClass: '',
    menuWidth: 'auto',
    menuPosition: 'left',
    menuTitle: '',
    searchable: false,
    hideSelectedIcon: false,
    closeOnSelect: true,
    closeOnClickOutside: true
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: any): void
  (e: 'open'): void
  (e: 'close'): void
  (e: 'select', item: DropdownItem): void
}>()

const dropdownRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const searchQuery = ref('')
const timeoutId = ref<number | null>(null)

// Фильтрация пунктов при поиске
const filteredItems = computed(() => {
  if (!searchQuery.value || !props.searchable) return props.items

  const query = searchQuery.value.toLowerCase()
  return props.items.filter(item => {
    if ('divider' in item || 'header' in item) return true
    return (item as DropdownItem).label.toLowerCase().includes(query)
  })
})

// Проверка выбранного элемента
const isSelected = (item: DropdownItem) => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) && props.modelValue.includes(item.value)
  }
  return props.modelValue === item.value
}

// Открытие/закрытие
const openDropdown = () => {
  if (props.disabled) return
  isOpen.value = true
  emit('open')
}

const closeDropdown = () => {
  if (props.hover) {
    timeoutId.value = window.setTimeout(() => {
      isOpen.value = false
      emit('close')
    }, 200)
  } else {
    isOpen.value = false
    emit('close')
  }
}

const toggleDropdown = () => {
  if (props.disabled) return
  if (isOpen.value) {
    closeDropdown()
  } else {
    openDropdown()
  }
}

// Выбор элемента
const selectItem = (item: DropdownItem) => {
  if (item.disabled) return

  emit('select', item)

  if (props.multiple) {
    const currentValue = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const index = currentValue.indexOf(item.value)

    if (index === -1) {
      currentValue.push(item.value)
    } else {
      currentValue.splice(index, 1)
    }

    emit('update:modelValue', currentValue)
    emit('change', currentValue)
  } else {
    emit('update:modelValue', item.value)
    emit('change', item.value)

    if (props.closeOnSelect) {
      isOpen.value = false
    }
  }
}

// Обработка клика вне компонента
const handleClickOutside = (event: MouseEvent) => {
  if (!props.closeOnClickOutside) return

  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
    emit('close')
  }
}

// Обработка клавиши Escape
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    isOpen.value = false
    emit('close')
  }
}

// Очистка таймера при наведении
const clearHoverTimeout = () => {
  if (timeoutId.value) {
    clearTimeout(timeoutId.value)
    timeoutId.value = null
  }
}

// Жизненный цикл
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
  if (timeoutId.value) {
    clearTimeout(timeoutId.value)
  }
})

// Сброс поиска при закрытии
watch(isOpen, newVal => {
  if (!newVal) {
    searchQuery.value = ''
  }
})

// Экспортируем методы
defineExpose({
  open: openDropdown,
  close: closeDropdown,
  toggle: toggleDropdown
})
</script>

<style scoped>
/* Анимация для выпадающего меню */
.dropdown-menu {
  transform-origin: top;
}

/* Кастомный скроллбар для меню */
.max-h-60::-webkit-scrollbar {
  width: 6px;
}

.max-h-60::-webkit-scrollbar-track {
  background: #1f2937;
}

.max-h-60::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 3px;
}

.max-h-60::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Стили для кнопки-триггера */
.dropdown-trigger {
  min-width: 120px;
}

/* Адаптивность */
@media (max-width: 640px) {
  .dropdown-menu {
    min-width: 100% !important;
    position: fixed;
    left: 1rem !important;
    right: 1rem !important;
    width: auto !important;
    max-width: none;
  }
}
</style>
