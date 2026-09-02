<script setup lang="ts">
import { IconDragDrop, IconHeart } from '@tabler/icons-vue';
import { useHead } from '@vueuse/head';
import { computed } from 'vue';
import Draggable from 'vuedraggable';
import ColoredCard from '../components/ColoredCard.vue';
import ToolCard from '../components/ToolCard.vue';
import { useToolStore } from '@/tools/tools.store';
import { config } from '@/config';

const toolStore = useToolStore();

useHead({ title: 'IT Tools - Handy online tools for developers' });
const { t } = useI18n();

const favoriteTools = computed(() => toolStore.favoriteTools);

// Update favorite tools order when drag is finished
function onUpdateFavoriteTools() {
  toolStore.updateFavoriteTools(favoriteTools.value); // Update the store with the new order
}
</script>

<template>
  <div class="pt-50px">
    <div class="grid-wrapper">
      <aside class="iplan-cta" aria-label="关注 i方案">
        <div>
          <strong>关注 i方案</strong>
          <span>获取内容创作、客户跟单、文生图与视频制作方案</span>
        </div>
        <a href="https://www.i41.cn?utm_source=tools&amp;utm_medium=tool_referral&amp;utm_campaign=ifangan&amp;utm_content=promo_banner" target="_blank" rel="noopener noreferrer">
          访问 i方案 →
        </a>
      </aside>

      <div class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
        <ColoredCard v-if="config.showBanner" :title="$t('home.follow.title')" :icon="IconHeart">
          {{ $t('home.follow.p1') }}
          <a
            href="https://github.com/CorentinTh/it-tools"
            rel="noopener"
            target="_blank"
            :aria-label="$t('home.follow.githubRepository')"
          >GitHub</a>
          {{ $t('home.follow.p2') }}
          <a
            href="https://x.com/ittoolsdottech"
            rel="noopener"
            target="_blank"
            :aria-label="$t('home.follow.twitterXAccount')"
          >X</a>.
          {{ $t('home.follow.thankYou') }}
          <n-icon :component="IconHeart" />
        </ColoredCard>
      </div>

      <transition name="height">
        <div v-if="toolStore.favoriteTools.length > 0">
          <h3 class="mb-5px mt-25px text-neutral-400 font-500">
            {{ $t('home.categories.favoriteTools') }}
            <c-tooltip :tooltip="$t('home.categories.favoritesDndToolTip')">
              <n-icon :component="IconDragDrop" size="18" />
            </c-tooltip>
          </h3>
          <Draggable
            :list="favoriteTools"
            class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4"
            ghost-class="ghost-favorites-draggable"
            item-key="name"
            @end="onUpdateFavoriteTools"
          >
            <template #item="{ element: tool }">
              <ToolCard :tool="tool" />
            </template>
          </Draggable>
        </div>
      </transition>

      <div v-if="toolStore.newTools.length > 0">
        <h3 class="mb-5px mt-25px text-neutral-400 font-500">
          {{ t('home.categories.newestTools') }}
        </h3>
        <div class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
          <ToolCard v-for="tool in toolStore.newTools" :key="tool.name" :tool="tool" />
        </div>
      </div>

      <h3 class="mb-5px mt-25px text-neutral-400 font-500">
        {{ $t('home.categories.allTools') }}
      </h3>
      <div class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
        <ToolCard v-for="tool in toolStore.tools" :key="tool.name" :tool="tool" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.iplan-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
  padding: 18px 20px;
  border: 1px solid #f1cf62;
  border-radius: 16px;
  background: linear-gradient(135deg, #fff9dd, #fff3ac);
  box-shadow: 0 12px 30px rgba(112, 82, 0, 0.12);

  div {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  strong {
    color: #5d4300;
    font-size: 18px;
  }

  span {
    color: #7d681f;
    font-size: 14px;
  }

  a {
    flex-shrink: 0;
    padding: 10px 16px;
    border-radius: 999px;
    background: #172133;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
  }

  @media (max-width: 640px) {
    align-items: flex-start;
    flex-direction: column;
  }
}

.height-enter-active,
.height-leave-active {
  transition: all 0.5s ease-in-out;
  overflow: hidden;
  max-height: 500px;
}

.height-enter-from,
.height-leave-to {
  max-height: 42px;
  overflow: hidden;
  opacity: 0;
  margin-bottom: 0;
}

.ghost-favorites-draggable {
  opacity: 0.4;
  background-color: #ccc;
  border: 2px dashed #666;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transform: scale(1.1);
  animation: ghost-favorites-draggable-animation 0.2s ease-out;
}

@keyframes ghost-favorites-draggable-animation {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 0.4;
    transform: scale(1.0);
  }
}
</style>
