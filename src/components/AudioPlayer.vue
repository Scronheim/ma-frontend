<template>
  <Teleport to="body">
    <!-- Панель плейлиста (справа) -->
    <Transition
      enter-active-class="transition transform duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition transform duration-300 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="isPlaylistVisible"
        class="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[500px] bg-gray-800 border-l border-gray-600 shadow-2xl overflow-hidden"
        :class="{ 'with-player': isVisible && currentTrack }"
        :style="{
          top: '59px', // Высота верхнего меню
          bottom: isVisible && currentTrack ? '73px' : '0' // 80px - высота плеера
        }"
      >
        <div class="h-full flex flex-col">
          <!-- Заголовок плейлиста -->
          <div class="flex items-center justify-between px-4 py-2 border-b border-gray-700">
            <div class="flex items-center gap-2">
              <h3 class="text-lg font-semibold text-white">Плейлист</h3>
              <span class="text-xs text-gray-400 cursor-pointer" @click="playerStore.clearPlaylist">Очистить</span>
            </div>
            <button @click="togglePlaylist" class="text-gray-400 hover:text-white hover:bg-gray-800 cursor-pointer">
              <Icon icon="mdi:close" class="w-5 h-5" />
            </button>
          </div>

          <!-- Поиск по плейлисту -->
          <div class="p-4 border-b border-gray-700">
            <TextInput placeholder="Введите название трека" :model-value="searchQuery" @update:model-value="searchQuery = $event" />
          </div>

          <!-- Список треков -->
          <div class="flex-1 overflow-y-auto">
            <div
              v-for="(track, index) in filteredPlaylist"
              :key="track.id"
              @click="selectTrackFromPlaylist(index)"
              class="flex items-center space-x-3 px-3 py-2 border-b border-gray-800 cursor-pointer"
              :class="[trackIndex === getOriginalIndex(index) && currentTrack?.id === track.id ? 'bg-gray-900' : 'bg-gray-800']"
            >
              <div class="w-2 text-xs text-gray-400">{{ index + 1 }}</div>
              <!-- Обложка -->
              <div class="w-12 h-12 bg-gray-800 rounded flex-shrink-0 overflow-hidden">
                <img v-if="track.coverUrl" :src="track.coverUrl" :alt="track.title" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-2xl">🎵</div>
              </div>

              <!-- Информация о треке -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2">
                  <h4 class="text-sm font-medium text-white truncate">{{ track.title }}</h4>
                </div>
                <p class="text-xs text-gray-400 truncate">{{ track.artist }} • {{ track.album }}</p>
              </div>

              <!-- Длительность -->
              <div class="flex items-center space-x-2">
                <span class="text-xs text-gray-400">{{ formatTime(track.duration) }}</span>
                <button class="cursor-pointer" @click.stop="removeFromPlaylist(track)">
                  <Icon class="w-5 h-5 text-red-500" icon="mdi:close" />
                </button>
              </div>
            </div>

            <!-- Пустой плейлист -->
            <div v-if="filteredPlaylist.length === 0" class="flex flex-col items-center justify-center py-12 text-gray-400">
              <svg class="w-20 h-20 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
              <p class="text-lg">Плейлист пуст</p>
              <p class="text-sm text-gray-500 mt-2">Добавьте треки для воспроизведения</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Основной плеер -->
    <Transition
      enter-active-class="transition transform duration-300 ease-out"
      enter-from-class="translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition transform duration-300 ease-in"
      leave-from-class="translate-y-0"
      leave-to-class="translate-y-full"
    >
      <div v-if="isVisible && currentTrack" class="fixed bottom-0 left-0 right-0 z-40 bg-gray-800 border-t border-gray-600 shadow-2xl" :class="{ 'pb-safe': true }">
        <div class="container mx-auto px-4 py-3">
          <div class="flex flex-col md:flex-row items-center gap-4">
            <!-- Информация о треке -->
            <div class="flex items-center space-x-4 w-full md:w-auto">
              <!-- Обложка -->
              <div class="w-12 h-12 bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden cursor-pointer" @click="goToCurrentAlbum">
                <img v-if="currentTrack.coverUrl" :src="currentTrack.coverUrl" :alt="currentTrack.title" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-2xl">🎵</div>
              </div>

              <!-- Название трека и группа -->
              <div class="min-w-0 flex-1">
                <h4 class="font-medium text-white truncate">{{ currentTrack.title }}</h4>
                <p class="text-sm text-gray-400 truncate">
                  <RouterLink :to="`/bands/${currentTrack.artist_slug}/${currentTrack.artistId}`" class="hover:text-white">
                    {{ currentTrack.artist }}
                  </RouterLink>
                  •
                  <RouterLink :to="`/albums/${currentTrack.artist_slug}/${currentTrack.album_slug}/${currentTrack.albumId}`" class="hover:text-white">
                    {{ currentTrack.album }}
                  </RouterLink>
                </p>
              </div>
            </div>

            <!-- Элементы управления -->
            <div class="flex items-center space-x-4 w-full md:w-auto justify-center">
              <!-- Кнопка предыдущего трека -->
              <button @click="playPrevious" class="text-gray-400 hover:text-white" :disabled="!hasPrevious" :class="{ 'opacity-50 cursor-not-allowed': !hasPrevious }">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
                </svg>
              </button>

              <!-- Кнопка play/pause -->
              <button @click="togglePlay" class="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center">
                <svg v-if="isPlaying" class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
                <svg v-else class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7L8 5z" />
                </svg>
              </button>

              <!-- Кнопка следующего трека -->
              <button @click="playNext" class="text-gray-400 hover:text-white" :disabled="!hasNext" :class="{ 'opacity-50 cursor-not-allowed': !hasNext }">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 6L18 18 16 18 16 6 18 6z" />
                  <path d="M6 18L6 6 16 12 6 18z" />
                </svg>
              </button>
            </div>

            <!-- Прогресс и время -->
            <div class="flex items-center space-x-3 w-full md:flex-1">
              <span class="text-xs text-gray-400 w-10 text-right">{{ formatTime(currentTime) }}</span>

              <div class="flex-1 relative group">
                <!-- Прогресс-бар -->
                <div class="w-full h-1 bg-gray-700 rounded-full cursor-pointer" @click="seekToPosition" ref="progressBar">
                  <div class="h-full bg-red-600 rounded-full relative" :style="{ width: `${progressPercentage}%` }">
                    <!-- Ползунок -->
                    <div
                      class="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      :class="{ 'opacity-100': isDragging }"
                    ></div>
                  </div>
                </div>
              </div>

              <span class="text-xs text-gray-400 w-10">{{ formatTime(duration) }}</span>
            </div>

            <!-- Дополнительные элементы управления -->
            <div class="flex items-center space-x-3">
              <!-- Кнопка громкости -->
              <div class="flex items-center space-x-2">
                <button @click="toggleMute" class="text-gray-400 hover:text-white">
                  <svg v-if="isMuted || volume === 0" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
                    />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
                    />
                  </svg>
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  :value="volume"
                  @input="changeVolume"
                  class="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  :style="{ background: `linear-gradient(to right, #dc2626 ${volume * 100}%, #374151 ${volume * 100}%)` }"
                />
              </div>

              <!-- Кнопка повтора -->
              <button @click="toggleRepeat" class="text-gray-400 hover:text-white" :class="{ 'text-red-400': repeatMode !== 'none' }">
                <svg v-if="repeatMode === 'one'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
                <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
                </svg>
              </button>

              <!-- Кнопка перемешивания -->
              <button @click="toggleShuffle" class="text-gray-400 hover:text-white" :class="{ 'text-red-400': isShuffled }">
                <Icon icon="mdi:shuffle" class="w-5 h-5" />
              </button>

              <!-- Кнопка показа плейлиста -->
              <button
                id="playlistButton"
                @click.stop="togglePlaylist"
                class="text-gray-400 hover:text-white relative"
                :class="{ 'text-red-400': isPlaylistVisible }"
                title="Показать плейлист"
              >
                <Icon icon="mdi:playlist-music" class="w-5 h-5" />
                <!-- Бейдж с количеством треков -->
                <span
                  v-if="playlistTracks.length > 0"
                  class="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
                >
                  {{ playlistTracks.length }}
                </span>
              </button>

              <!-- Кнопка закрытия плеера -->
              <button @click="closePlayer" title="Закрыть плеер" class="text-gray-400 hover:text-white ml-2">
                <Icon icon="mdi:close" class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

