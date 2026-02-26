<template>
  <div class="space-y-8">
    <!-- Заголовок -->
    <div class="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h1 class="text-3xl font-bold text-white mb-2">Browse Bands by Country</h1>
      <p class="text-gray-400">Select a country to see all bands from there</p>
    </div>

    <!-- Поиск по странам -->
    <div class="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div class="flex items-center space-x-4 mb-6">
        <div class="flex-1 relative">
          <svg
            class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search for a country..."
            class="w-full pl-10 pr-4 py-3 bg-gray-750 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        <select
          v-model="sortBy"
          class="bg-gray-750 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
        >
          <option value="name">Sort by Name</option>
          <option value="bands">Sort by Bands Count</option>
        </select>
      </div>

      <!-- Статистика -->
      <div class="flex items-center justify-between text-sm text-gray-400 mb-4">
        <span>{{ filteredCountries.length }} countries</span>
        <span>{{ totalBands }} total bands</span>
      </div>

      <!-- Сетка стран -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
          v-for="country in paginatedCountries"
          :key="country.code"
          class="bg-gray-750 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
          @click="selectCountry(country)"
        >
          <div class="flex items-start space-x-3">
            <div class="text-3xl">{{ getFlagEmoji(country.nameEn) }}</div>
            <div class="flex-1">
              <h3 class="font-bold text-white">{{ country.name }}</h3>
              <p class="text-sm text-gray-400">{{ country.nameEn }}</p>
              <div class="flex items-center justify-between mt-2">
                <span class="text-xs text-gray-500">{{ country.code }}</span>
                <span class="text-sm font-medium text-red-400">{{ getBandCount(country) }} bands</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Пагинация -->
      <div class="mt-6 flex items-center justify-between">
        <div class="text-sm text-gray-400">
          Showing {{ startIndex + 1 }}-{{ endIndex }} of {{ filteredCountries.length }}
        </div>

        <div class="flex items-center space-x-2">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span class="text-sm text-gray-400">Page {{ currentPage }} of {{ totalPages }}</span>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Результаты для выбранной страны -->
    <div v-if="selectedCountry" class="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-3">
          <div class="text-4xl">{{ getFlagEmoji(selectedCountry.nameEn) }}</div>
          <div>
            <h2 class="text-2xl font-bold text-white">{{ selectedCountry.name }}</h2>
            <p class="text-gray-400">{{ selectedCountry.nameEn }}</p>
          </div>
        </div>

        <button
          @click="clearSelection"
          class="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>Clear</span>
        </button>
      </div>

      <!-- Состояние загрузки -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Список групп -->
      <div v-else-if="countryBands.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="band in countryBands"
          :key="band.id"
          class="bg-gray-750 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
          @click="goToBand(band.id)"
        >
          <div class="flex items-start space-x-3">
            <div class="w-12 h-12 bg-gray-700 rounded-full flex-shrink-0 flex items-center justify-center">
              <span class="text-xl">🎸</span>
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-white">{{ band.name }}</h3>
              <p class="text-sm text-gray-400 truncate">{{ band.genre.join(', ') }}</p>
              <div class="flex items-center justify-between mt-2">
                <span class="text-xs text-gray-500">Formed {{ band.formedIn }}</span>
                <span class="text-sm text-yellow-400">{{ band.rating }}/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Пустое состояние -->
      <div v-else class="text-center py-12">
        <p class="text-gray-400">No bands found from {{ selectedCountry.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import { countries } from '@/utils'

import type { Country } from '@/types'

const router = useRouter()

// Состояние
const searchQuery = ref('')
const sortBy = ref<'name' | 'bands'>('name')
const currentPage = ref(1)
const pageSize = ref(20)
const selectedCountry = ref<Country | null>(null)
const isLoading = ref(false)

// Моковые данные для количества групп по странам
const bandsPerCountry = ref<Record<string, number>>({
  US: 1234,
  GB: 987,
  SE: 654,
  DE: 543,
  FI: 432,
  NO: 321,
  CA: 298,
  FR: 276,
  PL: 245,
  BR: 234,
  RU: 187,
  AU: 165,
  NL: 154,
  CH: 143,
  AT: 132
})

// Моковые данные для групп по странам
const bandsData = ref([
  { id: '1', name: 'Metallica', country: 'US', genre: ['Thrash Metal'], formedIn: 1981, rating: 4.8 },
  { id: '2', name: 'Megadeth', country: 'US', genre: ['Thrash Metal'], formedIn: 1983, rating: 4.5 },
  { id: '3', name: 'Slayer', country: 'US', genre: ['Thrash Metal'], formedIn: 1981, rating: 4.4 },
  { id: '4', name: 'Anthrax', country: 'US', genre: ['Thrash Metal'], formedIn: 1981, rating: 4.2 },
  { id: '5', name: 'Iron Maiden', country: 'GB', genre: ['Heavy Metal'], formedIn: 1975, rating: 4.9 },
  { id: '6', name: 'Black Sabbath', country: 'GB', genre: ['Heavy Metal'], formedIn: 1968, rating: 4.7 },
  { id: '7', name: 'Judas Priest', country: 'GB', genre: ['Heavy Metal'], formedIn: 1969, rating: 4.6 },
  { id: '8', name: 'Opeth', country: 'SE', genre: ['Progressive Metal'], formedIn: 1990, rating: 4.5 },
  { id: '9', name: 'Amon Amarth', country: 'SE', genre: ['Melodic Death Metal'], formedIn: 1992, rating: 4.3 },
  { id: '10', name: 'In Flames', country: 'SE', genre: ['Melodic Death Metal'], formedIn: 1990, rating: 4.1 },
  { id: '11', name: 'Kreator', country: 'DE', genre: ['Thrash Metal'], formedIn: 1982, rating: 4.4 },
  { id: '12', name: 'Sodom', country: 'DE', genre: ['Thrash Metal'], formedIn: 1981, rating: 4.2 },
  { id: '13', name: 'Destruction', country: 'DE', genre: ['Thrash Metal'], formedIn: 1983, rating: 4.1 }
])

const totalBands = computed(() => Object.values(bandsPerCountry.value).reduce((sum, count) => sum + count, 0))

// Фильтрация и сортировка стран
const filteredCountries = computed(() => {
  let filtered = countries.filter(
    country =>
      country.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      country.nameEn.toLowerCase().includes(searchQuery.value.toLowerCase())
  )

  if (sortBy.value === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name))
  } else {
    filtered.sort((a, b) => {
      const countA = getBandCount(a)
      const countB = getBandCount(b)
      return countB - countA
    })
  }

  return filtered
})

