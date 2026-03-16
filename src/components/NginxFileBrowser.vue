<template>
  <div class="h-full flex flex-col bg-gray-800 border-r border-gray-700">
    <!-- Заголовок -->
    <div class="p-4 border-b border-gray-700">
      <h2 class="text-lg font-bold text-white flex items-center">
        <Icon icon="mdi:archive" class="w-5 h-5 mr-2 text-red-400" />
        Музыка на сервере
      </h2>
    </div>

    <!-- Навигационная строка -->
    <div class="px-4 py-2 bg-gray-750 border-b border-gray-700">
      <div class="flex items-center space-x-2 text-sm">
        <button @click="navigateTo('/')" class="text-gray-400 hover:text-white" :disabled="currentPath === '/'">
          <Icon icon="mdi:home" width="18" />
        </button>

        <span class="text-gray-600">/</span>

        <div class="flex-1 flex items-center flex-wrap gap-1">
          <template v-for="(crumb, index) in breadcrumbs" :key="index">
            <button @click="navigateTo(crumb.path)" class="text-gray-400 hover:text-white px-0" :class="{ 'text-red-400': index === breadcrumbs.length - 1 }">
              {{ crumb.name }}
            </button>
            <span class="text-gray-600">{{ index !== breadcrumbs.length - 1 ? '/' : '' }}</span>
          </template>
        </div>
      </div>
    </div>

    <!-- Фильтр -->
    <div class="px-4 py-2 bg-gray-750 border-b border-gray-700 text-xs text-gray-400 flex justify-between">
      <TextInput placeholder="Введите название группы" :model-value="filter" @update:model-value="filter = $event" />
    </div>

    <!-- Список файлов -->
    <div class="flex-1 overflow-y-auto p-2">
      <!-- Индикатор загрузки -->
      <div v-if="isLoading" class="flex items-center justify-center py-8">
        <div class="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Сообщение об ошибке -->
      <div v-else-if="error" class="text-center py-8 text-red-400">
        <svg class="w-12 h-12 mx-auto mb-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>{{ error }}</p>
        <button @click="refreshCurrentDirectory" class="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm">Retry</button>
      </div>

      <!-- Список файлов -->
      <div v-else class="space-y-1">
        <!-- Кнопка "Наверх" (если не в корне) -->
        <div v-if="currentPath !== '/'" class="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-750 text-gray-400 select-none" @click="navigateTo(parentPath)">
          <Icon class="w-6 h-6" icon="mdi:chevron-left" />
          <span>назад</span>
        </div>

        <!-- Папки -->
        <div v-for="item in directories" :key="item.path" class="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-900 select-none" @click="navigateTo(item.path)">
          <Icon icon="mdi:folder-outline" class="w-6 h-6 mr-2 text-yellow-500" />
          <span class="flex-1">{{ item.name }}</span>
          <span class="text-xs text-gray-500">{{ formatDate(item.mtime) }}</span>
        </div>

        <!-- Файлы -->
        <div v-for="item in files" :key="item.path" class="flex items-center p-2 rounded-lg hover:bg-gray-900 select-none">
          <Icon icon="mdi:file-document" class="w-5 h-5 mr-2" />
          <span class="flex-1">{{ item.name }}</span>
          <span class="text-xs text-gray-500 mr-3">{{ formatFileSize(item.size) }}</span>
        </div>

        <!-- Пустая директория -->
        <div v-if="items.length === 0" class="text-center py-8 text-gray-500">
          <p>Directory is empty</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'

import { useStore } from '@/store/store'

import { nginxService } from '../services/nginx.service'

import TextInput from './inputs/TextInput.vue'

import type { NginxItem } from '@/types'

const emit = defineEmits<{
  (e: 'navigate', path: string): void
  (e: 'select-files', files: NginxItem[]): void
  (e: 'match-selected'): void
  (e: 'clear-results'): void
}>()

const store = useStore()

// Состояние
const currentPath = ref('/')
const filter = ref('')
const items = ref<NginxItem[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const breadcrumbs = computed(() => {
  const parts = currentPath.value.split('/').filter(p => p)
  let path = ''
  return [
    ...parts.map(part => {
      path += '/' + part
      return { name: part, path }
    })
  ]
})

const parentPath = computed(() => {
  if (currentPath.value === '/') return '/'
  const parts = currentPath.value.split('/').filter(p => p)
  parts.pop()
  return '/' + parts.join('/')
})

// Фильтрация папок и файлов
const directories = computed(() => items.value.filter(item => item.type === 'directory' && item.name.toLowerCase().includes(filter.value.toLowerCase())))

const files = computed(() =>
  items.value
    .filter(item => item.type === 'file' && (item.name.endsWith('.mp3') || item.name.endsWith('.flac')))
    .sort((a, b) => {
      return (parseInt(a.name) || Infinity) - (parseInt(b.name) || Infinity)
    })
)

// Загрузка содержимого директории
const loadDirectory = async (path: string) => {
  isLoading.value = true
  error.value = null

  try {
    items.value = await nginxService.listDirectory(path)
    if (files.value.length) emit('select-files', files.value)
    currentPath.value = path
    emit('navigate', path)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load directory'
    items.value = []
  } finally {
    isLoading.value = false
  }
}

// Навигация
const navigateTo = (path: string) => {
  filter.value = ''
  loadDirectory(path)
}

// Обновление текущей директории
const refreshCurrentDirectory = () => {
  loadDirectory(currentPath.value)
}

// Форматирование
const formatFileSize = (bytes?: number): string => {
  if (!bytes) return ''
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

watch(breadcrumbs, value => {
  if (value.length === 1) store.fileManagerSearchObject.query = value[0].name
  else if (value.length === 0) emit('clear-results')
})

// Инициализация
loadDirectory('/')
</script>

<style scoped></style>