import { usePlayerStore } from '@/store/player'
import { Icon } from '@iconify/vue'
import TextInput from './inputs/TextInput.vue'

export interface PlayerTrack {
  id: string
  title: string
  number: number
  artist: string
  artist_slug: string
  artistId: number
  album: string
  album_slug: string
  albumId: number
  coverUrl?: string
  duration: number
  audioUrl: string
}

const props = defineProps<{
  playlist?: PlayerTrack[]
  currentTrackIndex?: number
  autoplay?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:currentTrackIndex', index: number): void
  (e: 'close'): void
  (e: 'trackChange', track: PlayerTrack): void
}>()

const router = useRouter()
const playerStore = usePlayerStore()

// Состояние плеера
const isVisible = ref(false)
const isPlaylistVisible = ref(false)
const audioElement = ref<HTMLAudioElement | null>(null)
const progressBar = ref<HTMLDivElement | null>(null)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const isMuted = ref(false)
const isDragging = ref(false)
const repeatMode = ref<'none' | 'all' | 'one'>('none')
const isShuffled = ref(false)
const searchQuery = ref('')

// Текущий трек
const currentTrack = ref<PlayerTrack | null>(null)

// Плейлист
const playlistTracks = ref<PlayerTrack[]>([])

// Индекс текущего трека в плейлисте
const trackIndex = ref(0)

