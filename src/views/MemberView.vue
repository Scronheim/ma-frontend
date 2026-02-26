<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { useStore } from '@/store/store'

import LoadingSpinner from '@/components/LoadingSpinner.vue'
import MemberBands from '@/components/MemberBands.vue'

const route = useRoute()
const store = useStore()

const showPreview = ref<boolean>(false)
const urlList = ref<string[]>([])
const activeTab = ref<string>('active_bands')

const member = computed(() => store.currentMember)

const tabs = computed(() => [
  { id: 'active_bands', label: 'Активные', count: member.value.active_bands.length },
  { id: 'past_bands', label: 'Прошлые', count: member.value.past_bands.length },
  { id: 'guest_session', label: 'Как гость', count: member.value.guest_session.length },
  { id: 'live', label: 'Live', count: member.value.live.length },
  { id: 'misc_staff', label: 'Прочее', count: member.value.misc_staff.length }
])

const openImagePreview = (imgList: string[]) => {
  urlList.value = imgList
  showPreview.value = true
}

onMounted(async () => {
  await store.getMemberById(route.params.id)
})
</script>

<template>
  <LoadingSpinner v-if="store.memberIsLoading" :visible="store.memberIsLoading" />
  <div class="space-y-6" v-else>
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between">
      <div class="flex items-center space-x-4">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold">{{ member.fullname }}</h1>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <div class="flex flex-col gap-6">
          <div class="w-full bg-gray-800 rounded-lg border border-gray-700 py-3 px-3">
            <h2 class="text-2xl font-bold mb-4 text-red-400">Информация о музыканте</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 class="text-gray-400 text-sm uppercase tracking-wider">Полное имя</h3>
                <p>{{ member.fullname }}</p>
              </div>
              <div>
                <h3 class="text-gray-400 text-sm uppercase tracking-wider">Возраст</h3>
                <p>{{ member.age }}</p>
              </div>
              <div>
                <h3 class="text-gray-400 text-sm uppercase tracking-wider">Место рождения</h3>
                <p>{{ member.place_of_birth }}</p>
              </div>
              <div>
                <h3 class="text-gray-400 text-sm uppercase tracking-wider">Пол</h3>
                <p>{{ member.gender }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800 rounded-lg border border-gray-700 py-2 px-4">
          <h2 class="text-2xl font-bold mb-4 text-red-400">Группы</h2>
          <div class="overflow-x-auto">
            <div class="flex border-b border-gray-700">
              <template v-for="tab in tabs" :key="tab.id">
                <button
                  v-if="tab.count"
                  @click="activeTab = tab.id"
                  class="flex-1 py-2 px-2 text-center font-medium transition-colors duration-200 cursor-pointer"
                  :class="
                    activeTab === tab.id
                      ? 'text-red-400 border-b-2 border-red-400'
                      : 'text-gray-400 hover:text-gray-200'
                  "
                >
                  {{ tab.label }}
                  <span class="ml-2 text-sm bg-gray-700 rounded-full px-2 py-0.5">{{ tab.count }}</span>
                </button>
              </template>
            </div>
            <div v-if="activeTab === 'active_bands'" class="space-y-4">
              <member-bands :bands="member.active_bands" />
            </div>
            <div v-if="activeTab === 'past_bands'" class="space-y-4">
              <member-bands :bands="member.past_bands" />
            </div>
            <div v-if="activeTab === 'live'" class="space-y-4">
              <member-bands :bands="member.live" />
            </div>
            <div v-if="activeTab === 'guest_session'" class="space-y-4">
              <member-bands :bands="member.guest_session" />
            </div>
            <div v-if="activeTab === 'misc_staff'" class="space-y-4">
              <member-bands :bands="member.misc_staff" />
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-gray-800 rounded-lg border border-gray-700 py-3 px-3">
          <h2 class="text-xl font-bold mb-4 text-red-400">Фото</h2>
          <div class="bg-gray-750 rounded-lg overflow-hidden">
            <div
              class="bg-linear-to-br from-gray-700 to-gray-900 flex flex-col items-center justify-center cursor-pointer"
            >
              <template v-if="member.photo_url">
                <img
                  v-if="member.photo_url"
                  :src="member.photo_url"
                  :alt="member.fullname + '_photo'"
                  class="w-full h-full object-cover"
                  @click="openImagePreview([member.photo_url])"
                />
                <el-image-viewer
                  v-if="showPreview"
                  :url-list="urlList"
                  hide-on-click-modal
                  @close="showPreview = false"
                />
              </template>
              <span v-else class="text-5xl">📸</span>
            </div>
          </div>
        </div>
        <div v-if="member.links.length" class="bg-gray-800 rounded-lg border border-gray-700 py-3 px-3">
          <h2 class="text-xl font-bold mb-4 text-red-400">Ссылки</h2>
          <div class="grid grid-cols-2 bg-gray-750 rounded-lg overflow-hidden">
            <el-link
              v-for="link in member.links"
              :key="link.url"
              type="primary"
              underline="never"
              target="_blank"
              :href="link.url"
            >
              {{ link.social }}
            </el-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