// Пагинация
const totalPages = computed(() => Math.ceil(filteredCountries.value.length / pageSize.value))
const startIndex = computed(() => (currentPage.value - 1) * pageSize.value)
const endIndex = computed(() => Math.min(startIndex.value + pageSize.value, filteredCountries.value.length))

const paginatedCountries = computed(() => {
  return filteredCountries.value.slice(startIndex.value, endIndex.value)
})

// Группы для выбранной страны
const countryBands = computed(() => {
  if (!selectedCountry.value) return []

  isLoading.value = true

  setTimeout(() => {
    isLoading.value = false
  }, 300)

  return bandsData.value.filter(band => band.country === selectedCountry.value?.code)
})

// Методы
const getBandCount = (country: Country): number => {
  return bandsPerCountry.value[country.code] || Math.floor(Math.random() * 100) + 1
}

const getFlagEmoji = (countryName: string): string => {
  // Простая реализация - в реальном проекте используйте библиотеку
  const flags: Record<string, string> = {
    'United States': '🇺🇸',
    'United Kingdom': '🇬🇧',
    Sweden: '🇸🇪',
    Germany: '🇩🇪',
    Finland: '🇫🇮',
    Norway: '🇳🇴',
    France: '🇫🇷',
    Poland: '🇵🇱',
    Brazil: '🇧🇷',
    Russia: '🇷🇺',
    Canada: '🇨🇦',
    Australia: '🇦🇺',
    Netherlands: '🇳🇱',
    Switzerland: '🇨🇭',
    Austria: '🇦🇹'
  }

  return flags[countryName] || '🏴'
}

const selectCountry = (country: Country) => {
  selectedCountry.value = country
  isLoading.value = true
}

const clearSelection = () => {
  selectedCountry.value = null
}

const goToBand = (id: string) => {
  router.push(`/band/${id}`)
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}
</script>