const isPlaying = computed(() => playerStore.isPlaying)
const progressPercentage = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

// Фильтрованный плейлист по поиску
const filteredPlaylist = computed(() => {
  if (!searchQuery.value) return playlistTracks.value

  const query = searchQuery.value.toLowerCase()
  return playlistTracks.value.filter(track => track.title.toLowerCase().includes(query) || track.artist.toLowerCase().includes(query) || track.album.toLowerCase().includes(query))
})

// Проверка наличия предыдущего/следующего трека
const hasPrevious = computed(() => {
  if (isShuffled.value) return true
  return trackIndex.value > 0
})

const hasNext = computed(() => {
  if (isShuffled.value) return true
  return trackIndex.value < playlistTracks.value.length - 1
})

const removeFromPlaylist = (track: PlayerTrack) => {
  playerStore.removeFromPlaylist(`${track.albumId}-${track.number}`)
}

// Форматирование времени
const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Получение оригинального индекса из отфильтрованного
const getOriginalIndex = (filteredIndex: number): number => {
  const track = filteredPlaylist.value[filteredIndex]
  return playlistTracks.value.findIndex(t => t.id === track.id)
}

// Выбор трека из плейлиста
const selectTrackFromPlaylist = (filteredIndex: number) => {
  const originalIndex = getOriginalIndex(filteredIndex)
  if (currentTrack.value?.id && trackIndex.value === originalIndex) {
    togglePlay()
  } else {
    playTrack(playlistTracks.value[originalIndex], originalIndex)
  }
}

// Переключение видимости плейлиста
const togglePlaylist = () => {
  isPlaylistVisible.value = !isPlaylistVisible.value
  if (!isPlaylistVisible.value) {
    searchQuery.value = ''
  }
}

// Закрытие плейлиста при клике вне его области
const handleClickOutside = (event: MouseEvent) => {
  const playlist = document.querySelector('.fixed.top-0.right-0.bottom-0')
  if (playlist && !playlist.contains(event.target as Node) && isPlaylistVisible.value) {
    isPlaylistVisible.value = false
    searchQuery.value = ''
  }
}

// Обновление времени
const updateTime = () => {
  if (audioElement.value && !isDragging.value) {
    currentTime.value = audioElement.value.currentTime
  }
}

const updateDuration = () => {
  if (audioElement.value) {
    duration.value = audioElement.value.duration
  }
}

// Управление воспроизведением
const togglePlay = () => {
  if (!audioElement.value || !currentTrack.value) return

  if (isPlaying.value) {
    audioElement.value.pause()
  } else {
    audioElement.value.play()
  }
}

// Просто проигрывает трек, без добавления в плейлист
const playTrack = (track: PlayerTrack, index: number) => {
  console.log(track)

  currentTrack.value = track
  trackIndex.value = index
  isVisible.value = true

  if (audioElement.value) {
    audioElement.value.src = track.audioUrl
    audioElement.value.load()
    audioElement.value.play()
  }

  emit('trackChange', track)
}

const playPrevious = () => {
  if (playlistTracks.value.length === 0) return

  if (isShuffled.value) {
    // Случайный трек
    const randomIndex = Math.floor(Math.random() * playlistTracks.value.length)
    playTrack(playlistTracks.value[randomIndex], randomIndex)
  } else if (trackIndex.value > 0) {
    playTrack(playlistTracks.value[trackIndex.value - 1], trackIndex.value - 1)
  } else if (repeatMode.value === 'all') {
    // Переход к последнему треку
    const lastIndex = playlistTracks.value.length - 1
    playTrack(playlistTracks.value[lastIndex], lastIndex)
  }
}

