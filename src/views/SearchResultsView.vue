<template>
  <div class="space-y-6">
    <!-- Таблица результатов -->
    <div v-if="!searchIsLoading" class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <!-- Поиск по группе -->
      <template v-if="isBandSearch">
        <!-- Десктопная версия таблицы -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-750 border-b border-gray-700">
                <th class="text-left py-4 px-6 font-semibold text-gray-300 uppercase tracking-wider">
                  <div class="flex items-center">
                    <span>Группа</span>
                  </div>
                </th>
                <th class="text-left py-4 px-6 font-semibold text-gray-300 uppercase tracking-wider">
                  <div class="flex items-center">
                    <span>Жанр</span>
                  </div>
                </th>
                <th class="text-left py-4 px-6 font-semibold text-gray-300 uppercase tracking-wider">
                  <div class="flex items-center">
                    <span>Страна</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr
                v-for="result in paginatedResults"
                :key="result.id"
                class="hover:bg-gray-750 transition-colors duration-150 cursor-pointer group"
                @click="goToBand(result)"
              >
                <td class="py-4 px-6">
                  <div class="flex items-center">
                    <div>
                      <div class="font-medium">{{ result.name }}</div>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <div class="flex flex-wrap gap-1">
                    <span class="px-2 py-1 bg-gray-700 rounded text-xs">
                      {{ result.genre }}
                    </span>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <div class="flex items-center">
                    <span class="mr-2">{{ getFlagEmoji(result.country) }}</span>
                    <span>{{ result.country }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Мобильная версия (карточки) -->
        <div class="md:hidden">
          <div v-for="result in paginatedResults" :key="result.id" class="border-b border-gray-700 last:border-0">
            <div class="p-4 hover:bg-gray-750 transition-colors duration-150 cursor-pointer" @click="goToBand(result)">
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-bold text-lg mb-1">{{ result.name }}</div>
                  <div class="flex items-center mb-2">
                    <span class="mr-2">{{ getFlagEmoji(result.country) }}</span>
                    <span class="text-gray-400">{{ result.country }}</span>
                  </div>
                  <div class="flex flex-wrap gap-1 mb-3">
                    <span class="px-2 py-1 bg-gray-700 rounded text-xs">
                      {{ result.genre }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <!-- Поиск по альбому -->
      <template v-else>
        <!-- Десктопная версия таблицы -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-750 border-b border-gray-700">
                <th class="text-left py-4 px-6 font-semibold text-gray-300 uppercase tracking-wider">
                  <div class="flex items-center">
                    <span>Группа</span>
                  </div>
                </th>
                <th class="text-left py-4 px-6 font-semibold text-gray-300 uppercase tracking-wider">
                  <div class="flex items-center">
                    <span>Альбом</span>
                  </div>
                </th>
                <th class="text-left py-4 px-6 font-semibold text-gray-300 uppercase tracking-wider">
                  <div class="flex items-center">
                    <span>Тип</span>
                  </div>
                </th>
                <th class="text-left py-4 px-6 font-semibold text-gray-300 uppercase tracking-wider">
                  <div class="flex items-center">
                    <span>Дата</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr
                v-for="result in paginatedResults"
                :key="result.id"
                class="hover:bg-gray-750 transition-colors duration-150 cursor-pointer group"
                @click="goToAlbum(result)"
              >
                <td class="py-4 px-6">
                  <div class="flex items-center">
                    <div class="font-medium">{{ result.band_name }}</div>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <div class="flex flex-wrap gap-1">
                    <span class="px-2 py-1 bg-gray-700 rounded text-xs">
                      {{ result.title }}
                    </span>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <div class="flex items-center">
                    <div class="font-medium">{{ result.type }}</div>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <div class="flex items-center">
                    <div class="font-medium">{{ result.release_date }}</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Мобильная версия (карточки) -->
        <div class="md:hidden">
          <div v-for="result in paginatedResults" :key="result.id" class="border-b border-gray-700 last:border-0">
            <div class="p-4 hover:bg-gray-750 transition-colors duration-150 cursor-pointer" @click="goToAlbum(result)">
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-bold text-lg mb-1">{{ result.band_name }}</div>
                  <div class="flex items-center mb-2">
                    <span class="text-gray-400">{{ result.title }}</span>
                  </div>
                  <div class="flex flex-wrap gap-1 mb-3">
                    <span class="px-2 py-1 bg-gray-700 rounded text-xs">
                      {{ result.release_date }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <!-- Пагинация -->
      <div
        class="flex flex-col md:flex-row md:items-center justify-between px-6 py-4 border-t border-gray-700 bg-gray-750"
      >
        <div class="text-gray-400 mb-4 md:mb-0">
          Показано {{ startIndex + 1 }}-{{ endIndex }} из {{ searchResults.length }} результатов
        </div>

        <div class="flex items-center justify-center space-x-2">
          <el-button
            :icon="ArrowLeftBold"
            @click="previousPage"
            :disabled="currentPage === 1"
            :class="[
              'px-3 py-1 rounded border border-gray-700 transition-colors duration-200',
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'
            ]"
          />

          <div class="flex space-x-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'w-8 h-8 rounded flex items-center justify-center',
                page === currentPage ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600'
              ]"
            >
              {{ page }}
            </button>
            <span v-if="hasMorePages" class="px-2 flex items-center">...</span>
          </div>
          <el-button
            :icon="ArrowRightBold"
            @click="nextPage"
            :disabled="currentPage === totalPages"
            :class="[
              'px-3 py-1 rounded border border-gray-700 transition-colors duration-200',
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'
            ]"
          />
        </div>
      </div>
    </div>

    <!-- Пустые результаты -->
    <div v-if="searchResults.length === 0 && !searchIsLoading" class="text-center py-12">
      <div class="w-20 h-20 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
        <svg class="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 class="text-xl font-bold mb-2">Нет результатов</h3>
      <p class="text-gray-400 mb-6">
        {{ searchQuery ? `По запросу "${searchQuery}" ничего не найдено` : 'Нет найденных групп' }}
      </p>
    </div>
    <div v-if="searchIsLoading" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <div
          class="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"
        ></div>
        <p>Идёт загрузка информации...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'

