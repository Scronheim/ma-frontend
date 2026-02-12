import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { defineStore } from 'pinia'
import axios from 'axios'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

import type { Band, Album, Track, SSEResponse, AllStatInfo } from '@/types'

export const useStore = defineStore('store', () => {
  const router = useRouter()
  const breakpoints = useBreakpoints(breakpointsTailwind)

  const currentBand = ref<Band>({
    description: '',
    discography: [],
    current_lineup: [],
    links: []
  })
  const currentAlbum = ref<Album>({
    tracklist: []
  })
  const stats = ref<AllStatInfo>()
  const bandIsLoading = ref<boolean>(false)
  const albumIsLoading = ref<boolean>(false)
  const lyricsIsLoading = ref<boolean>(false)
  const statsIsLoading = ref<boolean>(false)
  const sseEvents = ref<EventSource>()

  const albumsExceptCurrent = computed(() => currentBand.value.discography.filter(a => a.id !== currentAlbum.value.id))
  const isMobile = breakpoints.smaller('md')

  const getRandomBand = async () => {
    try {
      bandIsLoading.value = true
      const { data } = await axios.get('/api/band/random')
      currentBand.value = data.data
      router.push({ path: `/bands/${data.data.name_slug}/${data.data.id}`, query: { fromRandom: 'true' } })
    } finally {
      bandIsLoading.value = false
    }
  }

  const getBandById = async (bandId: string | number) => {
    try {
      bandIsLoading.value = true
      const { data } = await axios.get(`/api/band/${bandId}`)
      currentBand.value = data.data
    } finally {
      bandIsLoading.value = false
    }
  }

  const getAlbumById = async (albumId: string | number) => {
    try {
      albumIsLoading.value = true
      const { data } = await axios.get(`/api/album/${albumId}`)
      currentAlbum.value = data.data
    } finally {
      albumIsLoading.value = false
    }
  }

  const getLyricsById = async (track: Track, albumId: string | number) => {
    try {
      lyricsIsLoading.value = true
      const { data } = await axios.get(`/api/lyrics/?id=${track.id}&album_id=${albumId}`)
      track.lyrics = data.data
      track.show_lyrics = true
    } finally {
      lyricsIsLoading.value = false
    }
  }

  const getStats = async () => {
    try {
      statsIsLoading.value = true
      const { data } = await axios.get('/api/stats/')
      stats.value = data.data
    } finally {
      statsIsLoading.value = false
    }
  }

  const onEventsMessage = (event: MessageEvent) => {
    const data: SSEResponse = JSON.parse(event.data)

    switch (data.type) {
      case 'new_album':
        const album = currentBand.value.discography.find(a => a.id === parseInt(data.data.id))
        album.release_date = data.data.release_date
        album.cover_url = data.data.cover_url
        album.cover_loading = false
        break

      default:
        break
    }
  }

  const connectToEvents = async () => {
    try {
      sseEvents.value = new EventSource('/api/events/')
      sseEvents.value.onmessage = onEventsMessage
    } catch {
      sseEvents.value?.close()
    }
  }

  return {
    currentBand,
    currentAlbum,
    stats,
    bandIsLoading,
    lyricsIsLoading,
    statsIsLoading,
    albumsExceptCurrent,
    sseEvents,
    isMobile,
    getRandomBand,
    getBandById,
    getAlbumById,
    getLyricsById,
    getStats,
    connectToEvents
  }
})
