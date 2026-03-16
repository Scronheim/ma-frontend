<template>
  <div>
    <!-- Папка -->
    <div v-if="item.type === 'folder'" class="folder-item">
      <div class="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-750 transition-colors duration-150" :class="{ 'bg-gray-750': item.selected }" @click="toggleFolder">
        <svg class="w-4 h-4 mr-1 text-gray-400 transition-transform duration-200" :class="{ 'rotate-90': item.expanded }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>

        <svg class="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>

        <span class="flex-1 text-sm truncate">{{ item.name }}</span>

        <span class="text-xs text-gray-500 ml-2">{{ getFolderFileCount(item) }}</span>
      </div>

      <!-- Рекурсивное отображение содержимого папки -->
      <div v-if="item.expanded" class="ml-6 space-y-1 mt-1">
        <FileTreeItem v-for="child in item.children" :key="child.id" :item="child" :level="level + 1" @toggle="$emit('toggle', $event)" @select="$emit('select', $event)" />
      </div>
    </div>

    <!-- Файл -->
    <div
      v-else
      class="file-item flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-750 transition-colors duration-150"
      :class="{
        'bg-blue-900 bg-opacity-30': item.selected,
        'bg-green-900 bg-opacity-20': item.matched
      }"
      @click="selectFile"
    >
      <div class="flex items-center w-full">
        <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>

        <span class="flex-1 text-sm truncate">{{ item.name }}</span>

        <!-- Иконка соответствия -->
        <svg v-if="item.matched" class="w-4 h-4 text-green-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MusicFolder, MusicFile } from '../types/music-manager'

const props = defineProps<{
  item: MusicFolder | MusicFile
  level: number
}>()

const emit = defineEmits<{
  (e: 'toggle', folder: MusicFolder): void
  (e: 'select', file: MusicFile): void
}>()

const toggleFolder = () => {
  if (props.item.type === 'folder') {
    emit('toggle', props.item as MusicFolder)
  }
}

const selectFile = () => {
  if (props.item.type === 'file') {
    emit('select', props.item as MusicFile)
  }
}

const getFolderFileCount = (folder: MusicFolder): number => {
  let count = 0
  if (folder.children) {
    folder.children.forEach(item => {
      if (item.type === 'file') count++
    })
  }
  return count
}
</script>

<style scoped>
.folder-item,
.file-item {
  user-select: none;
}

.rotate-90 {
  transform: rotate(90deg);
}
</style>
