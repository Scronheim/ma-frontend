<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'

import { useStore } from '@/store/store'

import NginxFileBrowser from '../components/NginxFileBrowser.vue'
import DatabaseSearch from '../components/DatabaseSearch.vue'

import type { Band, Album, NginxItem, ShortAlbum } from '@/types/index.ts'

const store = useStore()

// Состояние
const currentPath = ref('')
const selectedFiles = ref<NginxItem[]>([])
const searchResults = ref<Band[]>([])
const selectedBand = ref<Band>()
const selectedAlbum = ref<Album | ShortAlbum>()

const updateAlbum = (album: Album, bandIndex: number, albumIndex: number) => {
  searchResults.value[bandIndex].discography[albumIndex] = album
}

const updateBand = (band: Band, index: number) => {
  searchResults.value[index] = band
}

// Обработчики событий от левой панели
const handleNavigate = (path: string) => {
  currentPath.value = path
}

// Методы для правой панели
const searchDatabase = async (query: string) => {
  if (!query.trim()) {
    searchResults.value = []
    return
  }

  const { data } = await store.searchBand(query)
  searchResults.value = data
}
const matchWholeAlbum = async (band: Band, album: Album | ShortAlbum) => {
  if (selectedFiles.value.length === 0) {
    ElMessage.warning('Please select files from the left panel first')
    return
  }

  selectedBand.value = band
  selectedAlbum.value = album
  selectedAlbum.value.tracklist.map((track, index) => {
    track.url = selectedFiles.value[index].url
  })
  await store.updateAlbum(selectedAlbum.value.id, selectedAlbum.value)
  ElNotification({
    type: 'success',
    message: `Альбом ${selectedAlbum.value.title} обновлён`
  })
}
</script>

<template>
  <div class="flex">
    <!-- Левая панель - nginx file browser -->
    <div class="w-1/4 min-w-[200px] max-w-[400px] h-full">
      <div class="h-full relative" @click.right="e => e.preventDefault()">
        <!-- Контейнер с контекстным меню для всей панели -->
        <NginxFileBrowser ref="fileBrowserRef" @navigate="handleNavigate" @select-files="selectedFiles = $event" @clear-results="searchResults = []" />
      </div>
    </div>

    <!-- Правая панель - база данных -->
    <div class="flex-1 h-full">
      <DatabaseSearch :search-results="searchResults" @search="searchDatabase" @match-album="matchWholeAlbum" @update:band="updateBand" @update:album="updateAlbum" />
    </div>
  </div>
</template>

<style scoped>
.h-full {
  height: calc(100vh - 71px);
}
</style>