import { useStore } from '@/store/store'

import type { SearchBandResult, SearchAlbumResult, Band, Album } from '@/types'

const props = defineProps<{
  query?: string
}>()

const router = useRouter()
const route = useRoute()
const store = useStore()

const searchQuery = ref(props.query || '')
const searchResults = ref<SearchBandResult[] | SearchAlbumResult[]>([])
const currentPage = ref(1)
const pageSize = ref(25)
const searchIsLoading = ref(false)

const isBandSearch = computed(() => route.query.type === 'band')

// Пагинированные результаты
const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return searchResults.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(searchResults.value.length / pageSize.value))
const startIndex = computed(() => (currentPage.value - 1) * pageSize.value)
const endIndex = computed(() => Math.min(startIndex.value + pageSize.value, searchResults.value.length))

// Видимые страницы для пагинации
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5

  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    let start = Math.max(1, currentPage.value - 2)
    let end = Math.min(totalPages.value, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }

  return pages
})

const hasMorePages = computed(() => {
  return visiblePages.value.length > 0 && visiblePages.value[visiblePages.value.length - 1] < totalPages.value
})

// Методы
const search = async () => {
  try {
    searchIsLoading.value = true
    const { data } = await axios.get(`/api/${route.query.type}/search?query=${searchQuery.value}`)
    searchResults.value = data.data
  } finally {
    searchIsLoading.value = false
  }
}
const getFlagEmoji = (country: string) => {
  // Простая маппинг стран в эмодзи флагов
  const flagMap: Record<string, string> = {
    'United States': '🇺🇸',
    'United Kingdom': '🇬🇧',
    Sweden: '🇸🇪',
    Germany: '🇩🇪',
    Norway: '🇳🇴',
    Finland: '🇫🇮',
    France: '🇫🇷',
    Poland: '🇵🇱',
    Brazil: '🇧🇷'
  }

  return flagMap[country] || '🏴'
}

const goToBand = async (band: Band) => {
  try {
    searchIsLoading.value = true
    await store.getBandById(band.id)
    router.push(`/band/${band.name}/${band.id}`)
  } finally {
    searchIsLoading.value = false
  }
}
const goToAlbum = (album: SearchAlbumResult) => {
  router.push(`/album/${album.band_name}/${album.id}`)
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Наблюдаем за изменением запроса в URL
watch(
  () => route.query.q,
  newQuery => {
    if (newQuery !== undefined) {
      searchQuery.value = newQuery as string
      currentPage.value = 1
    }
  }
)

// Наблюдаем за изменением размера страницы
watch(pageSize, () => {
  currentPage.value = 1
})
watch(searchQuery, () => {
  search()
})

// Инициализация
onMounted(async () => {
  // Если есть поисковый запрос в URL, применяем его
  if (route.query.q) {
    searchQuery.value = route.query.q as string
  }
  await search()
})
</script>

<style scoped>
/* Стили для мобильной таблицы */
@media (max-width: 768px) {
  .mobile-table-row {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    border-bottom: 1px solid #374151;
  }

  .mobile-table-row:last-child {
    border-bottom: none;
  }
}
</style>
