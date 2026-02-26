<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

import { useStore } from '@/store/store'

import type { SearchBandByResult } from '@/types'

const router = useRouter()

const store = useStore()

// Алфавит
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

// Состояние
const selectedLetter = ref<string>('')
const isLoading = ref(false)
const currentPage = ref(1)
const pageSize = ref(500)
const total = ref(0)

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
const startIndex = computed(() => (currentPage.value - 1) * pageSize.value)
const endIndex = computed(() => Math.min(startIndex.value + pageSize.value, foundedBands.value.length))
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
const foundedBands = ref<SearchBandByResult[]>([])

// Методы
const selectLetter = async (letter: string) => {
  try {
    selectedLetter.value = letter
    isLoading.value = true
    const { data } = await store.getBandByLetter(letter)
    foundedBands.value = data.results
    total.value = data.total
  } finally {
    isLoading.value = false
  }
}

const selectNumber = async () => {
  try {
    selectedLetter.value = '#'
    isLoading.value = true
    const { data } = await store.getBandByLetter('NBR', currentPage.value)
    foundedBands.value = data.results
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    isLoading.value = false
  }
}
const selectSymbol = async () => {
  try {
    selectedLetter.value = '~'
    isLoading.value = true
    const { data } = await store.getBandByLetter('~', currentPage.value)
    foundedBands.value = data.results
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
      const { data } = await store.getBandByLetter(selectedLetter.value, currentPage.value)
      foundedBands.value = data.results
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
      const { data } = await store.getBandByLetter(selectedLetter.value, currentPage.value)
      foundedBands.value = data.results
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
    const { data } = await store.getBandByLetter(selectedLetter.value, currentPage.value)
    foundedBands.value = data.results
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    isLoading.value = false
  }
}

// Сброс загрузки при монтировании
watch(selectedLetter, () => {
  if (selectedLetter.value) {
    isLoading.value = true
  }
})
</script>

<template>
  <div class="space-y-3">
    <!-- Алфавитные кнопки -->
    <div class="bg-gray-800 rounded-lg border border-gray-700 p-4">
      <div class="flex flex-wrap justify-center gap-2">
        <button
          v-for="letter in letters"
          :key="letter"
          @click="selectLetter(letter)"
          class="w-8 h-8 flex items-center justify-center font-bold text-lg rounded-lg transition-all duration-200 cursor-pointer"
          :class="[
            selectedLetter === letter
              ? 'bg-red-600 text-white scale-110 shadow-lg'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white hover:scale-105'
          ]"
        >
          {{ letter }}
        </button>
        <button
          @click="selectNumber"
          class="w-8 h-8 flex items-center justify-center font-bold text-xl rounded-lg transition-all duration-200 cursor-pointer"
          :class="[
            selectedLetter === '#'
              ? 'bg-red-600 text-white scale-110 shadow-lg'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white hover:scale-105'
          ]"
        >
          #
        </button>
        <button
          @click="selectSymbol"
          class="w-8 h-8 flex items-center justify-center font-bold text-xl rounded-lg transition-all duration-200 cursor-pointer"
          :class="[
            selectedLetter === '~'
              ? 'bg-red-600 text-white scale-110 shadow-lg'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white hover:scale-105'
          ]"
        >
          ~
        </button>
      </div>
    </div>
    <div v-if="selectedLetter" class="flex flex-col md:flex-row md:items-center justify-between bg-gray-750">
      <div class="text-gray-400 mb-4 md:mb-0">
        Показано {{ startIndex + 1 }}-{{ endIndex }} из {{ total }} результатов
      </div>

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
              'w-8 h-8 rounded flex items-center justify-center',
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
    <!-- Результаты -->
    <div v-if="selectedLetter" class="bg-gray-800 rounded-lg border border-gray-700 p-3">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-red-400">
          Группы начинающееся на "{{ selectedLetter }}"
          <span class="text-sm text-gray-400 ml-2">({{ foundedBands.length }})</span>
        </h2>
      </div>

      <!-- Состояние загрузки -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Результаты в виде таблицы -->
      <div v-else-if="foundedBands.length > 0" style="height: 70vh; overflow-y: auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-750 border-b border-gray-700">
              <th class="text-left py-4 px-6 font-semibold text-gray-300 uppercase tracking-wider">Название</th>
              <th class="text-left py-4 px-6 font-semibold text-gray-300 uppercase tracking-wider">Страна</th>
              <th class="text-left py-4 px-6 font-semibold text-gray-300 uppercase tracking-wider">Жанр</th>
              <th class="text-left py-4 px-6 font-semibold text-gray-300 uppercase tracking-wider">Статус</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr
              v-for="result in foundedBands"
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

      <!-- Пустое состояние -->
      <div v-else class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p class="text-gray-400">Групп, начинающихся на "{{ selectedLetter }} не найдено"</p>
      </div>
    </div>
  </div>
</template>
