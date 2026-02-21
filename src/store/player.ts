import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { PlayerTrack } from '../components/AudioPlayer.vue'

export const usePlayerStore = defineStore('player', () => {
  // Состояние
  const currentTrack = ref<PlayerTrack | null>(null)
  const playlist = ref<PlayerTrack[]>([])
  const trackIndex = ref(0)
  const isPlaying = ref(false)
  const volume = ref(1)
  const isMuted = ref(false)
  const repeatMode = ref<'none' | 'all' | 'one'>('none')
  const isShuffled = ref(false)

  // Геттеры
  const hasPrevious = computed(() => {
    if (isShuffled.value) return true
    return trackIndex.value > 0
  })

  const hasNext = computed(() => {
    if (isShuffled.value) return true
    return trackIndex.value < playlist.value.length - 1
  })

  const currentPlaylistTrack = computed(() => {
    return playlist.value[trackIndex.value]
  })

  // Методы
  function setCurrentTrack(track: PlayerTrack, index?: number) {
    currentTrack.value = track
    if (index !== undefined) {
      trackIndex.value = index
    }
  }

  function setPlaylist(tracks: PlayerTrack[], startIndex: number = 0) {
    playlist.value = tracks
    trackIndex.value = startIndex
    currentTrack.value = tracks[startIndex]
  }

  function addToPlaylist(track: PlayerTrack) {
    playlist.value.push(track)
  }

  function removeFromPlaylist(trackId: string) {
    const index = playlist.value.findIndex(t => t.id === trackId)
    if (index !== -1) {
      playlist.value.splice(index, 1)
      if (trackIndex.value === index) {
        // Если удаляем текущий трек, переключаемся на следующий
        if (playlist.value.length > 0) {
          trackIndex.value = Math.min(index, playlist.value.length - 1)
          currentTrack.value = playlist.value[trackIndex.value]
        } else {
          currentTrack.value = null
        }
      } else if (trackIndex.value > index) {
        trackIndex.value--
      }
    }
  }

  function clearPlaylist() {
    playlist.value = []
    currentTrack.value = null
    trackIndex.value = 0
  }

  function setPlaying(playing: boolean) {
    isPlaying.value = playing
  }

  function setVolume(newVolume: number) {
    volume.value = newVolume
  }

  function setMuted(muted: boolean) {
    isMuted.value = muted
  }

  function setRepeatMode(mode: 'none' | 'all' | 'one') {
    repeatMode.value = mode
  }

  function setShuffled(shuffled: boolean) {
    isShuffled.value = shuffled
  }

  function toggleRepeat() {
    const modes: ('none' | 'all' | 'one')[] = ['none', 'all', 'one']
    const currentIndex = modes.indexOf(repeatMode.value)
    const nextIndex = (currentIndex + 1) % modes.length
    repeatMode.value = modes[nextIndex]
  }

  function toggleShuffle() {
    isShuffled.value = !isShuffled.value
  }

  return {
    // Состояние
    currentTrack,
    playlist,
    trackIndex,
    isPlaying,
    volume,
    isMuted,
    repeatMode,
    isShuffled,

    // Геттеры
    hasPrevious,
    hasNext,
    currentPlaylistTrack,

    // Методы
    setCurrentTrack,
    setPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    clearPlaylist,
    setPlaying,
    setVolume,
    setMuted,
    setRepeatMode,
    setShuffled,
    toggleRepeat,
    toggleShuffle
  }
})
