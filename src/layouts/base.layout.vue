<script lang="ts" setup>
import { NIcon, useThemeVars } from 'naive-ui';

import { RouterLink } from 'vue-router';
import { Heart, Home2, IdBadge, Menu2, Photo } from '@vicons/tabler';

import { storeToRefs } from 'pinia';
import HeroGradient from '../assets/hero-gradient.svg?component';
import MenuLayout from '../components/MenuLayout.vue';
import NavbarButtons from '../components/NavbarButtons.vue';
import { useStyleStore } from '@/stores/style.store';
import { config } from '@/config';
import type { ToolCategory } from '@/tools/tools.types';
import { useToolStore } from '@/tools/tools.store';
import { useTracker } from '@/modules/tracker/tracker.services';
import CollapsibleToolMenu from '@/components/CollapsibleToolMenu.vue';

const themeVars = useThemeVars();
const styleStore = useStyleStore();
const version = config.app.version;
const commitSha = config.app.lastCommitSha.slice(0, 7);

const { tracker } = useTracker();
const { t } = useI18n();

const toolStore = useToolStore();
const { favoriteTools, toolsByCategory } = storeToRefs(toolStore);

const tools = computed<ToolCategory[]>(() => [
  ...(favoriteTools.value.length > 0 ? [{ name: t('tools.categories.favorite-tools'), components: favoriteTools.value }] : []),
  ...toolsByCategory.value,
]);
</script>

<template>
  <MenuLayout class="menu-layout" :class="{ isSmallScreen: styleStore.isSmallScreen }">
    <template #sider>
      <RouterLink to="/" class="hero-wrapper">
        <HeroGradient class="gradient" />
        <div class="text-wrapper">
          <div class="title">
            IT - TOOLS
          </div>
          <div class="divider" />
          <div class="subtitle">
            {{ $t('home.subtitle') }}
          </div>
        </div>
      </RouterLink>

      <div class="sider-content">
        <div v-if="styleStore.isSmallScreen" flex flex-col items-center>
          <locale-selector w="90%" />

          <div flex justify-center>
            <NavbarButtons />
          </div>

          <div class="company-tools-links company-tools-links--mobile">
            <c-tooltip
              position="bottom"
              tooltip="图片修改压缩是一款浏览器端在线图片处理工具，支持压缩、调整尺寸和格式转换，图片尽量在本地处理，适合日常上传、分享和网页优化。"
              tooltip-class="company-tool-tooltip-popover"
            >
              <c-button href="https://imgzip.i41.cn" rel="noopener noreferrer" target="_blank" size="small" variant="text">
                <NIcon :component="Photo" mr-1 />
                图片压缩
              </c-button>
            </c-tooltip>
            <c-tooltip
              position="bottom"
              tooltip="证件照工作室是一款浏览器端证件照制作工具，支持本地智能抠图、背景换色、常用证件尺寸和 300DPI 多图拼版，照片无需上传到业务服务器。"
              tooltip-class="company-tool-tooltip-popover"
            >
              <c-button href="https://idphoto.i41.cn" rel="noopener noreferrer" target="_blank" size="small" variant="text">
                <NIcon :component="IdBadge" mr-1 />
                证件照
              </c-button>
            </c-tooltip>
          </div>
        </div>

        <CollapsibleToolMenu :tools-by-category="tools" />

        <div class="footer">
          <div>
            IT-Tools

            <c-link target="_blank" rel="noopener" :href="`https://github.com/CorentinTh/it-tools/tree/v${version}`">
              v{{ version }}
            </c-link>

            <template v-if="commitSha && commitSha.length > 0">
              -
              <c-link
                target="_blank"
                rel="noopener"
                type="primary"
                :href="`https://github.com/CorentinTh/it-tools/tree/${commitSha}`"
              >
                {{ commitSha }}
              </c-link>
            </template>
          </div>
          <div>
            © {{ new Date().getFullYear() }}
            <c-link target="_blank" rel="noopener" href="https://corentin.tech?utm_source=it-tools&utm_medium=footer">
              Corentin Thomasset
            </c-link>
          </div>
        </div>
      </div>
    </template>

    <template #content>
      <div flex items-center justify-center gap-2>
        <c-button
          circle
          variant="text"
          :aria-label="$t('home.toggleMenu')"
          @click="styleStore.isMenuCollapsed = !styleStore.isMenuCollapsed"
        >
          <NIcon size="25" :component="Menu2" />
        </c-button>

        <c-tooltip :tooltip="$t('home.home')" position="bottom">
          <c-button to="/" circle variant="text" :aria-label="$t('home.home')">
            <NIcon size="25" :component="Home2" />
          </c-button>
        </c-tooltip>

        <c-tooltip :tooltip="$t('home.uiLib')" position="bottom">
          <c-button v-if="config.app.env === 'development'" to="/c-lib" circle variant="text" :aria-label="$t('home.uiLib')">
            <icon-mdi:brush-variant text-20px />
          </c-button>
        </c-tooltip>

        <command-palette />

        <locale-selector v-if="!styleStore.isSmallScreen" />

        <div>
          <NavbarButtons v-if="!styleStore.isSmallScreen" />
        </div>

        <div v-if="!styleStore.isSmallScreen" class="company-tools-links">
          <c-tooltip
            position="bottom"
            tooltip="图片修改压缩是一款浏览器端在线图片处理工具，支持压缩、调整尺寸和格式转换，图片尽量在本地处理，适合日常上传、分享和网页优化。"
            tooltip-class="company-tool-tooltip-popover"
          >
            <c-button href="https://imgzip.i41.cn" rel="noopener noreferrer" target="_blank" size="small" variant="text">
              <NIcon :component="Photo" mr-1 />
              图片压缩
            </c-button>
          </c-tooltip>
          <c-tooltip
            position="bottom"
            tooltip="证件照工作室是一款浏览器端证件照制作工具，支持本地智能抠图、背景换色、常用证件尺寸和 300DPI 多图拼版，照片无需上传到业务服务器。"
            tooltip-class="company-tool-tooltip-popover"
          >
            <c-button href="https://idphoto.i41.cn" rel="noopener noreferrer" target="_blank" size="small" variant="text">
              <NIcon :component="IdBadge" mr-1 />
              证件照
            </c-button>
          </c-tooltip>
        </div>

        <c-tooltip position="bottom" tooltip-class="ifangan-tooltip-popover">
          <c-button
            round
            href="https://www.i41.cn"
            rel="noopener noreferrer"
            target="_blank"
            class="ifangan-button"
            :bordered="false"
            aria-label="访问i方案"
            @click="() => tracker.trackEvent({ eventName: 'Visit i41 button clicked' })"
          >
            访问i方案
          </c-button>

          <template #tooltip>
            <div class="ifangan-tooltip">
              i方案是一套面向本地实体商家、内容运营人员和营销服务团队的智能内容工作平台。平台围绕行业、平台、品类、风格和使用场景，提供文案生成、文案诊断、客户跟单话术、文生图、视频包制作和精品模板等能力，帮助用户从内容构思、表单草稿、生成优化到后续复用形成完整工作链路。
            </div>
          </template>
        </c-tooltip>

        <c-tooltip position="bottom" :tooltip="$t('home.support')">
          <c-button
            round
            href="https://www.buymeacoffee.com/cthmsst"
            rel="noopener"
            target="_blank"
            class="support-button"
            :bordered="false"
            @click="() => tracker.trackEvent({ eventName: 'Support button clicked' })"
          >
            {{ $t('home.buyMeACoffee') }}
            <NIcon v-if="!styleStore.isSmallScreen" :component="Heart" ml-2 />
          </c-button>
        </c-tooltip>
      </div>
      <slot />
    </template>
  </MenuLayout>
