<template>
  <div ref="containerRef" class="height-collapsible" :style="{ '--scroll-offset': scrollOffset + 'px' }">
    <div
      ref="contentRef"
      :class="[
        'content',
        {
          expanded: isExpanded,
          collapsed: !isExpanded && isOverflowing,
          scrolling: isScrolling
        }
      ]"
      :style="{
        maxHeight: isExpanded ? `${actualHeight}px` : `${collapsedHeight}px`
      }"
    >
      <slot>
        <span v-html="content" />
      </slot>
    </div>

    <div v-if="isOverflowing" class="controls">
      <el-button type="primary" link size="small" @click="showMoreDialog = true">
        Читать далее
        <el-icon>
          <ArrowRight />
        </el-icon>
      </el-button>
    </div>

    <modal :model-value="showMoreDialog" title="Дополнительные заметки" @close="showMoreDialog = false" size="full">
      <span v-html="content" class="desciption-link" />
      <template #footer>
        <el-button @click="showMoreDialog = false">Закрыть</el-button>
      </template>
    </modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'

import { useStore } from '@/store/store'

import Modal from '../components/Modal.vue'

interface Props {
  content?: string
  collapsedHeight?: number
  expandAnimation?: boolean
  animationDuration?: number
  preserveScrollPosition?: boolean
  scrollMargin?: number
}

const props = withDefaults(defineProps<Props>(), {
  collapsedHeight: 100,
  expandAnimation: true,
  animationDuration: 300,
  preserveScrollPosition: true,
  scrollMargin: 20
})

const store = useStore()

// Refs
const showMoreDialog = ref(false)
const isExpanded = ref(false)
const isScrolling = ref(false)
const contentRef = ref<HTMLElement | null>(null)
const actualHeight = ref(0)
const isOverflowing = ref(false)
const scrollOffset = ref(0)

const dialogWidth = computed((): string => {
  if (store.isMobile) return '100%'
  return '50%'
})

// Проверяем, переполняется ли контент
const checkOverflow = () => {
  if (!contentRef.value) return

  const element = contentRef.value
  actualHeight.value = element.scrollHeight
  isOverflowing.value = element.scrollHeight > props.collapsedHeight
}

onMounted(() => {
  checkOverflow()
})
</script>

<style lang="scss">
.desciption-link a {
  color: #409eff;
}
.desciption-link a:hover {
  color: rgb(51, 117, 185);
}
.height-collapsible {
  position: relative;
  width: 100%;
  transition: transform 0.3s ease;

  // Плавное смещение при анимации
  &.scrolling-adjust {
    transform: translateY(var(--scroll-offset, 0));
  }

  .content {
    overflow: hidden;
    transition: max-height v-bind(animationDuration + 'ms') cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    will-change: max-height;

    &.collapsed {
      mask-image: linear-gradient(to bottom, black 0%, black calc(100% - 40px), transparent 100%);
      -webkit-mask-image: linear-gradient(to bottom, black 0%, black calc(100% - 40px), transparent 100%);
    }

    &.expanded {
      mask-image: none;
      -webkit-mask-image: none;
    }

    // Улучшенная анимация
    &.animating {
      pointer-events: none;
    }

    &.scrolling {
      // Добавляем небольшой отступ для плавности при скролле
      margin-bottom: 2px;
    }
  }

  .controls {
    display: flex;
    justify-content: center;
    padding-top: 8px;
    margin-top: -20px;
    position: relative;
    z-index: 2;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.9;
    }

    .el-button {
      background: var(--el-bg-color);
      padding: 6px 16px;
      border-radius: 16px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      font-weight: 500;

      &:hover {
        background: var(--el-bg-color-overlay);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }

      // Стиль для состояния загрузки
      &.is-loading {
        opacity: 0.7;
        pointer-events: none;
      }
    }

    .icon {
      margin-left: 6px;
      transition: transform v-bind(animationDuration + 'ms') cubic-bezier(0.4, 0, 0.2, 1);
      transform-origin: center;

      &.rotated {
        transform: rotate(180deg);
      }
    }
  }
}

// Медиа-запросы для мобильных устройств
@media (max-width: 768px) {
  .height-collapsible {
    .controls {
      .el-button {
        padding: 5px 14px;
        font-size: 12px;
      }
    }

    .content {
      font-size: 14px;
      line-height: 1.4;
    }
  }
}

// Анимация появления
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.height-collapsible {
  animation: fadeIn 0.3s ease-out;
}
</style>
