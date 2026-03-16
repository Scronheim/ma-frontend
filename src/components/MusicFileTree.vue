<template>
  <div class="h-full flex flex-col bg-gray-800 border-r border-gray-700">
    <!-- Заголовок -->
    <div class="p-4 border-b border-gray-700">
      <h2 class="text-lg font-bold text-white flex items-center">
        <svg class="w-5 h-5 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        Music Folders
      </h2>
    </div>

    <!-- Статистика -->
    <div class="px-4 py-2 bg-gray-750 border-b border-gray-700 text-xs text-gray-400 flex justify-between">
      <span>{{ totalFiles }} files</span>
      <span>{{ matchedFiles }} matched</span>
    </div>

    <!-- Дерево папок -->
    <div class="flex-1 overflow-y-auto p-2">
      <FileTreeItem v-for="item in folders" :key="item.id" :item="item" :level="0" @toggle="toggleFolder" @select="selectFile" />
    </div>

    <!-- Нижняя панель с действиями -->
    <div class="p-4 border-t border-gray-700 bg-gray-750">
      <button
        @click="matchSelected"
        class="w-full mb-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center space-x-2"
        :disabled="!selectedFiles.length"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span>Match Selected ({{ selectedFiles.length }})</span>
      </button>

      <button @click="clearMatches" class="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 text-sm">Clear All Matches</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import FileTreeItem from './FileTreeItem.vue'
import type { MusicFolder, MusicFile, MusicItem } from '../types/music-manager'

const props = defineProps<{
  folders: MusicFolder[]
  selectedFiles: MusicFile[]
}>()

const emit = defineEmits<{
  (e: 'toggle-folder', folder: MusicFolder): void
  (e: 'select-file', file: MusicFile): void
  (e: 'add-folder'): void
  (e: 'match-selected'): void
  (e: 'clear-matches'): void
}>()

// Подсчет файлов
const totalFiles = computed(() => {
  let count = 0
  const countFiles = (items: MusicItem[]) => {
    items.forEach(item => {
      if (item.type === 'file') {
        count++
      } else if (item.children) {
        countFiles(item.children)
      }
    })
  }
  props.folders.forEach(folder => {
    if (folder.children) {
      countFiles(folder.children)
    }
  })
  return count
})

const matchedFiles = computed(() => {
  let count = 0
  const countMatched = (items: MusicItem[]) => {
    items.forEach(item => {
      if (item.type === 'file' && item.matched) {
        count++
      } else if (item.children) {
        countMatched(item.children)
      }
    })
  }
  props.folders.forEach(folder => {
    if (folder.children) {
      countMatched(folder.children)
    }
  })
  return count
})

const toggleFolder = (folder: MusicFolder) => {
  emit('toggle-folder', folder)
}

const selectFile = (file: MusicFile) => {
  emit('select-file', file)
}

const addFolder = () => {
  emit('add-folder')
}

const matchSelected = () => {
  emit('match-selected')
}

const clearMatches = () => {
  emit('clear-matches')
}
</script>

<style scoped>
/* Стили для скроллбара */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #1f2937;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
