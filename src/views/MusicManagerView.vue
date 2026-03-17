<template>
  <div class="flex">
    <!-- Левая панель - nginx file browser -->
    <div class="w-1/4 min-w-[200px] max-w-[400px] h-full">
      <div class="h-full relative" @click.right="e => e.preventDefault()">
        <!-- Контейнер с контекстным меню для всей панели -->
        <NginxFileBrowser @navigate="handleNavigate" @select-files="selectedFiles = $event" @clear-results="searchResults = []" @context-menu="openFileContextMenu" />
      </div>
    </div>

    <!-- Правая панель - база данных -->
    <div class="flex-1 h-full">
      <DatabaseSearch :search-results="searchResults" @search="searchDatabase" @match-album="matchWholeAlbum" @update:band="updateBand" @update:album="updateAlbum" />
    </div>

    <!-- Компонент контекстного меню -->
    <ContextMenu v-model:visible="contextMenu.visible" :items="contextMenu.items" :position="contextMenu.position" />
    <!-- Модальное окно загрузки -->
    <FileUploadModal v-model="showUploadModal" title="Загрузка файлов" :multiple="true" :max-size="500 * 1024 * 1024" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'

import { useStore } from '@/store/store'

import NginxFileBrowser from '../components/NginxFileBrowser.vue'
import DatabaseSearch from '../components/DatabaseSearch.vue'
import ContextMenu from '../components/ContextMenu.vue'
import FileUploadModal from '../components/FileUploadModal.vue'

import type { Band, Album, NginxItem, ShortAlbum, ContextMenuItem } from '@/types/index.ts'

const store = useStore()

// Состояние
const currentPath = ref('')
const selectedFiles = ref<NginxItem[]>([])
const searchResults = ref<Band[]>([])
const selectedBand = ref<Band>()
const selectedAlbum = ref<Album | ShortAlbum>()
const showUploadModal = ref<boolean>(false)

const contextMenu = reactive({
  visible: false,
  items: [] as ContextMenuItem[],
  position: { x: 0, y: 0 },
  title: '',
  contextData: null as any
})

const openFileContextMenu = (event: MouseEvent, file: NginxItem) => {
  let items: ContextMenuItem[] = []
  if (file.type === 'file') {
    items = [
      {
        label: 'Play',
        icon: 'play',
        action: () => playFile(file)
      },
      {
        label: 'Download',
        icon: 'download',
        action: () => downloadFile(file)
      },
      { divider: true },
      {
        label: 'Copy URL',
        icon: 'content-copy',
        shortcut: 'Ctrl+C',
        action: () => copyFileUrl(file)
      },
      {
        label: 'Copy Path',
        icon: 'content-copy',
        action: () => copyFilePath(file)
      },
      { divider: true },
      {
        label: 'Delete',
        danger: true,
        icon: 'delete',
        action: () => deleteFile(file)
      }
    ]
  } else {
    items = [
      {
        label: 'Создать папку',
        icon: 'folder-plus',
        action: () => addFolder()
      },
      {
        label: 'Переименовать',
        icon: 'pencil',
        action: () => (showUploadModal.value = true)
      },
      {
        label: 'Загрузить сюда',
        icon: 'upload',
        action: () => (showUploadModal.value = true)
      },
      {
        divider: true
      },
      {
        label: `Создать папку в "${file.name}"`,
        icon: 'folder-plus',
        action: () => addFolder()
      },
      {
        label: `Загрузить в ${file.name}`,
        icon: 'upload',
        action: () => addFolder()
      }
    ]
  }

  contextMenu.items = items
  contextMenu.position = { x: event.clientX, y: event.clientY }
  contextMenu.title = file.name
  contextMenu.contextData = { type: 'file', data: file }
  contextMenu.visible = true
}
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

<style scoped>
.h-full {
  height: calc(100vh - 71px);
}
</style>
