import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { defineStore } from 'pinia'
import axios from 'axios'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { ElNotification } from 'element-plus'

import { DEFAULT_BAND, DEFAULT_ALBUM, DEFAULT_BAND_MEMBER, DEFAULT_USER } from '@/utils/consts'

import type { Band, Album, Track, SSEResponse, AllStatInfo, Member, User, SimilarBand, ShortAlbum } from '@/types'

export const useStore = defineStore('store', () => {
  const router = useRouter()
  const breakpoints = useBreakpoints(breakpointsTailwind)

  const currentBand = ref<Band>(DEFAULT_BAND)
  const currentBandSimilar = ref<SimilarBand[]>([])
  const currentAlbum = ref<Album>(DEFAULT_ALBUM)
  const currentMember = ref<Member>(DEFAULT_BAND_MEMBER)
  const user = ref<User>(DEFAULT_USER)
  const token = ref('')
  const fileManagerSearchObject = ref({
    query: ''
  })
  const stats = ref<AllStatInfo>()
  const randomBandIsLoading = ref<boolean>(false)
  const bandIsLoading = ref<boolean>(false)
  const albumIsLoading = ref<boolean>(false)
  const lyricsIsLoading = ref<boolean>(false)
  const statsIsLoading = ref<boolean>(false)
  const memberIsLoading = ref<boolean>(false)
  const ripMembersIsLoading = ref<boolean>(false)
  const userIsLoading = ref<boolean>(false)
  const advancedSearchIsLoading = ref<boolean>(false)
  const similarBandsIsLoading = ref<boolean>(false)
  const fileManagerBandsIsLoading = ref<boolean>(false)
  const renameIsLoading = ref<boolean>(false)
  const addFolderIsLoading = ref<boolean>(false)
  const deleteFileOrFolderIsLoading = ref<boolean>(false)
  const filesIsUploading = ref<boolean>(false)
  const fromRandom = ref<boolean>(false)
  const sseEvents = ref<EventSource>()

  const albumsExceptCurrent = computed(() => currentBand.value.discography.filter(a => a.id !== currentAlbum.value.id))
  const userIsAuth = computed(() => token.value)
  const userIsAdmin = computed(() => user.value.role === 'admin')
  const isMobile = breakpoints.smaller('md')

  const advancedSongSearch = async (query: string) => {
    try {
      advancedSearchIsLoading.value = true
      const { data } = await axios.get(`/api/song/search/advanced?${query}`)
      return data
    } finally {
      advancedSearchIsLoading.value = false
    }
  }

  const advancedAlbumSearch = async (query: string) => {
    try {
      advancedSearchIsLoading.value = true
      const { data } = await axios.get(`/api/album/search/advanced?${query}`)
      return data
    } finally {
      advancedSearchIsLoading.value = false
    }
  }

  const advancedBandSearch = async (query: string) => {
    try {
      advancedSearchIsLoading.value = true
      const { data } = await axios.get(`/api/band/search/advanced?${query}`)
      return data
    } finally {
      advancedSearchIsLoading.value = false
    }
  }

  const getRandomBand = async () => {
    if (randomBandIsLoading.value) return
    try {
      randomBandIsLoading.value = true
      const { data } = await axios.get('/api/band/random')
      currentBand.value = data.data
      router.push({ path: `/bands/${data.data.name_slug}/${data.data.id}` })
      fromRandom.value = true
    } finally {
      randomBandIsLoading.value = false
    }
  }

  const getBandSimilar = async (showMore: boolean = false) => {
    if (similarBandsIsLoading.value) return
    try {
      similarBandsIsLoading.value = true
      const { data } = await axios.get(`/api/band/${currentBand.value.id}/similar?show_more=${showMore}`)
      currentBandSimilar.value = data.data
    } finally {
      similarBandsIsLoading.value = false
    }
  }

  const getBandById = async (bandId: string | number, updateBand: boolean = false) => {
    try {
      bandIsLoading.value = true
      let url = `/api/band/${bandId}`
      if (updateBand) url += '?update=true'
      const { data } = await axios.get(url)
      currentBand.value = data.data
      return data.data
    } finally {
      bandIsLoading.value = false
    }
  }

  const updateBand = async (bandId: string | number) => {
    try {
      bandIsLoading.value = true
      const { data } = await axios.patch(`/api/band/${bandId}`, currentBand.value)
      currentBand.value = data.data
    } finally {
      bandIsLoading.value = false
    }
  }

  const searchBand = async (query: string, onlyLocal: boolean = false) => {
    try {
      fileManagerBandsIsLoading.value = true
      const { data } = await axios.get(`/api/band/search?query=${query}&only_local=${onlyLocal}`)
      return data
    } finally {
      fileManagerBandsIsLoading.value = false
    }
  }

  const getBandByGenre = async (genre: string, page: number = 1) => {
    const { data } = await axios.get(`/api/band/search/genre/${genre}?page=${page}`)
    return data
  }

  const getBandByCountry = async (countryCode: string, page: number = 1) => {
    const { data } = await axios.get(`/api/band/search/country/${countryCode}?page=${page}`)
    return data
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
      return data.data
    } finally {
      albumIsLoading.value = false
    }
  }

  const updateAlbum = async (albumId: string | number, album: Album = currentAlbum.value) => {
    try {
      albumIsLoading.value = true
      const { data } = await axios.patch(`/api/album/${albumId}`, album)
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
      ripMembersIsLoading.value = true
      const { data } = await axios.get(`/api/artist/rip?page=${page}&year=${year}`)
      return data
    } finally {
      ripMembersIsLoading.value = false
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

  const rename = async (old_name: string, new_name: string, path: string = '') => {
    try {
      renameIsLoading.value = true
      await axios.put('/api/files/rename', { path, old_name, new_name })
    } finally {
      renameIsLoading.value = false
    }
  }

  const addFolder = async (folder_name: string, path: string = '') => {
    try {
      addFolderIsLoading.value = true
      await axios.post(`/api/files/folder?path=${path}`, { folder_name })
    } finally {
      addFolderIsLoading.value = false
    }
  }

  const deleteFileOrFolder = async (path: string = '') => {
    try {
      deleteFileOrFolderIsLoading.value = true
      await axios.delete(`/api/files/delete?path=${path}`)
    } finally {
      deleteFileOrFolderIsLoading.value = false
    }
  }

  const uploadFiles = async (files: File[], path: string = '') => {
    try {
      const payload = new FormData()
      payload.append('path', `${path}/`)
      files.forEach(file => {
        payload.append('files', file)
      })
      filesIsUploading.value = true
      await axios.post(`/api/files/upload`, payload)
    } finally {
      filesIsUploading.value = false
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
      case 'refresh_band':
        JSON.parse(data.data.old_albums).forEach((album: ShortAlbum, index: number) => {
          const albumTemp = currentBand.value.discography.find(a => a.id === album.id)
          if (albumTemp) albumTemp.cover_loading = false
        })
        currentBand.value.discography = currentBand.value.discography.concat(JSON.parse(data.data.new_albums))

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
    currentBandSimilar,
    currentAlbum,
    currentMember,
    user,
    fileManagerSearchObject,
    stats,
    bandIsLoading,
    randomBandIsLoading,
    albumIsLoading,
    lyricsIsLoading,
    statsIsLoading,
    memberIsLoading,
    ripMembersIsLoading,
    userIsLoading,
    similarBandsIsLoading,
    fileManagerBandsIsLoading,
    renameIsLoading,
    albumsExceptCurrent,
    sseEvents,
    fromRandom,
    isMobile,
    userIsAuth,
    userIsAdmin,
    searchBand,
    getRandomBand,
    getBandById,
    getBandByGenre,
    getBandByCountry,
    getBandByLetter,
    getAlbumById,
    getBandSimilar,
    updateBand,
    updateAlbum,
    getLyricsById,
    getMemberById,
    getRipMembers,
    getStats,
    advancedBandSearch,
    advancedAlbumSearch,
    advancedSongSearch,
    connectToEvents,
    login,
    logout,
    register,
    me,
    updateMe,
    getProfileByUsername,
    checkToken,
    rename,
    addFolder,
    deleteFileOrFolder,
    uploadFiles
  }
})
