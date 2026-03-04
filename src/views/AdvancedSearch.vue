<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import qs from 'qs'

import { useStore } from '@/store/store'

import { bandStatuses, countries, releaseTypes, releaseFormats } from '@/utils'

import TextInput from '@/components/inputs/TextInput.vue'
import SelectInput from '@/components/inputs/SelectInput.vue'
import CustomButton from '@/components/inputs/CustomButton.vue'

import type { SearchAlbumResult, SearchBandResult } from '@/types'

interface BandSearchForm {
  bandName: string
  exactBandMatch?: number
  genre?: string
  country?: string
  yearCreationFrom?: string
  yearCreationTo?: string
  status?: string
  themes?: string
  city?: string
  bandLabelName?: string
  indieLabel?: number
  bandNotes?: string
}
interface AlbumSearchForm {
  bandName: string
  exactBandMatch?: number
  exactReleaseMatch?: number
  releaseTitle?: string
  releaseYearFrom?: string
  releaseMonthFrom?: string
  releaseYearTo?: string
  releaseMonthTo?: string
  releaseCatalogNumber?: string
  releaseIdentifiers?: string
  releaseRecordingInfo?: string
  releaseDescription?: string
  releaseNotes?: string
  releaseFormat?: string
  releaseType?: string
  genre?: string
  country?: string
  location?: string
  releaseLabelName?: string
  indieLabel?: number
}
interface SongSearchForm {
  bandName: string
  exactBandMatch?: number
  songTitle: string
  exactSongMatch?: number
  releaseTitle: string
  exactReleaseMatch?: number
  lyrics?: string
  genre?: string
  releaseType?: string
}

const router = useRouter()
const store = useStore()

const bandForm = ref<BandSearchForm>({
  country: ''
})
const albumForm = ref<AlbumSearchForm>({
  country: ''
})
const songForm = ref<SongSearchForm>({})
const multipleCountry = ref<boolean>(false)
const multipleStatus = ref<boolean>(false)
const multipleReleaseType = ref<boolean>(false)
const multipleReleaseFormat = ref<boolean>(false)
const activeTab = ref<string>('bands')
const tabs = computed(() => [
  { id: 'bands', label: 'Поиск групп' },
  { id: 'albums', label: 'Поиск альбомов' },
  { id: 'songs', label: 'Поиск треков' }
])

const emit = defineEmits<{
  (e: 'search', params: BandSearchForm): void
}>()

