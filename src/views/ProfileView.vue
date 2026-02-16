<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { EditPen } from '@element-plus/icons-vue'

import { useStore } from '@/store/store'

import BandCardMini from '../components/BandCardMini.vue'
import AlbumCardMini from '../components/AlbumCardMini.vue'
import Modal from '../components/Modal.vue'

import type { ShortBand, ShortAlbum, User } from '../types'
import { ElNotification } from 'element-plus'

const route = useRoute()
const router = useRouter()

const store = useStore()

const activeTab = ref('bands')
const userEditDialog = ref<boolean>(false)
const otherUser = ref<User>({
  username: '',
  real_name: null,
  country: null,
  gender: null,
  avatar_color: 'red',
  favorite_genre: null,
  favorite_bands: [],
  favorite_albums: [],
  role: 'user'
})
const predefineColors = ref(['#FF4D4D', '#FFB84D', '#FFE64D', '#4DFF4D', '#4DFFE6', '#4D4DFF', '#B84DFF'])

const user = computed(() => (route.params.username ? otherUser.value : store.user))
const tabs = computed(() => [
  { id: 'bands', label: 'Избранные группы', count: user.value.favorite_bands.length },
  { id: 'albums', label: 'Избранные альбомы', count: user.value.favorite_albums.length }
])

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })
}

const goToBand = (band: ShortBand) => {
  router.push(`/bands/${band.name_slug}/${band.id}`)
}

const goToAlbum = (album: ShortAlbum) => {
  router.push(`/albums/${album.band_names_slug[0]}/${album.title_slug}/${album.id}`)
}

const saveUser = async () => {
  await store.updateMe()
  userEditDialog.value = false
  ElNotification({
    type: 'success',
    message: 'Пользователь сохранён'
  })
}

const removeBandFromFavorite = async (index: number): Promise<void> => {
  store.user.favorite_bands.splice(index, 1)
  await store.updateMe()
}

const removeAlbumFromFavorite = async (index: number): Promise<void> => {
  store.user.favorite_albums.splice(index, 1)
  await store.updateMe()
}

onMounted(async () => {
  if (route.params.username) {
    otherUser.value = await store.getProfileByUsername(route.params.username)
  }
})
</script>

<template>
  <div class="space-y-6" v-if="user">
    <div class="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div class="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0">
        <div class="flex-shrink-0">
          <div
            class="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-700 overflow-hidden flex items-center justify-center"
            :style="{ backgroundColor: user.avatar_color }"
          >
            <span class="text-4xl">{{ user.username.slice(0, 2).toUpperCase() }}</span>
          </div>
        </div>

        <div class="md:ml-6 flex-1">
          <div class="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 class="text-3xl md:text-4xl font-bold">{{ user.username }}</h1>
              <span class="mb-2">Участник с {{ formatDate(user.created_at) }}</span>
              <div class="flex flex-col text-gray-400">
                <span v-if="user.gender">Пол: {{ user.gender }}</span>
                <span v-if="user.country">Страна: {{ user.country }}</span>
                <span v-if="user.favorite_genre">Любимый жанр: {{ user.favorite_genre }}</span>
              </div>
            </div>

            <button
              v-if="store.userIsAuth && !route.params.username"
              class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer"
              @click="userEditDialog = true"
            >
              <el-icon>
                <EditPen />
              </el-icon>
              <span>Редактировать</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div class="flex border-b border-gray-700">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex-1 py-2 px-2 text-center font-medium transition-colors duration-200 cursor-pointer"
          :class="activeTab === tab.id ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400 hover:text-gray-200'"
        >
          {{ tab.label }}
          <span class="ml-2 text-sm bg-gray-700 rounded-full px-2 py-0.5">{{ tab.count }}</span>
        </button>
      </div>

      <div class="p-6">
        <div v-if="activeTab === 'bands'" class="space-y-4">
          <div v-if="user.favorite_bands.length === 0" class="text-center py-8 text-gray-400">
            Нет добавленых избранных групп
          </div>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <BandCardMini
              v-for="(band, index) in user.favorite_bands"
              :key="band.id"
              :band="band"
              @click="goToBand(band)"
              @remove="removeBandFromFavorite(index)"
            />
          </div>
        </div>

        <div v-if="activeTab === 'albums'" class="space-y-4">
          <div v-if="user.favorite_albums.length === 0" class="text-center py-8 text-gray-400">
            Нет добавленых избранных альбомов
          </div>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <AlbumCardMini
              v-for="(album, index) in user.favorite_albums"
              :key="album.id"
              :album="album"
              @click="goToAlbum(album)"
              @remove="removeAlbumFromFavorite(index)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="!user && store.userIsLoading" class="flex items-center justify-center min-h-[60vh]">
    <div class="text-center">
      <div class="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p>Загрузка профиля {{ route.params.username }}</p>
    </div>
  </div>
  <div v-else class="flex items-center justify-center min-h-[60vh]">
    <div class="text-center">
      <p>Пользователь не найден</p>
    </div>
  </div>

  <modal :model-value="userEditDialog" title="Редактирование пользователя" @close="userEditDialog = false">
    <el-form ref="formRef" :model="user" label-width="auto">
      <el-form-item label="Имя пользователя" prop="username">
        <el-input v-model="user.username" readonly />
      </el-form-item>
      <el-form-item label="Реальное имя" prop="real_name">
        <el-input v-model="user.real_name" placeholder="Введите настоящее имя" />
      </el-form-item>
      <el-form-item label="Страна" prop="country">
        <el-select v-model="user.country" placeholder="Выберите страну">
          <el-option v-for="country in store.countryList" :label="country" :value="country" />
        </el-select>
      </el-form-item>
      <el-form-item label="Пол" prop="gender">
        <el-select v-model="user.gender" placeholder="Выберите пол">
          <el-option label="Мужской" value="Мужской" />
          <el-option label="Женский" value="Женский" />
        </el-select>
      </el-form-item>
      <el-form-item label="Любимый жанр" prop="favorite_genre">
        <el-input v-model="user.favorite_genre" placeholder="Введите любимый жанр" />
      </el-form-item>
      <el-form-item label="Цвет аватара" prop="avatar_color">
        <el-color-picker :predefine="predefineColors" v-model="user.avatar_color" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="danger" @click="userEditDialog = false">Закрыть</el-button>
      <el-button type="success" @click="saveUser">Сохранить</el-button>
    </template>
  </modal>
</template>