</template>

<style lang="less" scoped>
// ::v-deep(.n-layout-scroll-container) {
//     @percent: 4%;
//     @position: 25px;
//     @size: 50px;
//     @color: #eeeeee25;
//     background-image: radial-gradient(@color @percent, transparent @percent),
//         radial-gradient(@color @percent, transparent @percent);
//     background-position: 0 0, @position @position;
//     background-size: @size @size;
// }

.ifangan-button {
  margin-right: 8px;
  font-weight: 600;
  box-shadow: 0 0 0 1px v-bind('themeVars.primaryColor');
}

.company-tools-links {
  display: flex;
  align-items: center;
  gap: 2px;
  white-space: nowrap;
}

.company-tools-links--mobile {
  width: 90%;
  justify-content: center;
  flex-wrap: wrap;
  margin: 8px 0 4px;
}

::v-deep(.ifangan-tooltip-popover) {
  width: min(520px, calc(100vw - 32px));
  max-width: 520px;
  white-space: normal;
  transform-origin: top right;
}

::v-deep(.ifangan-tooltip-popover.top-100\%) {
  right: 0;
  left: auto;
  transform: none;
}

::v-deep(.company-tool-tooltip-popover) {
  width: min(360px, calc(100vw - 32px));
  max-width: 360px;
  white-space: normal;
  line-height: 1.7;
  text-align: left;
}

.ifangan-tooltip {
  line-height: 1.7;
  text-align: left;
}

.support-button {
  background: rgb(37, 99, 108);
  background: linear-gradient(48deg, rgba(37, 99, 108, 1) 0%, rgba(59, 149, 111, 1) 60%, rgba(20, 160, 88, 1) 100%);
  color: #fff !important;
  transition: padding ease 0.2s !important;

  &:hover {
    color: #fff;
    padding-left: 30px;
    padding-right: 30px;
  }
}

.footer {
  text-align: center;
  color: #838587;
  margin-top: 20px;
  padding: 20px 0;
}

.sider-content {
  padding-top: 160px;
  padding-bottom: 200px;
}

.hero-wrapper {
  position: absolute;
  display: block;
  left: 0;
  width: 100%;
  z-index: 10;
  overflow: hidden;

  .gradient {
    margin-top: -65px;
  }

  .text-wrapper {
    position: absolute;
    left: 0;
    width: 100%;
    text-align: center;
    top: 16px;
    color: #fff;

    .title {
      font-size: 25px;
      font-weight: 600;
    }

    .divider {
      width: 50px;
      height: 2px;
      border-radius: 4px;
      background-color: v-bind('themeVars.primaryColor');
      margin: 0 auto 5px;
    }

    .subtitle {
      font-size: 16px;
    }
  }
}
</style>
