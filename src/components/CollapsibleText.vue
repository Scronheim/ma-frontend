<template>
  <div ref="containerRef" class="height-collapsible" :style="{ '--scroll-offset': scrollOffset + 'px' }">
    <div
      ref="contentRef"
      :class="[
        'content',
        {
          expanded: isExpanded,
          collapsed: !isExpanded && isOverflowing,
          scrolling: isScrolling,
          animating: isAnimating
        }
      ]"
      :style="{
        maxHeight: isExpanded ? `${actualHeight}px` : `${collapsedHeight}px`,
        transitionDuration: animationDuration + 'ms'
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
    <el-dialog v-model="showMoreDialog" title="Дополнительные заметки" :width="dialogWidth">
      <span v-html="content" class="desciption-link" />
      <template #footer>
        <el-button @click="showMoreDialog = false">Закрыть</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUpdated, nextTick } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'

import { useStore } from '@/store/store'

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

const emit = defineEmits<{
  toggle: [state: boolean]
  'animation-start': []
  'animation-end': []
}>()

const store = useStore()

// Refs
const showMoreDialog = ref(false)
const isExpanded = ref(false)
const isAnimating = ref(false)
const isScrolling = ref(false)
const contentRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const actualHeight = ref(0)
const isOverflowing = ref(false)
const lastScrollY = ref(0)
const scrollOffset = ref(0)
const scrollTimeout = ref<NodeJS.Timeout | null>(null)

const dialogWidth = computed((): string => {
  if (store.isMobile) return '100%'
  return '50%'
})
// Вычисляемое свойство для проверки, виден ли компонент в viewport
const isInViewport = computed(() => {
  if (!containerRef.value) return false

  const rect = containerRef.value.getBoundingClientRect()
  const windowHeight = window.innerHeight || document.documentElement.clientHeight

  return rect.top >= 0 && rect.bottom <= windowHeight + props.scrollMargin
})

// Проверяем, переполняется ли контент
const checkOverflow = () => {
  if (!contentRef.value) return

  const element = contentRef.value
  actualHeight.value = element.scrollHeight
  isOverflowing.value = element.scrollHeight > props.collapsedHeight
}

// Сохраняем текущую позицию скролла
const saveScrollPosition = () => {
  lastScrollY.value = window.scrollY || document.documentElement.scrollTop
  if (containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect()
    scrollOffset.value = rect.top
  }
}

// Восстанавливаем позицию скролла с учетом изменения высоты
const restoreScrollPosition = async () => {
  if (!props.preserveScrollPosition || !containerRef.value) return

  await nextTick()

  const rect = containerRef.value.getBoundingClientRect()
  const currentScrollY = window.scrollY || document.documentElement.scrollTop
  const containerTop = rect.top + currentScrollY

  // Рассчитываем корректировку для сохранения позиции
  const newContainerTop = containerRef.value.getBoundingClientRect().top + currentScrollY
  const positionChange = newContainerTop - containerTop

  // Плавно скроллим к новой позиции
  window.scrollTo({
    top: currentScrollY + positionChange,
    behavior: 'smooth'
  })
}

// Основная функция переключения с сохранением позиции
const toggleWithScrollPreservation = async () => {
  if (isAnimating.value) return

  // Сохраняем начальную позицию
  saveScrollPosition()

  // Начинаем анимацию
  isAnimating.value = true
  emit('animation-start')

  // Определяем, будем ли мы разворачивать или сворачивать
  const willBeExpanded = !isExpanded.value

  // Если элемент видимый и мы разворачиваем, добавляем класс для плавности
  if (willBeExpanded && isInViewport.value) {
    isScrolling.value = true

    // Временно отключаем сохранение скролла для плавной анимации
    if (props.expandAnimation) {
      // Даем время на начало анимации
      await new Promise(resolve => setTimeout(resolve, 50))
    }
  }

  // Переключаем состояние
  isExpanded.value = willBeExpanded
  emit('toggle', willBeExpanded)

  // Если элемент в зоне видимости, восстанавливаем позицию после анимации
  if (props.preserveScrollPosition && isInViewport.value) {
    // Ждем завершения CSS анимации
    setTimeout(() => {
      restoreScrollPosition()
      isScrolling.value = false
    }, props.animationDuration)
  } else {
    // Если не в зоне видимости, просто завершаем анимацию
    setTimeout(() => {
      isScrolling.value = false
    }, props.animationDuration)
  }
}

// Обработчик завершения CSS анимации
const handleTransitionEnd = () => {
  isAnimating.value = false
  emit('animation-end')
}

// Простые методы для программного управления
const expand = async () => {
  if (!isExpanded.value) {
    await toggleWithScrollPreservation()
  }
}

const collapse = async () => {
  if (isExpanded.value) {
    await toggleWithScrollPreservation()
  }
}

const toggle = async () => {
  await toggleWithScrollPreservation()
}

const reset = () => {
  isExpanded.value = false
  isAnimating.value = false
  isScrolling.value = false
}

// Обработчик изменения размера окна
const handleResize = () => {
  checkOverflow()
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value)
  }
  scrollTimeout.value = setTimeout(checkOverflow, 100)
}

// Обработчик скролла (для отладки и дополнительных функций)
const handleScroll = () => {
  // Можно добавить дополнительные логики при скролле
}

onMounted(() => {
  // Инициализация
  setTimeout(() => {
    checkOverflow()
  }, 100)

  // Слушатели событий
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', handleScroll)

  // MutationObserver для отслеживания изменений контента
  const observer = new MutationObserver(() => {
    checkOverflow()
  })

  if (contentRef.value) {
    observer.observe(contentRef.value, {
      childList: true,
      subtree: true,
      characterData: true
    })
  }
})

onUpdated(() => {
  checkOverflow()
})

// Очистка
import { onUnmounted } from 'vue'
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', handleScroll)
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value)
  }
})

// Экспортируем методы
defineExpose({
  expand,
  collapse,
  toggle,
  reset,
  checkOverflow,
  saveScrollPosition,
  restoreScrollPosition
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

  .debug-info {
    position: absolute;
    top: -30px;
    right: 0;
    display: flex;
    gap: 4px;
    opacity: 0.7;
    pointer-events: none;

    .el-tag {
      font-size: 10px;
      padding: 2px 6px;
      height: auto;
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
