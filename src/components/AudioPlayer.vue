<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition transform duration-300 ease-out"
      enter-from-class="translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition transform duration-300 ease-in"
      leave-from-class="translate-y-0"
      leave-to-class="translate-y-full"
    >
      <div
        v-if="isVisible && currentTrack"
        class="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-600 shadow-2xl"
        :class="{ 'pb-safe': true }"
      >
        <div class="container mx-auto px-4 py-3">
          <div class="flex flex-col md:flex-row items-center gap-4">
            <!-- Информация о треке -->
            <div class="flex items-center space-x-4 w-full md:w-auto">
              <!-- Обложка -->
              <div
                class="w-12 h-12 bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden cursor-pointer"
                @click="goToCurrentAlbum"
              >
                <img
                  v-if="currentTrack.coverUrl"
                  :src="currentTrack.coverUrl"
                  :alt="currentTrack.title"
                  class="w-full h-full"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-2xl">🎵</div>
              </div>

              <!-- Название трека и группа -->
              <div class="min-w-0 flex-1">
                <h4 class="font-medium text-white truncate">{{ currentTrack.title }}</h4>
                <p class="text-sm text-gray-400 truncate">
                  <RouterLink :to="`/bands/${currentTrack.artist}/${currentTrack.artistId}`">
                    {{ currentTrack.artist }}
                  </RouterLink>
                  •
                  <RouterLink :to="`/albums/${currentTrack.artist}/${currentTrack.album_slug}/${currentTrack.albumId}`">
                    {{ currentTrack.album }}
                  </RouterLink>
                </p>
              </div>
            </div>

            <!-- Элементы управления -->
            <div class="flex items-center space-x-4 w-full md:w-auto justify-center">
              <!-- Кнопка предыдущего трека -->
              <button
                @click="playPrevious"
                class="text-gray-400 hover:text-white transition-colors duration-200"
                :disabled="!hasPrevious"
                :class="{ 'opacity-50 cursor-not-allowed': !hasPrevious }"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
                </svg>
              </button>

              <!-- Кнопка play/pause -->
              <button
                @click="togglePlay"
                class="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <svg v-if="isPlaying" class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
                <svg v-else class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7L8 5z" />
                </svg>
              </button>

              <!-- Кнопка следующего трека -->
              <button
                @click="playNext"
                class="text-gray-400 hover:text-white transition-colors duration-200"
                :disabled="!hasNext"
                :class="{ 'opacity-50 cursor-not-allowed': !hasNext }"
              >
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
                <div
                  class="w-full h-1 bg-gray-700 rounded-full cursor-pointer"
                  @click="seekToPosition"
                  ref="progressBar"
                >
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
            <div class="flex">
              <!-- Прогресс-бар -->
              <div class="mb-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  :value="volume"
                  @input="changeVolume"
                  class="w-24 h-1 bg-gray-700 bg-gradient-to-r from-red-600 to-red-600 bg-no-repeat rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            <!-- Дополнительные элементы управления -->
            <div class="flex items-center space-x-3">
              <!-- Кнопка повтора -->
              <button
                @click="toggleRepeat"
                class="text-gray-400 hover:text-white transition-colors duration-200"
                :class="{ 'text-red-400': repeatMode !== 'none' }"
              >
                <svg v-if="repeatMode === 'one'" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
                <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
                </svg>
              </button>

              <!-- Кнопка перемешивания -->
              <button
                @click="toggleShuffle"
                class="text-gray-400 hover:text-white transition-colors duration-200"
                :class="{ 'text-red-400': isShuffled }"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm0 9.41l-1.41 1.41 2.55 2.55L14.5 20H20v-5.5l-2.04 2.04-3.46-3.45z"
                  />
                </svg>
              </button>

              <!-- Кнопка закрытия плеера -->
              <button
                @click="closePlayer"
                title="Закрыть плеер"
                class="text-gray-400 hover:text-white transition-colors duration-200 ml-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
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

export interface PlayerTrack {
  id: string
  title: string
  title_slug: string
  artist: string
  artistId: number
  album: string
  album_slug: string
  albumId: string
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
const audioElement = ref<HTMLAudioElement | null>(null)
const progressBar = ref<HTMLDivElement | null>(null)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const isMuted = ref(false)
const isDragging = ref(false)
const repeatMode = ref<'none' | 'all' | 'one'>('none')
const isShuffled = ref(false)

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

// Проверка наличия предыдущего/следующего трека
const hasPrevious = computed(() => {
  if (isShuffled.value) return true
  return trackIndex.value > 0
})

const hasNext = computed(() => {
  if (isShuffled.value) return true
  return trackIndex.value < playlistTracks.value.length - 1
})

// Форматирование времени
const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Обновление фона ползунка громкости
const updateVolumeBackground = (event: Event) => {
  const input = event.target as HTMLInputElement
  const value =
    ((parseFloat(input.value) - parseFloat(input.min)) / (parseFloat(input.max) - parseFloat(input.min))) * 100
  input.style.backgroundSize = `${value}% 100%`
}

// Инициализация аудио элемента
onMounted(() => {
  audioElement.value = new Audio()

  audioElement.value.addEventListener('timeupdate', updateTime)
  audioElement.value.addEventListener('loadedmetadata', updateDuration)
  audioElement.value.addEventListener('ended', handleTrackEnd)
  audioElement.value.addEventListener('play', () => {
    playerStore.isPlaying = true
  })
  audioElement.value.addEventListener('pause', () => {
    playerStore.isPlaying = false
  })
  audioElement.value.addEventListener('volumechange', () => {
    isMuted.value = audioElement.value?.muted || false
  })
})

onUnmounted(() => {
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value.removeEventListener('timeupdate', updateTime)
    audioElement.value.removeEventListener('loadedmetadata', updateDuration)
    audioElement.value.removeEventListener('ended', handleTrackEnd)
  }
})

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

const playTrack = (track: PlayerTrack, index: number) => {
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

  updateVolumeBackground(event)
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
  currentTrack.value = null
  emit('close')
}

// Переход к альбому
const goToCurrentAlbum = () => {
  if (currentTrack.value) {
    router.push(`/albums/${currentTrack.value.artist}/${currentTrack.value.album_slug}/${currentTrack.value.albumId}`)
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
}

// Добавляем обработчики для перетаскивания
onMounted(() => {
  document.addEventListener('mouseup', stopDrag)
})

onUnmounted(() => {
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
  currentTrack
})
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0);
}

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

.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, 10px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}
</style>
