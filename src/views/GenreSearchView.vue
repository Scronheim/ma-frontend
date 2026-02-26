<template>
  <div class="space-y-8">
    <!-- Заголовок -->
    <div class="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h1 class="text-3xl font-bold text-white mb-2">Browse Bands by Genre</h1>
      <p class="text-gray-400">Explore metal subgenres and discover new bands</p>
    </div>

    <!-- Сетка жанров -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="genre in genres"
        :key="genre.id"
        class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
        @click="selectGenre(genre)"
      >
        <!-- Цветная полоса сверху -->
        <div class="h-2" :style="{ backgroundColor: genre.color }"></div>

        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <h2 class="text-2xl font-bold" :style="{ color: genre.color }">{{ genre.name }}</h2>
            <span class="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
              {{ getBandCount(genre) }} bands
            </span>
          </div>

          <p class="text-gray-400 mb-4">{{ genre.description }}</p>

          <!-- Примеры групп -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="band in getExampleBands(genre)"
              :key="band"
              class="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
            >
              {{ band }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Результаты для выбранного жанра -->
    <div v-if="selectedGenre" class="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold" :style="{ color: selectedGenre.color }">{{ selectedGenre.name }}</h2>
          <p class="text-gray-400">{{ selectedGenre.description }}</p>
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

      <!-- Таблица с группами -->
      <div v-else-if="genreBands.length > 0" class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-700">
              <th class="text-left py-3 px-4 text-gray-400">Band</th>
              <th class="text-left py-3 px-4 text-gray-400">Country</th>
              <th class="text-left py-3 px-4 text-gray-400">Formed</th>
              <th class="text-left py-3 px-4 text-gray-400">Rating</th>
              <th class="text-left py-3 px-4 text-gray-400">Top Album</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="band in genreBands"
              :key="band.id"
              class="border-b border-gray-700 hover:bg-gray-750 transition-colors duration-150 cursor-pointer"
              @click="goToBand(band.id)"
            >
              <td class="py-3 px-4">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <span class="text-lg">🎸</span>
                  </div>
                  <span class="font-medium">{{ band.name }}</span>
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <span class="mr-2">{{ getFlagEmoji(band.country) }}</span>
                  <span>{{ band.country }}</span>
                </div>
              </td>
              <td class="py-3 px-4">{{ band.formedIn }}</td>
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <span class="text-yellow-400 font-bold mr-2">{{ band.rating }}</span>
                  <div class="w-16 bg-gray-700 rounded-full h-2">
                    <div class="bg-yellow-400 h-2 rounded-full" :style="{ width: `${(band.rating / 5) * 100}%` }"></div>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4 text-gray-400">{{ band.topAlbum }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Пустое состояние -->
      <div v-else class="text-center py-12">
        <p class="text-gray-400">No bands found in this genre</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import { genres } from '@/utils'

import type { Genre } from '@/types'

const router = useRouter()

// Состояние
const selectedGenre = ref<Genre | null>(null)
const isLoading = ref(false)

// Моковые данные для количества групп по жанрам
const bandsPerGenre = ref<Record<string, number>>({
  black: 2345,
  death: 3456,
  'doom-stoner-sludge': 1234,
  'electronic-industrial': 567,
  'experimental-avantgarde': 345,
  'folk-viking-pagan': 890,
  gothic: 678,
  grindcore: 456,
  groove: 789,
  heavy: 4567,
  'metalcore-deathcore': 2345,
  power: 1234,
  progressive: 987,
  speed: 345,
  symphonic: 567,
  thrash: 3456
})

// Примеры групп для каждого жанра
const exampleBands: Record<string, string[]> = {
  black: ['Mayhem', 'Burzum', 'Darkthrone', 'Emperor', 'Immortal'],
  death: ['Death', 'Cannibal Corpse', 'Morbid Angel', 'Obituary', 'Deicide'],
  'doom-stoner-sludge': ['Black Sabbath', 'Candlemass', 'Sleep', 'Electric Wizard', 'Saint Vitus'],
  'electronic-industrial': ['Rammstein', 'Nine Inch Nails', 'Ministry', 'KMFDM', 'Fear Factory'],
  'experimental-avantgarde': ['Mr. Bungle', 'Fantômas', 'Arcturus', 'Diablo Swing Orchestra'],
  'folk-viking-pagan': ['Amon Amarth', 'Ensiferum', 'Eluveitie', 'Turisas', 'Finntroll'],
  gothic: ['Type O Negative', 'Paradise Lost', 'Moonspell', 'Tiamat', 'Lacuna Coil'],
  grindcore: ['Napalm Death', 'Carcass', 'Brutal Truth', 'Pig Destroyer', 'Terrorizer'],
  groove: ['Pantera', 'Lamb of God', 'Machine Head', 'Sepultura', 'Exhorder'],
  heavy: ['Iron Maiden', 'Judas Priest', 'Dio', 'Saxon', 'Accept'],
  'metalcore-deathcore': ['Killswitch Engage', 'As I Lay Dying', 'Parkway Drive', 'August Burns Red'],
  power: ['Helloween', 'Blind Guardian', 'Gamma Ray', 'Stratovarius', 'Rhapsody'],
  progressive: ['Dream Theater', 'Opeth', 'Tool', 'Porcupine Tree', 'Mastodon'],
  speed: ['Motörhead', 'Exciter', 'Anvil', 'Raven', 'Agent Steel'],
  symphonic: ['Nightwish', 'Epica', 'Within Temptation', 'Therion', 'Dimmu Borgir'],
  thrash: ['Metallica', 'Megadeth', 'Slayer', 'Anthrax', 'Testament']
}

// Моковые данные для групп по жанрам
const bandsData = ref([
  {
    id: '1',
    name: 'Metallica',
    genre: 'thrash',
    country: 'USA',
    formedIn: 1981,
    rating: 4.8,
    topAlbum: 'Master of Puppets'
  },
  {
    id: '2',
    name: 'Megadeth',
    genre: 'thrash',
    country: 'USA',
    formedIn: 1983,
    rating: 4.5,
    topAlbum: 'Rust in Peace'
  },
  { id: '3', name: 'Slayer', genre: 'thrash', country: 'USA', formedIn: 1981, rating: 4.4, topAlbum: 'Reign in Blood' },
  {
    id: '4',
    name: 'Anthrax',
    genre: 'thrash',
    country: 'USA',
    formedIn: 1981,
    rating: 4.2,
    topAlbum: 'Among the Living'
  },
  { id: '5', name: 'Testament', genre: 'thrash', country: 'USA', formedIn: 1983, rating: 4.3, topAlbum: 'The Legacy' },
  { id: '6', name: 'Death', genre: 'death', country: 'USA', formedIn: 1983, rating: 4.7, topAlbum: 'Symbolic' },
  {
    id: '7',
    name: 'Cannibal Corpse',
    genre: 'death',
    country: 'USA',
    formedIn: 1988,
    rating: 4.2,
    topAlbum: 'Tomb of the Mutilated'
  },
  {
    id: '8',
    name: 'Morbid Angel',
    genre: 'death',
    country: 'USA',
    formedIn: 1983,
    rating: 4.4,
    topAlbum: 'Altars of Madness'
  },
  {
    id: '9',
    name: 'Iron Maiden',
    genre: 'heavy',
    country: 'UK',
    formedIn: 1975,
    rating: 4.9,
    topAlbum: 'The Number of the Beast'
  },
  { id: '10', name: 'Black Sabbath', genre: 'heavy', country: 'UK', formedIn: 1968, rating: 4.8, topAlbum: 'Paranoid' }
])

// Группы для выбранного жанра
const genreBands = computed(() => {
  if (!selectedGenre.value) return []

  isLoading.value = true

  setTimeout(() => {
    isLoading.value = false
  }, 300)

  return bandsData.value.filter(band => band.genre === selectedGenre.value?.id)
})

// Методы
const getBandCount = (genre: Genre): number => {
  return bandsPerGenre.value[genre.id] || 0
}

const getExampleBands = (genre: Genre): string[] => {
  return exampleBands[genre.id]?.slice(0, 3) || []
}

const getFlagEmoji = (country: string): string => {
  const flags: Record<string, string> = {
    USA: '🇺🇸',
    UK: '🇬🇧',
    Sweden: '🇸🇪',
    Germany: '🇩🇪',
    Finland: '🇫🇮',
    Norway: '🇳🇴',
    France: '🇫🇷'
  }

  return flags[country] || '🏴'
}

const selectGenre = (genre: Genre) => {
  selectedGenre.value = genre
  isLoading.value = true
}

const clearSelection = () => {
  selectedGenre.value = null
}

const goToBand = (id: string) => {
  router.push(`/band/${id}`)
}
</script>
