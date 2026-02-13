<script setup lang="ts">
import { type PropType } from 'vue'

import type { MemberLineUp } from '@/types'

defineProps({
  member: {
    type: Object as PropType<MemberLineUp>,
    required: true
  }
})
</script>

<template>
  <router-link :to="`/artists/${member.fullname_slug}/${member.id}`" class="text-blue-400 font-bold">
    {{ member.fullname }}
  </router-link>
  <p class="text-gray-400 text-sm tracking-wider">{{ member.role }}</p>
  <p v-if="member.other_bands.length">
    Смотри так же:
    <span v-for="(otherBand, index) in member.other_bands" :key="otherBand.name">
      <RouterLink
        v-if="otherBand.id"
        :to="`/bands/${otherBand.name_slug}/${otherBand.id}`"
        class="text-blue-400 font-bold"
      >
        {{ otherBand.name }}
      </RouterLink>
      <span v-else>{{ otherBand.name }}</span>
      <span v-if="index !== member.other_bands.length - 1">,&nbsp</span>
    </span>
  </p>
  <el-divider style="margin-top: 0px; margin-bottom: 0px" />
</template>
