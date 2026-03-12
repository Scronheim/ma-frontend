<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Star, StarFilled } from '@element-plus/icons-vue'

import { useStore } from '@/store/store'

import dateNormalizer from '@/utils/dateNormalizer'
import { sortByDate } from '@/utils'

import CollapsibleText from '@/components/CollapsibleText.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import BandMember from '@/components/BandMember.vue'

import type { Rating } from '@/types'
import CustomButton from '@/components/inputs/CustomButton.vue'

const route = useRoute()
const store = useStore()

const showPreview = ref(false)
const showLogoPreview = ref(false)
const urlList = ref<string[]>([])
const activeTab = ref<string>('discography')
const activeMembersTab = ref<string>('current')

const band = computed(() => store.currentBand)
const bandSimilar = computed(() => store.currentBandSimilar)
const bandName = computed(() => route.params.bandName)
const bandId = computed((): number => parseInt(route.params.id as string))
const sortedDiscography = computed(() => {
  return [...band.value.discography].sort(sortByDate)
})
const bandUserFavoriteIndex = computed((): number => store.user.favorite_bands.findIndex(b => b.id === bandId.value))
const bandUserRatingIndex = computed((): number => store.user.bands_ratings.findIndex(b => b.id === bandId.value))
const bandUserRating = computed((): Rating => {
  const rating = store.user.bands_ratings.find(b => b.id === bandId.value)
  if (rating) return rating
  return { id: bandId.value, rating: 0 }
})
const tabs = computed(() => [
  { id: 'discography', label: 'Дискография' },
  { id: 'members', label: 'Состав' },
  { id: 'similar', label: 'Похожие группы' },
  { id: 'links', label: 'Ссылки' }
])
const membersTabs = computed(() => [
  { id: 'current', label: 'Текущий', count: band.value.current_lineup.length },
  { id: 'past', label: 'Прошлые', count: band.value.past_lineup.length }
])
const loadMoreText = computed(() => {
  return store.currentBandSimilar.length > 20 ? 'Показать меньше' : 'Показать больше'
})

const toggleFavoriteBand = async () => {
  if (bandUserFavoriteIndex.value > -1) store.user.favorite_bands.splice(bandUserFavoriteIndex.value, 1)
  else store.user.favorite_bands.push(store.currentBand)
  await store.updateMe()
}
const openImagePreview = (imgList: string[]) => {
  urlList.value = imgList
  showPreview.value = true
}
const getBandById = async () => {
  if (store.fromRandom) store.fromRandom = false
  else await store.getBandById(bandId.value)
}
const changeBandRating = async (rating: number): Promise<void> => {
  if (bandUserRatingIndex.value > -1) store.user.bands_ratings[bandUserRatingIndex.value].rating = rating
  else if (rating === 0) store.user.bands_ratings.splice(bandUserRatingIndex.value, 1)
  else store.user.bands_ratings.push({ id: bandId.value, rating })
  await store.updateMe()
}
const changeTab = async (tabName: string) => {
  activeTab.value = tabName
  if (tabName === 'similar') await store.getBandSimilar()
}
const refreshBand = async () => {
  await store.getBandById(store.currentBand.id, true)
}

watch(bandId, async () => {
  await getBandById()
  activeTab.value = 'discography'
  activeMembersTab.value = 'current'
})
onMounted(async () => {
  await getBandById()
  activeTab.value = 'discography'
  activeMembersTab.value = 'current'
})
</script>

