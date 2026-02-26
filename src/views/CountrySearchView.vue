<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

import { useStore } from '@/store/store'

import TextInput from '@/components/inputs/TextInput.vue'

import { countries } from '@/utils'

import type { Country, SearchBandByResult } from '@/types'

const router = useRouter()

const store = useStore()

// Состояние
const searchQuery = ref('')
const selectedCountry = ref<Country>({})
const isLoading = ref(false)
const activeCollapse = ref('countries')
const currentPage = ref(1)
const pageSize = ref(500)
const total = ref(0)

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
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

const bands = ref<SearchBandByResult[]>([])

// Фильтрация и сортировка стран
const filteredCountries = computed(() => {
  let filtered = countries.filter(
    country =>
      country.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      country.nameEn.toLowerCase().includes(searchQuery.value.toLowerCase())
  )

  return filtered
})

const selectCountry = async (country: Country) => {
  try {
    activeCollapse.value = ''
    selectedCountry.value = country
    isLoading.value = true
    const { data } = await store.getBandByCountry(selectedCountry.value.code, currentPage.value)
    bands.value = data.results
    total.value = data.total
  } finally {
    isLoading.value = false
  }
}
const goToBand = (band: SearchBandByResult) => {
  router.push(`/bands/${band.name_slug}/${band.id}`)
}
const previousPage = async () => {
  if (currentPage.value > 1) {
    try {
      currentPage.value--
      isLoading.value = true
      const { data } = await store.getBandByCountry(selectedCountry.value.code, currentPage.value)
      bands.value = data.results
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
      isLoading.value = true
      const { data } = await store.getBandByCountry(selectedCountry.value.code, currentPage.value)
      bands.value = data.results
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      isLoading.value = false
    }
  }
}

const goToPage = async (page: number) => {
  try {
    currentPage.value = page
    isLoading.value = true
    const { data } = await store.getBandByCountry(selectedCountry.value.code, currentPage.value)
    bands.value = data.results
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  activeCollapse.value = ''
})
</script>

<template>
  <div>
    <!-- Поиск по странам -->
    <div class="bg-gray-800 rounded-lg border border-gray-700 p-3 mb-3">
      <div class="flex items-center mb-2">
        <TextInput
          placeholder="Введите название страны"
          :model-value="searchQuery"
          @update:model-value="searchQuery = $event"
          class="w-full py-2"
        />
      </div>
      <el-collapse v-model="activeCollapse">
        <el-collapse-item title="Страны" name="countries">
          <!-- Сетка стран -->
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-y-auto"
            style="max-height: 80vh"
          >
            <div
              v-for="country in filteredCountries"
              :key="country.code"
              class="bg-gray-750 rounded-lg p-1 hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
              @click="selectCountry(country)"
            >
              <div class="flex items-start space-x-3">
                <div class="flex-1">
                  <h3 class="font-bold text-white">{{ country.name }}</h3>
                </div>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- Результаты для выбранной страны -->
    <div v-if="selectedCountry?.code" class="bg-gray-800 rounded-lg border border-gray-700 p-3">
      <h2 class="text-2xl font-bold text-white">{{ selectedCountry.name }}</h2>

      <!-- Состояние загрузки -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Список групп -->
      <div v-else-if="bands.length > 0">
        <div v-if="selectedCountry" class="flex flex-col md:flex-row md:items-center justify-between bg-gray-750">
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
                :class="[
                  'w-8 h-8 rounded flex items-center justify-center cursor-pointer',
                  page === currentPage ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600'
                ]"
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
        <div class="overflow-y-auto" style="max-height: 66vh">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-750 border-b border-gray-700 bg-gray-800 sticky top-0">
                <th class="text-left py-4 px-6 font-semibold text-gray-300 uppercase tracking-wider">Название</th>
                <th class="text-left py-4 px-6 font-semibold text-gray-300 uppercase tracking-wider">Страна</th>
                <th class="text-left py-4 px-6 font-semibold text-gray-300 uppercase tracking-wider">Жанр</th>
                <th class="text-left py-4 px-6 font-semibold text-gray-300 uppercase tracking-wider">Статус</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr
                v-for="result in bands"
                :key="result.id"
                class="hover:bg-gray-750 transition-colors duration-150 cursor-pointer"
                @click="goToBand(result)"
              >
                <td class="py-2 px-4">
                  <div class="flex items-center">
                    <div class="font-medium">{{ result.name }}</div>
                  </div>
                </td>
                <td class="py-2 px-4">
                  <div class="flex flex-wrap gap-1">
                    <span class="px-2 py-1 bg-gray-700 rounded text-xs">
                      {{ result.country }}
                    </span>
                  </div>
                </td>
                <td class="py-2 px-4">
                  {{ result.genres }}
                </td>
                <td class="py-2 px-4">
                  {{ result.status }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Пустое состояние -->
      <div v-else class="text-center py-12">
        <p class="text-gray-400">No bands found from {{ selectedCountry.name }}</p>
      </div>
    </div>
  </div>
</template>
