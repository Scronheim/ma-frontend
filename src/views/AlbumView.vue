<template>
  <div class="space-y-6" v-if="album">
    <!-- Заголовок альбома -->
    <div class="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0">
      <div class="flex-shrink-0">
        <div
          class="w-40 h-40 md:w-60 md:h-60 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 flex items-center justify-center overflow-hidden"
        >
          <template v-if="album.cover_url">
            <img
              :src="album.cover_url"
              :alt="album.title"
              class="w-full h-full object-cover"
              @click="showPreview = true"
            />
            <el-image-viewer
              v-if="showPreview"
              :url-list="[album.cover_url]"
              hide-on-click-modal
              @close="showPreview = false"
            />
          </template>
          <span v-else class="text-5xl">💿</span>
        </div>
      </div>

      <div class="md:ml-6 flex-1">
        <div class="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold">{{ album.title }}</h1>
            <div class="mt-2">
              <template v-for="(b, i) in album.band_names" :key="b">
                <router-link
                  :to="`/band/${album.band_names[i]}/${album.band_ids[i]}`"
                  class="text-xl text-red-400 hover:text-red-300 transition-colors duration-150"
                >
                  {{ album.band_names[i] }}
                </router-link>
                <span v-if="album.band_names.length && i < album.band_names.length - 1" class="mx-2">/</span>
              </template>
            </div>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap gap-3">
          <div class="flex items-center space-x-2">
            <span class="text-gray-400">Тип:</span>
            <span class="px-3 py-1 bg-gray-800 rounded-full">{{ album.type }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-gray-400">Дата релиза:</span>
            <span class="px-3 py-1 bg-gray-800 rounded-full">{{ album.release_date }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-gray-400">Лейбл:</span>
            <span class="px-3 py-1 bg-gray-800 rounded-full">{{ album.label }}</span>
          </div>
        </div>
        <h3 class="text-gray-400 text-sm">Данные на {{ DateNormalizer.normalizeDate(album.updated_at) }}</h3>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <!-- Треклист -->
        <div class="bg-gray-800 rounded-lg border border-gray-700 py-3 px-3">
          <h2 class="text-2xl font-bold mb-4 text-red-400">Треклист</h2>
          <div class="space-y-2">
            <div v-for="track in album.tracklist" :key="track.number">
              <div
                class="flex items-center justify-between p-1 hover:bg-gray-750 rounded transition-colors duration-150"
              >
                <div class="flex items-center space-x-4">
                  <span class="text-gray-400 w-6 text-center">{{ track.number }}</span>
                  <span>{{ track.title }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <el-button
                    v-if="typeof track.id === 'number' && !track.lyrics"
                    type="primary"
                    text
                    size="small"
                    :loading="store.lyricsIsLoading"
                    @click="store.getLyricsById(track, album.id)"
                  >
                    Загрузить текст
                  </el-button>
                  <el-button
                    v-else-if="track.lyrics"
                    type="primary"
                    text
                    size="small"
                    @click="track.show_lyrics = !track.show_lyrics"
                  >
                    {{ track.show_lyrics ? 'Скрыть текст' : 'Показать текст' }}
                  </el-button>
                  <span v-else-if="typeof track.id === 'string'" class="text-gray-400 text-sm mr-3">
                    {{ track.id }}
                  </span>
                  <span class="text-gray-400">{{ track.duration }}</span>
                </div>
              </div>
              <div v-show="track.show_lyrics">
                <pre class="overflow-auto">{{ track.lyrics }}</pre>
              </div>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-700 text-gray-400">
            Полная длительность: {{ albumTotalDuration }}
          </div>
        </div>
      </div>

      <!-- Боковая панель -->
      <div class="space-y-6">
        <!-- Другие альбомы группы -->
        <div v-if="store.albumsExceptCurrent.length" class="bg-gray-800 rounded-lg border border-gray-700 py-3 px-3">
          <h2 class="text-xl font-bold mb-4 text-red-400">Другие альбомы группы</h2>
          <div class="space-y-3 grid grid-cols-2">
            <div
              v-for="otherAlbum in store.albumsExceptCurrent"
              :key="otherAlbum.id"
              class="flex items-center p-3 bg-gray-750 rounded hover:bg-gray-700 transition-colors duration-150 cursor-pointer"
              @click="$router.push(`/album/${route.params.bandName}/${otherAlbum.id}`)"
            >
              <div class="w-12 h-12 bg-gray-700 rounded flex-shrink-0 flex items-center justify-center mr-3">
                <img
                  v-if="otherAlbum.cover_url"
                  :src="otherAlbum.cover_url"
                  :alt="otherAlbum.title"
                  class="w-full h-full object-cover"
                />
                <span v-else>💿</span>
              </div>
              <div class="flex-col">
                <div class="font-medium">{{ otherAlbum.title }}</div>
                <div class="text-sm text-gray-400">{{ otherAlbum.type }}</div>
                <div class="text-sm text-gray-400">{{ otherAlbum.release_date }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="flex items-center justify-center min-h-[60vh]">
    <div class="text-center">
      <div class="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p>Информация об альбоме загружается...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import durationPlugin from 'dayjs/plugin/duration'

import { useStore } from '@/store/store'

import DateNormalizer from '@/utils/dateNormalizer'

dayjs.extend(durationPlugin)

const route = useRoute()
const store = useStore()

const showPreview = ref(false)

const album = computed(() => store.currentAlbum)
const albumId = computed(() => route.params.id)

const albumTotalDuration = computed((): string => {
  const totalSeconds = album.value?.tracklist.reduce((total, track) => {
    const [minutes, seconds] = track.duration.split(':').map(i => parseInt(i))
    return total + dayjs.duration({ minutes, seconds }).asSeconds()
  }, 0)

  return dayjs.duration(totalSeconds, 'seconds').format('HH:mm:ss')
})

const getBandById = async () => {
  const bandIndex = store.currentAlbum.band_names.findIndex(name => name === route.params.bandName)
  const bandId = store.currentAlbum.band_ids[bandIndex]
  await store.getBandById(bandId)
}

watch(
  albumId,
  async () => {
    await store.getAlbumById(route.params.id)
    if (!store.currentBand.id) await getBandById()
  },
  { deep: true }
)

onMounted(async () => {
  await store.getAlbumById(route.params.id)
  if (!store.currentBand.id) await getBandById()
})
// onUnmounted(() => {
//   store.currentAlbum.id = null
// })
</script>
