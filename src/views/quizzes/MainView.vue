<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import QuizCard from '@/components/QuizCard.vue'

import { useStore } from '@/store/store'

import type { Quiz, QuizCategory, QuizDifficulty } from '@/types'

const router = useRouter()

const store = useStore()

const searchQuery = ref('')
const selectedCategory = ref<QuizCategory | ''>('')
const selectedDifficulty = ref<QuizDifficulty | ''>('')
const sortBy = ref<'newest' | 'popular' | 'rating' | 'alphabetical'>('newest')
const categoryLabels: Record<QuizCategory, string> = {
  history: '📜 History',
  bands: '🎸 Bands',
  albums: '💿 Albums',
  lyrics: '📝 Lyrics',
  genres: '🎵 Genres',
  trivia: '🤘 Trivia',
  mixed: '🎯 Mixed'
}

const quizzes = computed(() => store.quizzes)

const filteredQuizzes = computed(() => {
  let filtered = [...quizzes.value]

  // Поиск
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(quiz => quiz.title.toLowerCase().includes(query))
  }

  // Категория
  if (selectedCategory.value) {
    filtered = filtered.filter(quiz => quiz.category === selectedCategory.value)
  }

  // Сложность
  if (selectedDifficulty.value) {
    filtered = filtered.filter(quiz => quiz.difficulty === selectedDifficulty.value)
  }

  // Сортировка
  switch (sortBy.value) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      break
    case 'alphabetical':
      filtered.sort((a, b) => a.title.localeCompare(b.title))
      break
  }

  return filtered
})

const openQuiz = (quiz: Quiz) => {
  router.push(`/quizzes/${quiz.id}`)
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedDifficulty.value = ''
  sortBy.value = 'newest'
}

onMounted(async () => {
  await store.getQuizzes()
})
</script>

<template>
  <div class="space-y-3">
    <!-- Фильтры -->
    <div class="bg-gray-800 rounded-lg border border-gray-700 p-4">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Поиск -->
        <div class="flex-1 relative">
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search quizzes..."
            class="w-full pl-10 pr-4 py-2 bg-gray-750 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-sm"
          />
        </div>

        <!-- Категория -->
        <select
          v-model="selectedCategory"
          class="w-full md:w-48 bg-gray-750 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm"
        >
          <option value="">All Categories</option>
          <option v-for="(label, value) in categoryLabels" :key="value" :value="value">
            {{ label }}
          </option>
        </select>

        <!-- Сложность -->
        <select
          v-model="selectedDifficulty"
          class="w-full md:w-40 bg-gray-750 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm"
        >
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <!-- Сортировка -->
        <select v-model="sortBy" class="w-full md:w-40 bg-gray-750 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm">
          <option value="newest">Newest</option>
          <option value="popular">Most Popular</option>
          <option value="rating">Top Rated</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>
    </div>

    <!-- Сетка викторин -->
    <div v-if="filteredQuizzes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <QuizCard v-for="quiz in filteredQuizzes" :key="quiz.id" :quiz="quiz" @click="openQuiz(quiz)" />
    </div>

    <!-- Пустое состояние -->
    <div v-else class="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
      <svg class="w-20 h-20 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-xl font-bold text-white mb-2">No quizzes found</h3>
      <p class="text-gray-400">Try adjusting your filters or search query</p>
      <button @click="resetFilters" class="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200">Reset Filters</button>
    </div>
  </div>
</template>