const searchResults = ref<SearchBandResult[] | SearchAlbumResult[] | SongSearchForm[]>([])
const currentPage = ref(1)
const pageSize = ref(25)
const total = ref(0)
const isLoading = ref(false)

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return searchResults.value.slice(start, end)
})
const visiblePages = computed(() => {
  const pages: number[] = []
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

const performSearch = async () => {
  try {
    let result
    isLoading.value = true
    switch (activeTab.value) {
      case 'bands':
        result = await store.advancedBandSearch(
          qs.stringify(
            { ...bandForm.value, page: currentPage.value },
            {
              indices: false,
              arrayFormat: 'brackets'
            }
          )
        )
        break
      case 'albums':
        result = await store.advancedAlbumSearch(
          qs.stringify(
            { ...albumForm.value, page: currentPage.value },
            {
              indices: false,
              arrayFormat: 'brackets'
            }
          )
        )
        break
      case 'songs':
        result = await store.advancedSongSearch(
          qs.stringify(
            { ...songForm.value, page: currentPage.value },
            {
              indices: false,
              arrayFormat: 'brackets'
            }
          )
        )
        break
    }

    total.value = result.data.total
    searchResults.value = result.data.results
  } finally {
    isLoading.value = false
  }
}

const changeTab = (tabName: string) => {
  activeTab.value = tabName
  searchResults.value = []
}

const goToBand = (band: SearchBandResult) => {
  router.push(`/bands/${band.name_slug}/${band.id}`)
}
const previousPage = async () => {
  if (currentPage.value > 1) {
    try {
      currentPage.value--
      await performSearch()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      isLoading.value = false
    }
  }
}

const nextPage = async () => {
  if (currentPage.value < totalPages.value) {
    try {
      currentPage.value++
      await performSearch()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      isLoading.value = false
    }
  }
}

const goToPage = async (page: number) => {
  try {
    currentPage.value = page
    await performSearch()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="space-y-3">
    <!-- Информационные подсказки -->
    <div class="bg-blue-900 bg-opacity-20 border border-blue-800 rounded-lg p-4 text-sm text-blue-200">
      <h3 class="font-bold mb-2 flex items-center">
        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          />
        </svg>
        Советы для поиска
      </h3>
      <p class="mb-1">• Что бы искать по части слова, используй * (например, введя "hel*" будут так же найдены результаты для "hell" или "helm")</p>
      <p>• Используй "-" что бы исключить слова (например, "death -melodic" исключит melodic)</p>
    </div>
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
    <template v-if="activeTab === 'bands'">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-4">
        <!-- Band name - левая колонка -->
        <div>
          <label class="block text-gray-300 font-medium">Название:</label>
          <TextInput :model-value="bandForm.bandName" @update:model-value="bandForm.bandName = $event" placeholder="Введите название группы" />

          <div class="flex items-center">
            <el-checkbox v-model.number="bandForm.exactBandMatch" :false-value="0" :true-value="1" label="Точное совпадение" />
          </div>
        </div>

        <!-- Genre - правая колонка -->
        <div>
          <label class="block text-gray-300 font-medium">Жанр:</label>
          <TextInput :model-value="bandForm.genre" @update:model-value="bandForm.genre = $event" placeholder="Введите название жанра" />
        </div>

        <!-- Country - левая колонка -->
        <div>
          <label class="block text-gray-300 font-medium">
            Страна:
            <el-text type="danger" class="cursor-pointer" @click="multipleCountry = !multipleCountry">
              {{ multipleCountry ? '[одна]' : '[несколько]' }}
            </el-text>
          </label>
          <SelectInput :model-value="bandForm.country" :items="countries" :multiple="multipleCountry" @update:model-value="bandForm.country = $event" />
        </div>

        <!-- Year of formation - правая колонка -->
        <div>
          <label class="block text-gray-300 font-medium">Годы формирования:</label>
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <TextInput :model-value="bandForm.yearCreationFrom" @update:model-value="bandForm.yearCreationFrom = $event" placeholder="С" />
            </div>
            <div class="flex-1">
              <TextInput :model-value="bandForm.yearCreationTo" @update:model-value="bandForm.yearCreationTo = $event" placeholder="По" />
            </div>
          </div>
        </div>

        <!-- Status - левая колонка -->
        <div>
          <label class="block text-gray-300 font-medium">
            Статус:
            <el-text type="danger" class="cursor-pointer" @click="multipleStatus = !multipleStatus">
              {{ multipleStatus ? '[один]' : '[несколько]' }}
            </el-text>
          </label>
          <SelectInput :model-value="bandForm.status" :items="bandStatuses" :multiple="multipleStatus" @update:model-value="bandForm.status = $event" />
        </div>

        <!-- Themes - правая колонка -->
        <div>
          <label class="block text-gray-300 font-medium">Темы текстов:</label>
          <TextInput :model-value="bandForm.themes" @update:model-value="bandForm.themes = $event" />
        </div>

        <!-- City/state - левая колонка -->
        <div>
          <label class="block text-gray-300 font-medium">Город/штат/провинция:</label>
          <TextInput :model-value="bandForm.city" @update:model-value="bandForm.city = $event" />
        </div>

        <!-- Label - правая колонка -->
        <div>
          <label class="block text-gray-300 font-medium">Лейбл:</label>
          <TextInput :model-value="bandForm.bandLabelName" @update:model-value="bandForm.bandLabelName = $event" />
          <div class="flex items-center mt-2">
            <el-checkbox v-model.number="bandForm.indieLabel" :false-value="0" :true-value="1" label="Инди?" />
          </div>
        </div>
      </div>

      <!-- Additional notes - на всю ширину внизу -->
      <div class="col-span-2">
        <label class="block text-gray-300 font-medium">Дополнительные заметки:</label>
        <TextInput :model-value="bandForm.bandNotes" @update:model-value="bandForm.bandNotes = $event" />
      </div>
    </template>
    <template v-else-if="activeTab === 'albums'">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-4">
        <!-- Band name - левая колонка -->
        <div>
          <label class="block text-gray-300 font-medium">Название группы:</label>
          <TextInput :model-value="albumForm.bandName" @update:model-value="albumForm.bandName = $event" placeholder="Введите название группы" />

          <div class="flex items-center">
            <el-checkbox v-model.number="albumForm.exactBandMatch" :false-value="0" :true-value="1" label="Точное совпадение" />
          </div>
        </div>

        <!-- Release title - правая колонка -->
        <div>
          <label class="block text-gray-300 font-medium">Название альбома:</label>
          <TextInput :model-value="albumForm.releaseTitle" @update:model-value="albumForm.releaseTitle = $event" placeholder="Введите название альбома" />

          <div class="flex items-center">
            <el-checkbox v-model.number="albumForm.exactReleaseMatch" :false-value="0" :true-value="1" label="Точное совпадение" />
          </div>
        </div>

        <!-- Release type - на всю ширину -->
        <div>
          <label class="block text-gray-300 font-medium">
            Тип релиза:
            <el-text type="danger" class="cursor-pointer" @click="multipleReleaseType = !multipleReleaseType">
              {{ multipleReleaseType ? '[один]' : '[несколько]' }}
            </el-text>
          </label>
          <SelectInput :model-value="albumForm.releaseType" :items="releaseTypes" :multiple="multipleReleaseType" @update:model-value="albumForm.releaseType = $event" />
        </div>

        <!-- Format - на всю ширину -->
        <div>
          <label class="block text-gray-300 font-medium">
            Формат:
            <el-text type="danger" class="cursor-pointer" @click="multipleReleaseFormat = !multipleReleaseFormat">
              {{ multipleReleaseFormat ? '[один]' : '[несколько]' }}
            </el-text>
          </label>
          <SelectInput :model-value="albumForm.releaseFormat" :items="releaseFormats" :multiple="multipleReleaseFormat" @update:model-value="albumForm.releaseFormat = $event" />
        </div>

        <!-- Year/month - левая колонка -->
        <div>
          <label class="block text-gray-300 font-medium">Год/месяц (ГГГГ/ММ):</label>
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex gap-2">
              <TextInput :model-value="albumForm.releaseYearFrom" @update:model-value="albumForm.releaseYearFrom = $event" placeholder="С" />
              <TextInput :model-value="albumForm.releaseMonthFrom" @update:model-value="albumForm.releaseMonthFrom = $event" placeholder="С" />
            </div>
            <div class="flex gap-2">
              <TextInput :model-value="albumForm.releaseYearTo" @update:model-value="albumForm.releaseYearTo = $event" placeholder="По" />
              <TextInput :model-value="albumForm.releaseMonthTo" @update:model-value="albumForm.releaseMonthTo = $event" placeholder="По" />
            </div>
          </div>
        </div>

        <!-- Country - правая колонка -->
        <div>
          <label class="block text-gray-300 font-medium">
            Страна:
            <el-text type="danger" class="cursor-pointer" @click="multipleCountry = !multipleCountry">
              {{ multipleCountry ? '[одна]' : '[несколько]' }}
            </el-text>
          </label>
          <SelectInput :model-value="albumForm.country" :items="countries" :multiple="multipleCountry" @update:model-value="albumForm.country = $event" />
        </div>

        <!-- City/state - левая колонка -->
        <div>
          <label class="block text-gray-300 font-medium">Город/штат/провинция:</label>
          <TextInput :model-value="albumForm.location" @update:model-value="albumForm.location = $event" />
        </div>

        <!-- Catalog number - левая колонка -->
        <div>
          <label class="block text-gray-300 font-medium">№ в каталоге:</label>
          <TextInput :model-value="albumForm.releaseCatalogNumber" @update:model-value="albumForm.releaseCatalogNumber = $event" />
        </div>

        <!-- Identifier - правая колонка -->
        <div>
          <label class="block text-gray-300 font-medium">Идентификатор:</label>
          <TextInput :model-value="albumForm.releaseIdentifiers" @update:model-value="albumForm.releaseIdentifiers = $event" placeholder="barcode, matrix, etc." />
        </div>

        <!-- Recording info - левая колонка -->
        <div>
          <label class="block text-gray-300 font-medium">Информация о записи:</label>
          <TextInput :model-value="albumForm.releaseRecordingInfo" @update:model-value="albumForm.releaseRecordingInfo = $event" placeholder="studio, city, etc." />
        </div>

        <!-- Version description - правая колонка -->
        <div>
          <label class="block text-gray-300 font-medium">Описание версии:</label>
          <TextInput :model-value="albumForm.releaseDescription" @update:model-value="albumForm.releaseDescription = $event" placeholder="country, digipak, etc." />
        </div>

        <!-- Label - правая колонка -->
        <div>
          <label class="block text-gray-300 font-medium">Лейбл:</label>
          <TextInput :model-value="albumForm.releaseLabelName" @update:model-value="albumForm.releaseLabelName = $event" />
          <div class="flex items-center mt-2">
            <el-checkbox v-model.number="albumForm.indieLabel" :false-value="0" :true-value="1" label="Инди?" />
          </div>
        </div>
      </div>

      <!-- Additional notes - на всю ширину -->
      <div class="space-y-2">
        <label class="block text-gray-300 font-medium">Дополнительные заметки:</label>
        <TextInput :model-value="albumForm.releaseNotes" @update:model-value="albumForm.releaseNotes = $event" />
      </div>
    </template>
    <template v-else-if="activeTab === 'songs'">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-4">
        <!-- Song title - левая колонка -->
        <div>
          <label class="block text-gray-300 font-medium">Название трека:</label>
          <TextInput :model-value="songForm.songTitle" @update:model-value="songForm.songTitle = $event" />

          <div class="flex items-center">
            <el-checkbox v-model.number="songForm.exactSongMatch" :false-value="0" :true-value="1" label="Точное совпадение" />
          </div>
        </div>

        <!-- Band name - правая колонка -->
        <div>
          <label class="block text-gray-300 font-medium">Название группы:</label>
          <TextInput :model-value="songForm.bandName" @update:model-value="songForm.bandName = $event" />

          <div class="flex items-center">
            <el-checkbox v-model.number="songForm.exactBandMatch" :false-value="0" :true-value="1" label="Точное совпадение" />
          </div>
        </div>

        <!-- Release title - левая колонка -->
        <div>
          <label class="block text-gray-300 font-medium">Название альбома:</label>
          <TextInput :model-value="songForm.releaseTitle" @update:model-value="songForm.releaseTitle = $event" />

          <div class="flex items-center">
            <el-checkbox v-model.number="songForm.exactReleaseMatch" :false-value="0" :true-value="1" label="Точное совпадение" />
          </div>
        </div>
        <div>
          <label class="block text-gray-300 font-medium">
            Тип релиза:
            <el-text type="danger" class="cursor-pointer" @click="multipleReleaseType = !multipleReleaseType">
              {{ multipleReleaseType ? '[один]' : '[несколько]' }}
            </el-text>
          </label>
          <SelectInput :model-value="songForm.releaseType" :items="releaseTypes" :multiple="multipleReleaseType" @update:model-value="songForm.releaseType = $event" />
        </div>

        <!-- Genre - правая колонка -->
        <div>
          <label class="block text-gray-300 font-medium">Жанр:</label>
          <TextInput :model-value="songForm.genre" @update:model-value="songForm.genre = $event" />
        </div>
        <div>
          <label class="block text-gray-300 font-medium">Lyrics:</label>
          <TextInput :model-value="songForm.lyrics" @update:model-value="songForm.lyrics = $event" />
        </div>
      </div>
    </template>

    <!-- Submit button -->
    <div class="flex justify-end">
      <CustomButton text="Искать" :loading="isLoading" @click="performSearch" />
    </div>

    <template v-if="searchResults.length">
      <div class="flex flex-col md:flex-row md:items-center justify-between bg-gray-750">
        <div class="text-gray-400 mb-4 md:mb-0">{{ total }} результатов</div>

        <div class="flex items-center justify-center space-x-2">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="px-3 py-2 bg-gray-700 text-white rounded-lg"
            :class="[currentPage === 1 ? 'cursor-not-allowed ' : 'cursor-pointer hover:bg-red-700']"
          >
            <Icon icon="mdi:arrow-left" />
          </button>

          <div class="flex space-x-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :class="['w-8 h-8 rounded flex items-center justify-center cursor-pointer', page === currentPage ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600']"
            >
              {{ page }}
            </button>
            <span v-if="hasMorePages" class="px-2 flex items-center">...</span>
          </div>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 bg-gray-700 text-white rounded-lg"
            :class="[currentPage === totalPages ? 'cursor-not-allowed ' : 'cursor-pointer hover:bg-red-700']"
          >
            <Icon icon="mdi:arrow-right" />
          </button>
        </div>
      </div>
      <table v-if="activeTab === 'bands'" class="w-full">
        <thead>
          <tr class="bg-gray-750 border-b border-gray-700">
            <th class="text-left py-2 font-semibold text-gray-300 uppercase tracking-wider">Группа</th>
            <th class="text-left py-2 font-semibold text-gray-300 uppercase tracking-wider">Жанр</th>
            <th class="text-left py-2 font-semibold text-gray-300 uppercase tracking-wider">Страна</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          <tr v-for="result in paginatedResults" :key="result.id" class="hover:bg-gray-750 transition-colors duration-150 group">
            <td class="py-2">
              <RouterLink class="font-medium" :to="`/bands/${result.name_slug}/${result.id}`">{{ result.name }}</RouterLink>
            </td>
            <td class="py-2">
              <div class="flex flex-wrap gap-1">
                <span class="px-2 py-1 bg-gray-700 rounded text-xs">
                  {{ result.genres }}
                </span>
              </div>
            </td>
            <td class="py-2">
              {{ result.country }}
            </td>
          </tr>
        </tbody>
      </table>
      <table v-else-if="activeTab === 'albums'" class="w-full">
        <thead>
          <tr class="bg-gray-750 border-b border-gray-700">
            <th class="text-left py-2 font-semibold text-gray-300 uppercase tracking-wider">Группа</th>
            <th class="text-left py-2 font-semibold text-gray-300 uppercase tracking-wider">Альбом</th>
            <th class="text-left py-2 font-semibold text-gray-300 uppercase tracking-wider">Тип</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          <tr v-for="result in paginatedResults" :key="result.id" class="hover:bg-gray-750 transition-colors duration-150 group">
            <td class="py-2">
              <div class="font-medium break-all">
                <RouterLink class="font-medium" :to="`/bands/${result.band_name_slug}/${result.band_id}`">{{ result.band_name }}</RouterLink>
              </div>
            </td>
            <td class="py-2">
              <div class="font-medium break-all">
                <RouterLink class="font-medium" :to="`/albums/${result.band_name_slug}/${result.title_slug}/${result.id}`">{{ result.title }}</RouterLink>
              </div>
            </td>
            <td class="py-2">
              {{ result.type }}
            </td>
          </tr>
        </tbody>
      </table>
      <table v-else-if="activeTab === 'songs'" class="w-full">
        <thead>
          <tr class="bg-gray-750 border-b border-gray-700">
            <th class="text-left py-2 font-semibold text-gray-300 uppercase tracking-wider">Группа</th>
            <th class="text-left py-2 font-semibold text-gray-300 uppercase tracking-wider">Альбом</th>
            <th class="text-left py-2 font-semibold text-gray-300 uppercase tracking-wider">Трек</th>
            <th class="text-left py-2 font-semibold text-gray-300 uppercase tracking-wider">Тип</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          <tr v-for="result in paginatedResults" :key="result.id" class="hover:bg-gray-750 transition-colors duration-150 group">
            <td class="py-2">
              <div class="font-medium break-all">
                <RouterLink class="font-medium" :to="`/bands/${result.band_name_slug}/${result.band_id}`">{{ result.band_name }}</RouterLink>
              </div>
            </td>
            <td class="py-2">
              <div class="font-medium break-all">
                <RouterLink class="font-medium" :to="`/albums/${result.band_name_slug}/${result.album_title_slug}/${result.album_id}`">{{ result.album_title }}</RouterLink>
              </div>
            </td>
            <td class="py-2">
              <div class="font-medium break-all">{{ result.title }}</div>
            </td>
            <td class="py-2">
              {{ result.type }}
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>
