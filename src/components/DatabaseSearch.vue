<script setup lang="ts">
import { ref, watch } from 'vue'
import { debounce } from 'lodash-es'
import { Icon } from '@iconify/vue'

import { useStore } from '@/store/store'

import LoadingSpinner from './LoadingSpinner.vue'
import CustomButton from './inputs/CustomButton.vue'

import type { Band, Album } from '@/types'

const props = defineProps<{
  searchResults: Band[]
  showOnlyMatched?: boolean
}>()

const emit = defineEmits<{
  (e: 'search', query: string): void
  (e: 'match-album', band: Band, album: Album): void
  (e: 'update:band', band: Band, index: number): void
  (e: 'update:album', album: Album, bandIndex: number, albumIndex: number): void
}>()

const store = useStore()

const isLoading = ref(false)
const expandedBands = ref<number[]>([])
const expandedAlbums = ref<number[]>([])

const performSearch = debounce(async (query: string) => {
  emit('search', query)
}, 500)

const toggleBand = async (bandId: number, index: number) => {
  if (expandedBands.value.includes(bandId)) {
    expandedBands.value = expandedBands.value.filter(id => id !== bandId)
  } else {
    const band = await store.getBandById(bandId)
    emit('update:band', band, index)
    expandedBands.value.push(bandId)
  }
}

const toggleAlbum = async (albumId: number, bandIndex: number, albumIndex: number) => {
  if (expandedAlbums.value.includes(albumId)) {
    expandedAlbums.value = expandedAlbums.value.filter(id => id !== albumId)
  } else {
    const album = await store.getAlbumById(albumId)
    emit('update:album', album, bandIndex, albumIndex)
    expandedAlbums.value.push(albumId)
  }
}

const matchWholeAlbum = (band: Band, album: Album) => {
  emit('match-album', band, album)
}

// watch(store.fileManagerSearchObject, async newValue => {
//   if (newValue.query) await performSearch(newValue.query)
// })
</script>

<template>
  <div class="h-full flex flex-col bg-gray-800">
    <!-- Заголовок и поиск -->
    <div class="p-4 border-b border-gray-700">
      <h2 class="text-lg font-bold text-white flex items-center">
        <Icon class="h-5 mr-2 text-red-400" icon="mdi:database" />
        База данных
      </h2>
    </div>

    <!-- Результаты поиска -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="isLoading" class="flex items-center justify-center h-32">
        <div class="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <template v-else>
        <div v-for="(band, index) in searchResults" :key="band.id" class="border-b border-gray-500 bg-gray-750 overflow-hidden">
          <!-- Заголовок группы -->
          <div class="p-3 cursor-pointer hover:bg-gray-700" @click="toggleBand(band.id, index)">
            <div class="flex items-center justify-between">
              <div class="flex gap-2">
                <img v-if="band.photo_url" class="w-20" :src="band.photo_url" />
                <img v-else-if="band.logo_url" class="w-20" :src="band.logo_url" />
                <div class="flex flex-col">
                  <router-link :to="`/bands/${band.name_slug}/${band.id}`" class="text-lg font-bold text-white" target="_blank" @click.stop>{{ band.name }}</router-link>
                  <p class="text-sm text-gray-400">{{ band.country }} • {{ band.genres }}</p>
                </div>
              </div>
              <Icon v-if="store.bandIsLoading" class="w-6 h-6 animate-spin" icon="mdi:loading" />
              <Icon v-else class="w-6 h-6" :icon="expandedBands.includes(band.id) ? 'mdi:chevron-up' : 'mdi:chevron-down'" />
            </div>
          </div>

          <!-- Альбомы -->
          <div v-if="expandedBands.includes(band.id)" class="grid grid-cols-1 md:grid-cols-3 gap-2 border-t border-gray-700">
            <div v-for="(album, albumIndex) in band.discography" :key="album.id" class="border-b border-gray-700 last:border-0">
              <!-- Заголовок альбома с кнопкой матчинга всего альбома -->
              <div class="p-1 bg-gray-900">
                <div class="flex flex-col justify-between">
                  <div class="flex items-center cursor-pointer" @click="toggleAlbum(album.id, index, albumIndex)">
                    <div v-if="album.cover_loading" class="w-20 h-20 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <img v-else class="w-20 h-20" :src="album.cover_url" />
                    <div class="flex flex-col ml-2">
                      <router-link :to="`/albums/${band.name_slug}/${album.title_slug}/${album.id}`" class="font-medium text-white" target="_blank" @click.stop>
                        {{ album.title }}
                      </router-link>
                      <span class="text-xs text-gray-500">{{ album.release_date }}</span>
                      <span class="text-xs text-gray-500">{{ album.type }}</span>
                    </div>
                    <div class="flex flex-1 items-center justify-end">
                      <Icon class="w-6 h-6" :icon="expandedAlbums.includes(album.id) ? 'mdi:chevron-up' : 'mdi:chevron-down'" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Треки -->
              <div v-if="expandedAlbums.includes(album.id)" class="flex flex-col bg-gray-900 p-2">
                <!-- Кнопка матчинга всего альбома -->
                <CustomButton text="Запомнить пути" thin @click="matchWholeAlbum(band, album)" />
                <div v-for="track in album.tracklist" :key="track.id" class="track-item flex items-center p-2 rounded-lg">
                  <span v-if="track.url" class="w-8 text-gray-500"><Icon icon="mdi:play" /></span>
                  <span class="w-8 text-xs text-gray-500">{{ track.number }}.</span>
                  <span class="flex items-center gap-2 flex-1 text-sm">
                    {{ track.title }}
                    <el-tooltip content="URL указан" placement="top">
                      <Icon v-if="track.url" icon="mdi:link" color="green" />
                    </el-tooltip>
                  </span>
                  <span class="text-xs text-gray-500 mr-3">{{ track.duration }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Пустой результат -->
        <el-result v-if="searchResults.length === 0 && !store.fileManagerBandsIsLoading" icon="warning" title="Нечего отображать" sub-title="Выберите группу в списке слева" />
        <LoadingSpinner v-if="store.fileManagerBandsIsLoading" :visible="store.fileManagerBandsIsLoading" />
      </template>
    </div>
  </div>
</template>
