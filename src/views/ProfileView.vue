<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { EditPen } from '@element-plus/icons-vue'

import { useStore } from '@/store/store'

import BandCardMini from '../components/BandCardMini.vue'
import AlbumCardMini from '../components/AlbumCardMini.vue'
import ConfirmModal from '../components/Modal.vue'

import type { ShortBand, ShortAlbum, User } from '../types'

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
  favorite_bands: [],
  favorite_albums: [],
  role: 'user'
})

const user = computed(() => (route.params.username ? otherUser.value : store.user))
const tabs = computed(() => [
  { id: 'bands', label: 'Любимые группы', count: user.value.favorite_bands.length },
  { id: 'albums', label: 'Любимые альбомы', count: user.value.favorite_albums.length }
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
            class="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full border-4 border-gray-700 overflow-hidden flex items-center justify-center"
          >
            <span class="text-4xl">{{ store.user.username.slice(0, 2).toUpperCase() }}</span>
          </div>
        </div>

        <div class="md:ml-6 flex-1">
          <div class="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 class="text-3xl md:text-4xl font-bold">{{ user.username }}</h1>
              <div class="flex items-center mt-2 text-gray-400">
                <span>Участник с {{ formatDate(user.created_at) }}</span>
                <span v-if="user.country" class="mx-2">• {{ user.country }}</span>
              </div>
            </div>

            <div class="mt-4 md:mt-0 flex space-x-2">
              <button
                v-if="!route.params.username"
                class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 flex items-center space-x-2"
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
    </div>

    <div class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div class="flex border-b border-gray-700">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex-1 py-4 px-4 text-center font-medium transition-colors duration-200 cursor-pointer"
          :class="activeTab === tab.id ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400 hover:text-gray-200'"
        >
          {{ tab.label }}
          <span class="ml-2 text-sm bg-gray-700 rounded-full px-2 py-0.5">{{ tab.count }}</span>
        </button>
      </div>

      <div class="p-6">
        <div v-if="activeTab === 'bands'" class="space-y-4">
          <div v-if="user.favorite_bands.length === 0" class="text-center py-8 text-gray-400">
            Нет добавленых любимых групп
          </div>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <BandCardMini v-for="band in user.favorite_bands" :key="band.id" :band="band" @click="goToBand(band)" />
          </div>
        </div>

        <div v-if="activeTab === 'albums'" class="space-y-4">
          <div v-if="user.favorite_albums.length === 0" class="text-center py-8 text-gray-400">
            Нет добавленых любимых альбомов
          </div>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <AlbumCardMini
              v-for="album in user.favorite_albums"
              :key="album.id"
              :album="album"
              @click="goToAlbum(album)"
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

  <confirm-modal :model-value="userEditDialog" title="123123" @close="userEditDialog = false" />

  <!-- <el-dialog v-model="userEditDialog" title="Редактирование" width="500">
    <span>This is a message</span>
    <template #footer>
      <el-button type="danger" @click="userEditDialog = false">Отменить</el-button>
      <el-button type="success" @click="userEditDialog = false">Сохранить</el-button>
    </template>
  </el-dialog> -->
</template>
