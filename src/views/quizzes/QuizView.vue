<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'

import { useStore } from '@/store/store'
import CustomButton from '@/components/inputs/CustomButton.vue'
import { ElNotification } from 'element-plus'

const route = useRoute()

const store = useStore()

const selectedQuestion = ref<number>(1)

const currentQuiz = computed(() => store.currentQuiz)
const currentQuestion = computed(() => currentQuiz.value.questions[selectedQuestion.value - 1])

const checkCorrectAnswer = (index: number) => {
  if (index === currentQuestion.value.correct_answer) {
    ElNotification({
      type: 'success',
      message: 'Верный ответ! Идём дальше'
    })
    if (selectedQuestion.value - 1 < currentQuiz.value.questions.length - 1) selectedQuestion.value++
    else
      ElNotification({
        type: 'success',
        message: 'Викторина окончена. Спасибо!'
      })
  } else
    ElNotification({
      type: 'error',
      message: 'Ответ неверный! Подумай ещё'
    })
}

onMounted(async () => {
  await store.getQuizById(route.params.id as string)
})
</script>

<template>
  <div class="space-y-3">
    <div class="bg-gray-800 rounded-lg border border-gray-700 p-4 font-bold">{{ currentQuiz.title }}</div>
    <div v-if="currentQuestion" class="bg-gray-800 rounded-lg border border-gray-700 p-4">
      <div class="flex justify-center"><img :src="currentQuestion.photo_url" class="w-80" /></div>
      <div class="flex justify-around">
        <CustomButton v-for="(answer, index) in currentQuestion.answers" @click="checkCorrectAnswer(index)" :text="answer" />
      </div>
      <el-pagination layout="prev, pager, next" class="justify-center" :total="currentQuiz.questions.length" :page-size="1" v-model:current-page="selectedQuestion" />
    </div>
  </div>
</template>