<template>
  <LoadingSpinner v-if="store.bandIsLoading || store.randomBandIsLoading" :visible="store.bandIsLoading || store.randomBandIsLoading" />
  <div class="space-y-6" v-else>
    <!-- Заголовок группы -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between">
      <div class="flex items-center space-x-4">
        <div
          class="w-20 h-20 md:w-24 md:h-24 bg-linear-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 flex items-center justify-center overflow-hidden cursor-pointer"
        >
          <template v-if="band.logo_url">
            <img :src="band.logo_url" :alt="band.name" class="w-full h-full object-cover" @click="showLogoPreview = true" />
            <el-image-viewer v-if="showLogoPreview" :url-list="[band.logo_url]" hide-on-click-modal @close="showLogoPreview = false" />
          </template>
          <span v-else class="text-3xl">🎸</span>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-3xl md:text-4xl font-bold">{{ band.name }}</h1>
            <el-tooltip v-if="store.userIsAuth" :content="bandUserFavoriteIndex > -1 ? 'Убрать из избранных' : 'Добавить в избранные'" placement="top">
              <el-button :icon="bandUserFavoriteIndex > -1 ? StarFilled : Star" circle plain :type="bandUserFavoriteIndex > -1 ? 'warning' : 'info'" @click="toggleFavoriteBand" />
            </el-tooltip>
          </div>
          <div class="flex flex-wrap items-center gap-2 mt-2">
            <span class="px-3 py-1 bg-gray-800 rounded-full text-sm">{{ band.status }}</span>
            <span class="px-3 py-1 bg-gray-800 rounded-full text-sm">Образована в {{ band.formed_in }}</span>
          </div>
          <h3 class="text-gray-400 text-sm">Данные на {{ dateNormalizer.normalizeDate(band.updated_at) }}</h3>
        </div>
      </div>
      <CustomButton v-if="store.userIsAuth" text="Обновить" :loading="store.bandIsLoading" @click="refreshBand" />
    </div>

    <!-- Основная информация -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <!-- Детали группы -->
        <div class="flex flex-col gap-6">
          <div class="w-full bg-gray-800 rounded-lg border border-gray-700 py-3 px-3">
            <div class="flex justify-between">
              <h2 class="text-2xl font-bold mb-4 text-red-400">Информация о группе</h2>
              <div v-if="store.userIsAuth" class="flex items-start">
                <el-rate clearable allow-half v-model.number="bandUserRating.rating" @change="changeBandRating" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
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

        <div class="bg-gray-800 rounded-lg border border-gray-700 py-2 px-4">
          <div class="overflow-x-auto">
            <div class="flex border-b border-gray-700">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="changeTab(tab.id)"
                class="flex-1 py-2 text-center font-medium transition-colors duration-200 cursor-pointer"
                :class="activeTab === tab.id ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400 hover:text-gray-200'"
              >
                {{ tab.label }}
              </button>
            </div>

            <div>
              <div v-if="activeTab === 'discography'">
                <div v-if="band.discography.length === 0" class="text-center py-8 text-gray-400">Нет альбомов</div>
                <table v-if="band.discography.length" class="w-full">
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
                      @click="$router.push(`/albums/${bandName}/${album.title_slug}/${album.id}`)"
                    >
                      <td class="py-3">{{ album.release_date }}</td>
                      <td class="py-3 px-3 font-medium">
                        <div class="flex items-center space-x-3">
                          <div class="w-10 h-10 bg-gray-700 rounded shrink-0 flex items-center justify-center">
                            <div v-if="album.cover_loading" class="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
                            <img v-else-if="album.cover_url && !album.cover_loading" v-lazy="album.cover_url" />
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
              <div v-else-if="activeTab === 'members'">
                <div v-if="band.current_lineup.length === 0 && band.past_lineup.length === 0" class="text-center py-8 text-gray-400">Нет добавленных составов</div>
                <div v-else class="flex border-b border-gray-700">
                  <button
                    v-for="tab in membersTabs"
                    :key="tab.id"
                    @click="activeMembersTab = tab.id"
                    class="flex-1 py-2 px-2 text-center font-medium transition-colors duration-200 cursor-pointer"
                    :class="activeMembersTab === tab.id ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400 hover:text-gray-200'"
                  >
                    {{ tab.label }}
                    <span class="ml-2 text-sm bg-gray-700 rounded-full px-2 py-0.5">{{ tab.count }}</span>
                  </button>
                </div>

                <div v-if="activeMembersTab === 'current'" class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-1 gap-2">
                    <BandMember v-for="member in band.current_lineup" :key="member.fullname" :member="member" />
                  </div>
                </div>
                <div v-if="activeMembersTab === 'past'">
                  <div class="grid grid-cols-1 md:grid-cols-1 gap-2">
                    <BandMember v-for="member in band.past_lineup" :key="member.fullname" :member="member" />
                  </div>
                </div>
              </div>
              <div v-else-if="activeTab === 'similar'">
                <LoadingSpinner v-if="store.similarBandsIsLoading" :visible="store.similarBandsIsLoading" />
                <template v-else>
                  <div v-if="bandSimilar.length === 0" class="text-center py-8 text-gray-400">Нет рекомендованных похожих групп</div>
                  <template v-if="bandSimilar.length">
                    <table class="w-full">
                      <thead>
                        <tr class="border-b border-gray-700">
                          <th class="text-left py-3">Группа</th>
                          <th class="text-left py-3 px-3">Страна</th>
                          <th class="text-left py-3 px-3">Жанр</th>
                          <th class="text-left py-3 px-3">Оценка</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(band, index) in bandSimilar"
                          :key="band.id"
                          :class="{ 'border-b': index !== bandSimilar.length - 1 }"
                          class="border-gray-700 hover:bg-gray-800 transition-colors duration-150 cursor-pointer"
                          @click="$router.push(`/bands/${band.name_slug}/${band.id}`)"
                        >
                          <td class="py-2 px-2">
                            {{ band.name }}
                          </td>
                          <td class="py-2 px-2">
                            {{ band.country }}
                          </td>
                          <td class="py-2 px-2">
                            {{ band.genres }}
                          </td>
                          <td class="py-2 px-2">
                            {{ band.score }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <el-text type="danger" class="cursor-pointer" @click="store.getBandSimilar(store.currentBandSimilar.length === 20)">{{ loadMoreText }}</el-text>
                  </template>
                </template>
              </div>
              <div v-else-if="activeTab === 'links'">
                <div class="grid grid-cols-3">
                  <el-link v-for="link in band.links" :key="link.url" :href="link.url" type="primary" underline="never" target="_blank">
                    {{ link.social }}
                  </el-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Боковая панель -->
      <div class="space-y-6">
        <!-- Фото группы -->
        <div class="bg-gray-800 rounded-lg border border-gray-700 py-3 px-3">
          <h2 class="text-xl font-bold mb-4 text-red-400">Фото группы</h2>
          <div class="bg-gray-750 rounded-lg overflow-hidden">
            <div class="bg-linear-to-br from-gray-700 to-gray-900 flex flex-col items-center justify-center cursor-pointer">
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
                <el-image-viewer v-if="showPreview" :url-list="urlList" hide-on-click-modal @close="showPreview = false" />
              </template>
              <span v-else class="text-5xl">📸</span>
            </div>
          </div>
        </div>
        <!-- Ссылки группы -->
      </div>
    </div>
  </div>
</template>
