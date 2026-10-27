<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'
import { debounce } from 'lodash-es'

import { useStore } from '@/store/store'
import DateNormalizer from '@/utils/dateNormalizer'

import LoadingSpinner from '@/components/LoadingSpinner.vue'

import type { UpcomingRelease } from '@/types'

const store = useStore()

const upcomingReleases = ref<UpcomingRelease[]>([])
const isLoading = ref(true)
const currentPage = ref(1)
const pageSize = ref(100)
const total = ref(0)

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
const startIndex = computed(() => (currentPage.value - 1) * pageSize.value)
const endIndex = computed(() => Math.min(startIndex.value + pageSize.value, upcomingReleases.value.length))
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

const loadUpcomingReleases = async () => {
  try {
    isLoading.value = true
    const { data } = await store.getUpcomingReleases(currentPage.value)
    upcomingReleases.value = data.results
    total.value = data.total
  } finally {
    isLoading.value = false
  }
}

const handleInputYear = debounce(loadUpcomingReleases, 1000)

const previousPage = async () => {
  if (currentPage.value > 1) {
    try {
      currentPage.value--
      await loadUpcomingReleases()
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
      await loadUpcomingReleases()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      isLoading.value = false
    }
  }
}

const goToPage = async (page: number) => {
  try {
    currentPage.value = page
    await loadUpcomingReleases()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadUpcomingReleases()
})
</script>

<template>
  <LoadingSpinner v-if="isLoading" :visible="isLoading" />
  <template v-else>
    <div class="flex flex-col md:flex-row md:items-center justify-between bg-gray-750 mb-3">
      <div class="text-gray-400 mb-4 md:mb-0">{{ total }} результатов</div>

      <div class="flex items-center justify-center space-x-2">
        <el-button
          :icon="ArrowLeftBold"
          @click="previousPage"
          :disabled="currentPage === 1"
          :class="['px-3 py-1 rounded border border-gray-700 transition-colors duration-200', currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700']"
        />

        <div class="flex space-x-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="['w-8 h-8 rounded flex items-center justify-center', page === currentPage ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600']"
          >
            {{ page }}
          </button>
          <span v-if="hasMorePages" class="px-2 flex items-center">...</span>
        </div>
        <el-button
          :icon="ArrowRightBold"
          @click="nextPage"
          :disabled="currentPage === totalPages"
          :class="['px-3 py-1 rounded border border-gray-700 transition-colors duration-200', currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700']"
        />
      </div>
    </div>
    <div style="height: 86vh; overflow-y: auto">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-750 border-b border-gray-700">
            <th class="text-left py-4 font-semibold text-gray-300 uppercase tracking-wider">Группа</th>
            <th class="text-left py-4 px-4 font-semibold text-gray-300 uppercase tracking-wider">Альбом</th>
            <th class="text-left py-4 px-4 font-semibold text-gray-300 uppercase tracking-wider">Тип</th>
            <th class="text-left py-4 px-4 font-semibold text-gray-300 uppercase tracking-wider">Жанр</th>
            <th class="text-left py-4 px-4 font-semibold text-gray-300 uppercase tracking-wider">Дата выхода</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          <tr v-for="result in upcomingReleases" :key="result.album_id" class="hover:bg-gray-750 transition-colors duration-150">
            <td class="py-2">
              <div class="flex items-center">
                <div class="font-medium">
                  <RouterLink :to="`/bands/${result.band_name_slug}/${result.band_id}`" class="text-blue-400 font-bold">
                    {{ result.band_name }}
                  </RouterLink>
                </div>
              </div>
            </td>
            <td class="py-2 px-4">
              <div class="flex items-center">
                <div class="font-medium">
                  <RouterLink :to="`/album/${result.album_name_slug}/${result.album_id}`" class="text-blue-400 font-bold">
                    {{ result.album_name }}
                  </RouterLink>
                </div>
              </div>
            </td>
            <td class="">
              {{ result.album_type }}
            </td>
            <td class="py-2 px-4">
              {{ result.genres }}
            </td>
            <td class="py-2 px-4" style="min-width: 200px">
              {{ result.release_date }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
</template>