const playNext = () => {
  if (playlistTracks.value.length === 0) return

  if (repeatMode.value === 'one') {
    // Повтор текущего трека
    if (audioElement.value) {
      audioElement.value.currentTime = 0
      audioElement.value.play()
    }
  } else if (isShuffled.value) {
    // Случайный трек
    const randomIndex = Math.floor(Math.random() * playlistTracks.value.length)
    playTrack(playlistTracks.value[randomIndex], randomIndex)
  } else if (trackIndex.value < playlistTracks.value.length - 1) {
    playTrack(playlistTracks.value[trackIndex.value + 1], trackIndex.value + 1)
  } else if (repeatMode.value === 'all') {
    // Возврат к первому треку
    playTrack(playlistTracks.value[0], 0)
  } else {
    // Остановка воспроизведения
    if (audioElement.value) {
      audioElement.value.pause()
      audioElement.value.currentTime = 0
    }
    isVisible.value = false
  }
}

const pause = () => {
  audioElement.value?.pause()
}

const handleTrackEnd = () => {
  playNext()
}

// Перемотка
const seekToPosition = (event: MouseEvent) => {
  if (!progressBar.value || !audioElement.value || !currentTrack.value) return

  const rect = progressBar.value.getBoundingClientRect()
  const clickPosition = (event.clientX - rect.left) / rect.width
  const newTime = clickPosition * duration.value

  audioElement.value.currentTime = newTime
  currentTime.value = newTime
}

// Управление громкостью
const changeVolume = (event: Event) => {
  const input = event.target as HTMLInputElement
  const newVolume = parseFloat(input.value)
  volume.value = newVolume

  if (audioElement.value) {
    audioElement.value.volume = newVolume
    audioElement.value.muted = false
  }
}

const toggleMute = () => {
  if (audioElement.value) {
    audioElement.value.muted = !audioElement.value.muted
  }
}

// Режимы повтора
const toggleRepeat = () => {
  const modes: ('none' | 'all' | 'one')[] = ['none', 'all', 'one']
  const currentIndex = modes.indexOf(repeatMode.value)
  const nextIndex = (currentIndex + 1) % modes.length
  repeatMode.value = modes[nextIndex]
}

const toggleShuffle = () => {
  isShuffled.value = !isShuffled.value
}

// Закрытие плеера
const closePlayer = () => {
  if (audioElement.value) {
    audioElement.value.pause()
  }
  isVisible.value = false
  isPlaylistVisible.value = false
  currentTrack.value = null
  emit('close')
}

// Переход к альбому
const goToCurrentAlbum = () => {
  if (currentTrack.value) {
    router.push(`/albums/${currentTrack.value.artist_slug}/${currentTrack.value.album_slug}/${currentTrack.value.albumId}`)
  }
}

// Обновление плейлиста
watch(
  () => props.playlist,
  newPlaylist => {
    if (newPlaylist) {
      playlistTracks.value = newPlaylist
    }
  },
  { immediate: true }
)

watch(
  () => props.currentTrackIndex,
  newIndex => {
    if (newIndex !== undefined && playlistTracks.value[newIndex]) {
      playTrack(playlistTracks.value[newIndex], newIndex)
    }
  },
  { immediate: true }
)

watch(
  () => props.autoplay,
  autoplay => {
    if (autoplay && currentTrack.value && audioElement.value) {
      audioElement.value.play()
    }
  }
)

// Отслеживание перетаскивания ползунка
const startDrag = () => {
  isDragging.value = true
}

const stopDrag = () => {
  isDragging.value = false
} // Инициализация аудио элемента
onMounted(() => {
  audioElement.value = new Audio()

  audioElement.value.addEventListener('timeupdate', updateTime)
  audioElement.value.addEventListener('loadedmetadata', updateDuration)
  audioElement.value.addEventListener('ended', handleTrackEnd)
  audioElement.value.addEventListener('play', () => (playerStore.isPlaying = true))
  audioElement.value.addEventListener('pause', () => (playerStore.isPlaying = false))
  audioElement.value.addEventListener('volumechange', () => (isMuted.value = audioElement.value?.muted || false))
  document.addEventListener('mouseup', stopDrag)

  // document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value.removeEventListener('timeupdate', updateTime)
    audioElement.value.removeEventListener('loadedmetadata', updateDuration)
    audioElement.value.removeEventListener('ended', handleTrackEnd)
  }
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('mouseup', stopDrag)
})

// Экспортируем методы для использования в других компонентах
defineExpose({
  playTrack,
  playPrevious,
  playNext,
  pause,
  togglePlay,
  isVisible,
  currentTrack,
  trackIndex,
  togglePlaylist
})
</script>

<style scoped>
input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin-top: -4px;
}

input[type='range']::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: none;
}

input[type='range']::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  background: #374151;
  border-radius: 2px;
}

input[type='range']::-moz-range-track {
  width: 100%;
  height: 4px;
  background: #374151;
  border-radius: 2px;
}
</style>
