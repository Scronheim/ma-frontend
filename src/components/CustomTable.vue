<script setup lang="ts">
import { SearchBandByResult } from '@/types'
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    bands: SearchBandByResult[]
  }>(),
  {
    bands: []
  }
)

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

</script>

<template>
  <div v-if="bands.length" class="flex flex-col md:flex-row md:items-center justify-between bg-gray-750 my-2">
    <div class="text-gray-400 mb-4 md:mb-0">{{ total }} результатов</div>

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
</template>
