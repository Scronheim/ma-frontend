<template>
  <div
    class="quiz-card bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-red-500 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl group cursor-pointer"
    @click="$emit('click', quiz)"
  >
    <!-- Изображение -->
    <div class="relative h-48 bg-gray-700 overflow-hidden">
      <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
        <svg class="w-20 h-20 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    </div>

    <!-- Контент -->
    <div class="p-4">
      <!-- Заголовок -->
      <h3 class="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-red-400 transition-colors">
        {{ quiz.title }}
      </h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Quiz } from '../types'

const props = defineProps<{
  quiz: Quiz
}>()

const emit = defineEmits<{
  (e: 'click', quiz: Quiz): void
}>()
</script>

<style scoped>
.quiz-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
