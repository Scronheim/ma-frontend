<template>
  <div v-if="store.bandIsLoading" class="flex items-center justify-center min-h-[60vh]">
    <div class="text-center">
      <div class="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p>Идёт загрузка информации...</p>
    </div>
  </div>
  <div class="space-y-6" v-else>
    <!-- Заголовок группы -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between">
      <div class="flex items-center space-x-4">
        <div
          class="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 flex items-center justify-center overflow-hidden"
        >
          <template v-if="band.logo_url">
            <img
              :src="band.logo_url"
              :alt="band.name"
              class="w-full h-full object-cover"
              @click="showLogoPreview = true"
            />
            <el-image-viewer
              v-if="showLogoPreview"
              :url-list="[band.logo_url]"
              hide-on-click-modal
              @close="showLogoPreview = false"
            />
          </template>
          <span v-else class="text-3xl">🎸</span>
        </div>
        <div>
          <h1 class="text-3xl md:text-4xl font-bold">{{ band.name }}</h1>
          <div class="flex flex-wrap items-center gap-2 mt-2">
            <span class="px-3 py-1 bg-gray-800 rounded-full text-sm">{{ band.country }}</span>
            <span class="px-3 py-1 bg-gray-800 rounded-full text-sm">{{ band.status }}</span>
            <span class="px-3 py-1 bg-gray-800 rounded-full text-sm">Образована в {{ band.formed_in }}</span>
          </div>
          <h3 class="text-gray-400 text-sm">Данные на {{ dateNormalizer.normalizeDate(band.updated_at) }}</h3>
        </div>
      </div>
    </div>

    <!-- Основная информация -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <!-- Детали группы -->
        <div class="flex flex-col gap-6">
          <div class="w-full bg-gray-800 rounded-lg border border-gray-700 py-3 px-3">
            <h2 class="text-2xl font-bold mb-4 text-red-400">Информация о группе</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 class="text-gray-400 text-sm uppercase tracking-wider">Жанр</h3>
                <p>{{ band.genres }}</p>
              </div>
              <div>
                <h3 class="text-gray-400 text-sm uppercase tracking-wider">Темы текстов</h3>
                <p>{{ band.themes }}</p>
              </div>
              <div>
                <h3 class="text-gray-400 text-sm uppercase tracking-wider">Страна</h3>
                <p>{{ band.country }}</p>
              </div>
              <div>
                <h3 class="text-gray-400 text-sm uppercase tracking-wider">Город</h3>
                <p>{{ band.city }}</p>
              </div>
              <div>
                <h3 class="text-gray-400 text-sm uppercase tracking-wider">Годы активности</h3>
                <p>{{ band.years_active }}</p>
              </div>
              <div>
                <h3 class="text-gray-400 text-sm uppercase tracking-wider">Лейбл</h3>
                <p>{{ band.label }}</p>
              </div>
            </div>
            <el-divider v-if="band.description" style="margin-bottom: 8px" />
            <collapsible-text :content="band.description" :collapsed-height="200" />
          </div>
        </div>

        <!-- Альбомы -->
        <div class="bg-gray-800 rounded-lg border border-gray-700 py-2 px-4">
          <h2 class="text-2xl font-bold mb-4 text-red-400">Дискография</h2>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-700">
                  <th class="text-left py-3">Дата релиза</th>
                  <th class="text-left py-3 px-3">Название</th>
                  <th class="text-left py-3 px-3">Тип</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(album, index) in sortedDiscography"
                  :key="album.id"
                  :class="{ 'border-b': index !== sortedDiscography.length - 1 }"
                  class="border-gray-700 hover:bg-gray-800 transition-colors duration-150 cursor-pointer"
                  @click="$router.push(`/album/${bandName}/${album.id}`)"
                >
                  <td class="py-3">{{ album.release_date }}</td>
                  <td class="py-3 px-3 font-medium">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-gray-700 rounded flex-shrink-0 flex items-center justify-center">
                        <div
                          v-if="album.cover_loading"
                          class="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"
                        />
                        <img v-else-if="album.cover_url && !album.cover_loading" :src="album.cover_url" />
                        <span v-else>💿</span>
                      </div>
                      <span>{{ album.title }}</span>
                    </div>
                  </td>
                  <td class="py-3 px-3">
                    <span class="px-2 py-1 bg-gray-700 rounded text-xs">{{ album.type }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Боковая панель -->
      <div class="space-y-6">
        <!-- Фото группы -->
        <div class="bg-gray-800 rounded-lg border border-gray-700 py-3 px-3">
          <h2 class="text-xl font-bold mb-4 text-red-400">Фото группы</h2>
          <div class="bg-gray-750 rounded-lg overflow-hidden">
            <div class="bg-gradient-to-br from-gray-700 to-gray-900 flex flex-col items-center justify-center">
              <template v-if="band.logo_url || band.photo_url">
                <img
                  v-if="band.logo_url"
                  :src="band.logo_url"
                  :alt="band.name + '_logo'"
                  class="w-full h-full object-cover"
                  @click="openImagePreview([band.logo_url, band.photo_url])"
                />
                <img
                  v-if="band.photo_url"
                  :src="band.photo_url"
                  :alt="band.name + '_photo'"
                  class="w-full h-full object-cover"
                  @click="openImagePreview([band.photo_url, band.logo_url])"
                />
                <el-image-viewer
                  v-if="showPreview"
                  :url-list="urlList"
                  hide-on-click-modal
                  @close="showPreview = false"
                />
              </template>
              <span v-else class="text-5xl">📸</span>
            </div>
          </div>
        </div>
        <!-- Состав группы -->
        <div v-if="band.current_lineup.length" class="min-w-80 bg-gray-800 rounded-lg border border-gray-700 py-3 px-3">
          <h2 class="text-2xl font-bold mb-4 text-red-400">Состав</h2>
          <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
            <div v-for="member in band.current_lineup" :key="member.url">
              <h3>{{ member.name }}</h3>
              <p class="text-gray-400 text-sm tracking-wider">{{ member.role }}</p>
            </div>
          </div>
        </div>
        <!-- Ссылки группы -->
        <div v-if="band.links.length" class="bg-gray-800 rounded-lg border border-gray-700 py-3 px-3">
          <h2 class="text-xl font-bold mb-4 text-red-400">Ссылки</h2>
          <div class="grid grid-cols-2 bg-gray-750 rounded-lg overflow-hidden">
            <el-link
              v-for="link in band.links"
              :key="link.url"
              type="primary"
              :underline="false"
              target="_blank"
              :href="link.url"
            >
              {{ link.social }}
            </el-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useStore } from '@/store/store'

import dateNormalizer from '@/utils/dateNormalizer'
import { sortByDate } from '@/utils'

import CollapsibleText from '@/components/CollapsibleText.vue'

const route = useRoute()
const store = useStore()

const showPreview = ref(false)
const showLogoPreview = ref(false)
const urlList = ref<string[]>([])

const band = computed(() => store.currentBand)
const bandName = computed(() => route.params.bandName)
const bandId = computed(() => route.params.id)
const fromRandom = computed(() => route.query.fromRandom)
const sortedDiscography = computed(() => {
  return [...band.value.discography].sort(sortByDate)
})

const openImagePreview = (imgList: string[]) => {
  urlList.value = imgList
  showPreview.value = true
}

const getBandById = async () => {
  if (fromRandom.value) location.replace(`/#/band/${bandName.value}/${bandId.value}`)
  else await store.getBandById(bandId.value)
}
watch(bandId, async () => {
  await getBandById()
})
onMounted(async () => {
  await getBandById()
})
</script>
