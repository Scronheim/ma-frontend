<template>
  <div class="quiz-results space-y-6">
    <!-- Заголовок результата -->
    <div class="text-center">
      <div class="text-6xl mb-4">
        {{ resultEmoji }}
      </div>
      <h2 class="text-2xl font-bold text-white">{{ resultTitle }}</h2>
      <p class="text-gray-400 mt-2">{{ resultMessage }}</p>
    </div>

    <!-- Статистика -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-gray-750 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-white">{{ score }}%</div>
        <div class="text-xs text-gray-400">Score</div>
      </div>
      <div class="bg-gray-750 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-green-400">{{ correctAnswers }}</div>
        <div class="text-xs text-gray-400">Correct</div>
      </div>
      <div class="bg-gray-750 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-red-400">{{ incorrectAnswers }}</div>
        <div class="text-xs text-gray-400">Incorrect</div>
      </div>
      <div class="bg-gray-750 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-yellow-400">{{ totalPoints }}</div>
        <div class="text-xs text-gray-400">Points</div>
      </div>
    </div>

    <!-- Детальный разбор -->
    <div class="bg-gray-750 rounded-lg border border-gray-700 overflow-hidden">
      <div v-for="(result, index) in results" :key="index" class="p-4 border-b border-gray-700 last:border-0 flex items-start space-x-3">
        <div class="flex-shrink-0 mt-0.5">
          <svg v-if="result.isCorrect" class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <svg v-else class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white">
            {{ result.question }}
          </p>
          <div class="mt-1 space-y-1 text-sm">
            <p class="text-green-400">✓ {{ result.correctAnswer }}</p>
            <p v-if="!result.isCorrect" class="text-red-400">✗ {{ result.userAnswer }}</p>
          </div>
        </div>
        <div class="flex-shrink-0 text-sm font-bold" :class="result.isCorrect ? 'text-green-400' : 'text-red-400'">
          {{ result.isCorrect ? '+' + result.points : '0' }}
        </div>
      </div>
    </div>

    <!-- Кнопки действий -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4 border-t border-gray-700">
      <button @click="$emit('retry')" class="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span>Retry Quiz</span>
      </button>

      <button @click="$emit('home')" class="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <span>Back to Quizzes</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  score: number
  correctAnswers: number
  totalQuestions: number
  totalPoints: number
  results: {
    question: string
    userAnswer: string
    correctAnswer: string
    isCorrect: boolean
    points: number
  }[]
}>()

const emit = defineEmits<{
  (e: 'retry'): void
  (e: 'home'): void
}>()

const incorrectAnswers = computed(() => {
  return props.totalQuestions - props.correctAnswers
})

const resultEmoji = computed(() => {
  const percentage = props.score
  if (percentage >= 90) return '🏆'
  if (percentage >= 70) return '🎸'
  if (percentage >= 50) return '🤘'
  if (percentage >= 30) return '😅'
  return '💀'
})

const resultTitle = computed(() => {
  const percentage = props.score
  if (percentage >= 90) return 'Metal God!'
  if (percentage >= 70) return 'True Metalhead!'
  if (percentage >= 50) return 'Respectable!'
  if (percentage >= 30) return 'Keep Listening!'
  return 'Time to Study!'
})

const resultMessage = computed(() => {
  const percentage = props.score
  if (percentage >= 90) return 'You are the ultimate metal master! 🤘'
  if (percentage >= 70) return 'Great job! You really know your metal!'
  if (percentage >= 50) return 'Not bad! Keep expanding your metal knowledge.'
  if (percentage >= 30) return 'You need to listen to more metal!'
  return 'Everyone starts somewhere. Try again!'
})
</script>
