import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { defineStore } from 'pinia'
import axios from 'axios'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { ElNotification } from 'element-plus'

import { DEFAULT_BAND, DEFAULT_ALBUM, DEFAULT_BAND_MEMBER, DEFAULT_USER } from '@/utils/consts'
import countriesArray from '@/utils/countries'
import { countries } from '@/utils'

import type { Band, Album, Track, SSEResponse, AllStatInfo, Member, User } from '@/types'

export const useStore = defineStore('store', () => {
  const router = useRouter()
  const breakpoints = useBreakpoints(breakpointsTailwind)

  const currentBand = ref<Band>(DEFAULT_BAND)
  const currentAlbum = ref<Album>(DEFAULT_ALBUM)
  const currentMember = ref<Member>(DEFAULT_BAND_MEMBER)
  const user = ref<User>(DEFAULT_USER)
  const countryList = ref(countriesArray)
  const token = ref('')
  const stats = ref<AllStatInfo>()
  const bandIsLoading = ref<boolean>(false)
  const albumIsLoading = ref<boolean>(false)
  const lyricsIsLoading = ref<boolean>(false)
  const statsIsLoading = ref<boolean>(false)
  const memberIsLoading = ref<boolean>(false)
  const userIsLoading = ref<boolean>(false)
  const fromRandom = ref<boolean>(false)
  const sseEvents = ref<EventSource>()

  const albumsExceptCurrent = computed(() => currentBand.value.discography.filter(a => a.id !== currentAlbum.value.id))
  const userIsAuth = computed(() => token.value)
  const userIsAdmin = computed(() => user.value.role === 'admin')
  const countryListForSelect = computed(() => {
    return countries.flatMap(c => {
      return { title: c.name, value: c.name }
    })
  })
  const isMobile = breakpoints.smaller('md')

  const getRandomBand = async () => {
    try {
      bandIsLoading.value = true
      const { data } = await axios.get('/api/band/random')
      currentBand.value = data.data
      router.push({ path: `/bands/${data.data.name_slug}/${data.data.id}` })
      fromRandom.value = true
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

  const getBandByLetter = async (letter: string, page: number = 1) => {
    const { data } = await axios.get(`/api/band/search/letter/${letter}?page=${page}`)
    return data
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

  const updateAlbum = async (albumId: string | number) => {
    try {
      albumIsLoading.value = true
      const { data } = await axios.patch(`/api/album/${albumId}`, currentAlbum.value)
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

  const getMemberById = async (artistId: string | number) => {
    try {
      memberIsLoading.value = true
      const { data } = await axios.get(`/api/artist/${artistId}`)
      currentMember.value = data.data
    } finally {
      memberIsLoading.value = false
    }
  }

  const getRipMembers = async (page: number = 1, year: number) => {
    try {
      memberIsLoading.value = true
      const { data } = await axios.get(`/api/artist/rip?page=${page}&year=${year}`)
      return data
    } finally {
      memberIsLoading.value = false
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
    if (!currentBand.value.discography.length) return
    const data: SSEResponse = JSON.parse(event.data)
    let album: Album | undefined
    switch (data.type) {
      case 'new_album':
        album = currentBand.value.discography.find(a => a.id === parseInt(data.data.id))
        if (album) {
          album.release_date = data.data.release_date
          album.cover_url = data.data.cover_url
          album.cover_loading = false
        }
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

  const logout = () => {
    router.push('/')
    token.value = ''
    user.value = DEFAULT_USER
    localStorage.removeItem('token')
  }

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const { data } = await axios.post('/api/auth/login', { username, password })
      user.value = data.user
      token.value = data.token
      localStorage.setItem('token', data.token)
      axios.defaults.headers['Authorization'] = data.token
      ElNotification({
        type: 'success',
        message: 'Вы успешно авторизовались'
      })
      router.push('/')
    } catch (e) {
      console.log(e)
    }
  }

  const register = async (username: string, password: string): Promise<void> => {
    try {
      const { data } = await axios.post('/api/auth/register', { username, password })
      user.value = data.user
      token.value = data.token
      localStorage.setItem('token', data.token)
      axios.defaults.headers['Authorization'] = data.token
      ElNotification({
        type: 'success',
        message: 'Вы успешно зарегистрировались'
      })
      router.push('/')
    } catch (e) {
      console.log(e)
    }
  }

  const me = async (): Promise<void> => {
    try {
      const { data } = await axios.get('/api/auth/me')
      user.value = data
    } catch (e) {
      if (e.response.status === 404) {
        localStorage.removeItem('token')
        token.value = ''
      }
    }
  }

  const updateMe = async (): Promise<void> => {
    try {
      const localUser = {
        ...user.value,
        favorite_bands: user.value.favorite_bands.flatMap(b => b.id),
        favorite_albums: user.value.favorite_albums.flatMap(a => a.id)
      }
      const { data } = await axios.patch('/api/auth/me/update', localUser)
      user.value = data
    } catch (e) {
      console.log(e)
    }
  }

  const getProfileByUsername = async (username: string): Promise<User | null> => {
    try {
      userIsLoading.value = true
      const { data } = await axios.get(`/api/auth/profile/${username}`)
      return data
    } catch (e) {
      console.log(e)
      return null
    } finally {
      userIsLoading.value = false
    }
  }

  const checkToken = async (): Promise<string | null> => {
    const tokenFromLocalStorage = localStorage.getItem('token')
    if (tokenFromLocalStorage) {
      axios.defaults.headers['Authorization'] = tokenFromLocalStorage
      token.value = tokenFromLocalStorage
      await me()
    }
    return null
  }

  return {
    currentBand,
    currentAlbum,
    currentMember,
    user,
    stats,
    countryList,
    countryListForSelect,
    bandIsLoading,
    albumIsLoading,
    lyricsIsLoading,
    statsIsLoading,
    memberIsLoading,
    userIsLoading,
    albumsExceptCurrent,
    sseEvents,
    fromRandom,
    isMobile,
    userIsAuth,
    userIsAdmin,
    getRandomBand,
    getBandById,
    getBandByLetter,
    getAlbumById,
    updateAlbum,
    getLyricsById,
    getMemberById,
    getRipMembers,
    getStats,
    connectToEvents,
    login,
    logout,
    register,
    me,
    updateMe,
    getProfileByUsername,
    checkToken
  }
})
