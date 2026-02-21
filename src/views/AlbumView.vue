<script setup lang="ts">
import { ref, computed, onMounted, watch, inject } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import durationPlugin from 'dayjs/plugin/duration'
import { Star, StarFilled, EditPen } from '@element-plus/icons-vue'

import { useStore } from '@/store/store'
import { usePlayerStore } from '@/store/player'

import LoadingSpinner from '@/components/LoadingSpinner.vue'
import Modal from '@/components/Modal.vue'

import DateNormalizer from '@/utils/dateNormalizer'

import type { Track } from '@/types'
import { PlayerTrack } from '@/components/AudioPlayer.vue'
import { ElNotification } from 'element-plus'

dayjs.extend(durationPlugin)

const route = useRoute()

const store = useStore()
const playerStore = usePlayerStore()

const showPreview = ref(false)
const showEditDialog = ref(false)
const audioPlayer = inject('audioPlayer')

const album = computed(() => store.currentAlbum)
const albumId = computed(() => route.params.id)
const albumTotalDuration = computed((): string => {
  const totalSeconds = album.value?.tracklist.reduce((total, track) => {
    const [minutes, seconds] = track.duration.split(':').map(i => parseInt(i))
    return total + dayjs.duration({ minutes, seconds }).asSeconds()
  }, 0)

  return dayjs.duration(totalSeconds, 'seconds').format('HH:mm:ss')
})
const albumUserFavoriteIndex = computed((): number =>
  store.user.favorite_albums.findIndex(b => b.id === parseInt(albumId.value))
)

const albumTracks = computed<PlayerTrack[]>(() => {
  if (!album.value) return []

  return album.value.tracklist.map((track: Track) => ({
    id: `${album.value.id}-${track.number}`,
    title: track.title,
    artist: album.value.band_names_slug.join(', '),
    artistId: album.value.band_ids.join(),
    album: album.value.title,
    album_slug: album.value.title_slug,
    albumId: album.value.id,
    coverUrl: album.value.cover_url,
    duration: parseDuration(track.duration),
    audioUrl: track.url
  }))
})

const toggleFavoriteAlbum = async () => {
  if (albumUserFavoriteIndex.value > -1) store.user.favorite_albums.splice(albumUserFavoriteIndex.value, 1)
  else store.user.favorite_albums.push(store.currentAlbum)
  await store.updateMe()
}

const getBandById = async () => {
  const bandIndex = store.currentAlbum.band_names_slug.findIndex(name => name === route.params.bandName)
  const bandId = store.currentAlbum.band_ids[bandIndex]
  await store.getBandById(bandId)
}

const updateAlbum = async () => {
  await store.updateAlbum(albumId.value)
  ElNotification({
    type: 'success',
    message: 'Альбом обновлён'
  })
}

const isPlaying = computed(() => playerStore.isPlaying)

const isCurrentTrack = (track: any) => {
  return playerStore.currentTrack?.id === `${album.value?.id}-${track.number}`
}

const parseDuration = (duration: string): number => {
  const [minutes, seconds] = duration.split(':').map(Number)
  return minutes * 60 + seconds
}

const playTrack = (track: Track) => {
  const trackIndex = album.value.tracklist.findIndex((t: any) => t.number === track.number)
  const playerTrack = albumTracks.value[trackIndex]

  if (audioPlayer?.value) audioPlayer.value.playTrack(playerTrack, trackIndex)
}

const playAllTracks = () => {
  playerStore.setPlaylist(albumTracks.value, 0)

  if (audioPlayer?.value) {
    audioPlayer.value.playTrack(albumTracks.value[0], 0)
  }
}

const shuffleAllTracks = () => {
  const shuffled = [...albumTracks.value].sort(() => Math.random() - 0.5)
  playerStore.setPlaylist(shuffled, 0)

  if (audioPlayer?.value) {
    audioPlayer.value.playTrack(shuffled[0], 0)
  }
}

