<script setup lang="ts">
defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div v-if="visible" class="flex items-center justify-center min-h-[60vh]">
    <div class="text-center">
      <div class="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p>Идёт загрузка информации...</p>
    </div>
  </div>
</template>
