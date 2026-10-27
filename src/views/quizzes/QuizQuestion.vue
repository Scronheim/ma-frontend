<template>
  <div class="quiz-question space-y-6">
    <!-- Прогресс -->
    <div class="flex items-center justify-between text-sm text-gray-400">
      <span>Question {{ currentIndex + 1 }} of {{ totalQuestions }}</span>
      <span>{{ Math.round(progress) }}% complete</span>
    </div>

    <!-- Прогресс-бар -->
    <div class="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
      <div class="h-full bg-red-600 transition-all duration-500 ease-out" :style="{ width: progress + '%' }"></div>
    </div>

    <!-- Вопрос -->
    <div class="bg-gray-750 rounded-lg p-6">
      <h3 class="text-xl font-bold text-white mb-2">{{ question.question }}</h3>
      <p v-if="question.points" class="text-sm text-gray-400">{{ question.points }} points</p>
    </div>

    <!-- Варианты ответов -->
    <div class="space-y-3">
      <button
        v-for="(option, index) in question.options"
        :key="index"
        @click="selectOption(index)"
        :disabled="isAnswered"
        class="w-full text-left p-4 rounded-lg border transition-all duration-200"
        :class="getOptionClass(index)"
      >
        <div class="flex items-center space-x-3">
          <span class="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium" :class="getOptionIndicatorClass(index)">
            {{ String.fromCharCode(65 + index) }}
          </span>
          <span class="flex-1">{{ option }}</span>

          <!-- Иконка правильности -->
          <svg v-if="isAnswered && index === question.correctAnswer" class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>

          <svg v-if="isAnswered && selectedOption === index && index !== question.correctAnswer" class="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </button>
    </div>

    <!-- Объяснение (если есть) -->
    <div v-if="isAnswered && question.explanation" class="bg-gray-750 rounded-lg p-4 border border-gray-700">
      <h4 class="text-sm font-medium text-gray-400 mb-1">Explanation</h4>
      <p class="text-gray-300">{{ question.explanation }}</p>
    </div>

    <!-- Кнопка "Далее" -->
    <div class="flex justify-end pt-4 border-t border-gray-700">
      <button v-if="isAnswered" @click="$emit('next')" class="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 flex items-center space-x-2">
        <span>{{ isLastQuestion ? 'Finish' : 'Next Question' }}</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { QuizQuestion } from '../types/quiz'

const props = defineProps<{
  question: QuizQuestion
  currentIndex: number
  totalQuestions: number
  selectedOption: number | null
  isAnswered: boolean
}>()

const emit = defineEmits<{
  (e: 'select', index: number): void
  (e: 'next'): void
}>()

const progress = computed(() => {
  return ((props.currentIndex + (props.isAnswered ? 1 : 0)) / props.totalQuestions) * 100
})

const isLastQuestion = computed(() => {
  return props.currentIndex === props.totalQuestions - 1
})

const selectOption = (index: number) => {
  if (!props.isAnswered) {
    emit('select', index)
  }
}

const getOptionClass = (index: number) => {
  if (!props.isAnswered) {
    return props.selectedOption === index ? 'border-red-600 bg-red-600 bg-opacity-10' : 'border-gray-700 hover:border-gray-600 hover:bg-gray-750'
  }

  if (index === props.question.correctAnswer) {
    return 'border-green-500 bg-green-500 bg-opacity-10'
  }

  if (props.selectedOption === index && index !== props.question.correctAnswer) {
    return 'border-red-500 bg-red-500 bg-opacity-10'
  }

  return 'border-gray-700 opacity-50'
}

const getOptionIndicatorClass = (index: number) => {
  if (!props.isAnswered) {
    return props.selectedOption === index ? 'border-red-600 text-red-600' : 'border-gray-600 text-gray-500'
  }

  if (index === props.question.correctAnswer) {
    return 'border-green-500 text-green-500 bg-green-500 bg-opacity-10'
  }

  if (props.selectedOption === index && index !== props.question.correctAnswer) {
    return 'border-red-500 text-red-500 bg-red-500 bg-opacity-10'
  }

  return 'border-gray-600 text-gray-500'
}
</script>