const addToPlaylist = (track: any) => {
  const trackIndex = album.value.tracklist.findIndex((t: any) => t.number === track.number)
  playerStore.addToPlaylist(albumTracks.value[trackIndex])
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
</script>

<template>
  <LoadingSpinner v-if="store.albumIsLoading" :visible="store.albumIsLoading" />
  <div class="space-y-6" v-else>
    <!-- Заголовок альбома -->
    <div class="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0">
      <div class="flex-0">
        <div
          class="w-40 h-40 md:w-60 md:h-60 bg-linear-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 flex items-center justify-center overflow-hidden cursor-pointer"
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
        <div>
          <h1 class="text-3xl md:text-4xl font-bold">
            {{ album.title }}
            <el-tooltip
              v-if="store.userIsAuth"
              :content="albumUserFavoriteIndex > -1 ? 'Убрать из любимых' : 'Добавить в любимые'"
              placement="top"
            >
              <el-button
                :icon="albumUserFavoriteIndex > -1 ? StarFilled : Star"
                circle
                text
                @click="toggleFavoriteAlbum"
              />
            </el-tooltip>
          </h1>
          <div class="mt-2 break-all">
            <template v-for="(b, i) in album.band_names" :key="b">
              <router-link
                :to="`/bands/${album.band_names_slug[i]}/${album.band_ids[i]}`"
                class="text-xl text-red-400 hover:text-red-300 transition-colors duration-150"
              >
                {{ album.band_names[i] }}
              </router-link>
              <span v-if="album.band_names.length && i < album.band_names.length - 1" class="mx-2">/</span>
            </template>
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
      <button
        v-if="store.userIsAdmin"
        class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center space-x-2 cursor-pointer"
        @click="showEditDialog = true"
      >
        <el-icon>
          <EditPen />
        </el-icon>
        <span>Редактировать</span>
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <!-- Треклист -->
        <div class="bg-gray-800 rounded-lg border border-gray-700 py-3 px-3">
          <h2 class="text-2xl font-bold mb-4 text-red-400">Треклист</h2>
          <div class="space-y-2">
            <div v-for="track in album.tracklist" :key="track.id">
              <div
                class="flex items-center justify-between p-1 hover:bg-gray-750 rounded transition-colors duration-150"
              >
                <div class="flex items-center space-x-2">
                  <button
                    v-if="track.url"
                    @click="playTrack(track)"
                    class="text-gray-400 hover:text-red-400 cursor-pointer"
                  >
                    <svg
                      v-if="isCurrentTrack(track) && isPlaying"
                      class="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                    <svg v-else class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7L8 5z" />
                    </svg>
                  </button>
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
                <span class="overflow-auto" v-html="track.lyrics" />
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
              @click="$router.push(`/albums/${route.params.bandName}/${otherAlbum.title_slug}/${otherAlbum.id}`)"
            >
              <div class="w-12 h-12 bg-gray-700 rounded flex shrink-0 items-center justify-center mr-3">
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

  <Modal :model-value="showEditDialog" title="Редактирование альбома" @close="showEditDialog = false">
    <el-form ref="formRef" :model="album" label-width="auto">
      <el-form-item label="Название альбома" prop="title">
        <el-input v-model="album.title" placeholder="Введите название альбома" />
      </el-form-item>
      <el-form-item label="Тип" prop="type">
        <el-select v-model="album.type" placeholder="Выберите тип">
          <el-option label="Full-length" value="Full-length" />
          <el-option label="EP" value="EP" />
          <el-option label="Single" value="Single" />
          <el-option label="Demo" value="Demo" />
          <el-option label="Live" value="Live" />
          <el-option label="Compilation" value="Compilation" />
        </el-select>
      </el-form-item>
      <el-form-item label="Дата релиза" prop="release_date">
        <el-input v-model="album.release_date" placeholder="Введите дату релиза" />
      </el-form-item>
      <el-form-item label="Лейбл" prop="label">
        <el-input v-model="album.label" placeholder="Введите лейбл" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="updateAlbum">Сохранить</el-button>
    </template>
  </Modal>
</template>
