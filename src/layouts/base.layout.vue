<script lang="ts" setup>
import { NIcon, useThemeVars } from 'naive-ui';

import { RouterLink } from 'vue-router';
import { Heart, Home2, Menu2 } from '@vicons/tabler';

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

const ecosystemNavItems = [
  { label: 'i方案', href: 'https://www.i41.cn?utm_source=tools&utm_medium=tool_referral&utm_campaign=ifangan&utm_content=ecosystem_nav', tooltip: 'i方案是一套面向本地实体商家、内容运营人员和营销服务团队的智能内容工作平台。平台围绕行业、平台、品类、风格和使用场景，提供文案生成、文案诊断、客户跟单话术、文生图、视频包制作和精品模板等能力，帮助用户从内容构思、表单草稿、生成优化到后续复用形成完整工作链路。', cta: true },
  { label: '图片压缩', href: 'https://imgzip.i41.cn', tooltip: '图片修改压缩是一款浏览器端在线图片处理工具，支持压缩、调整尺寸和格式转换，图片尽量在本地处理，适合日常上传、分享和网页优化。' },
  { label: 'HEIC 转换', href: 'https://imgzip.i41.cn/heic-converter/', tooltip: 'HEIC 转换工具可在浏览器本地将 HEIC、HEIF 和 WebP 转为 JPG 或 PNG。' },
  { label: '智能抠图', href: 'https://imgzip.i41.cn/remove-background/', tooltip: '智能抠图在浏览器中自动移除图片背景，适合人像和商品图快速换背景。' },
  { label: '多图拼接', href: 'https://imgzip.i41.cn/collage/', tooltip: '多图拼接支持在浏览器中组合多张图片并调整布局。' },
  { label: 'PDF 工具', href: 'https://pdf.i41.cn', tooltip: 'PDF 工具箱提供合并、拆分、压缩、转换、编辑、OCR 和发票拼版等浏览器端 PDF 处理能力。' },
  { label: '证件水印', href: 'https://watermark.i41.cn', tooltip: '证件水印工具支持为身份证、营业执照和合同截图添加用途水印，图片仅在浏览器本地处理。' },
  { label: '临时剪贴板', href: 'https://clip.i41.cn', tooltip: '临时剪贴板支持客户端加密、自动过期、读取次数限制和阅后即焚，适合跨设备传递临时文本。' },
  { label: '证件照', href: 'https://idphoto.i41.cn', tooltip: '证件照工作室是一款浏览器端证件照制作工具，支持本地智能抠图、背景换色、常用证件尺寸和 300DPI 多图拼版，照片无需上传到业务服务器。' },
];
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

        </div>

        <CollapsibleToolMenu :tools-by-category="tools" />

        <div class="footer">
          <details class="footer-disclosure">
            <summary aria-label="关于 IT-Tools 与隐私">关于与隐私</summary>
            <div class="footer-disclosure__content">
              <div>
                基于上游
                <c-link target="_blank" rel="noopener" :href="`https://github.com/CorentinTh/it-tools/tree/v${version}`">
                  IT-Tools v{{ version }}
                </c-link>
                （MIT License）
                <template v-if="commitSha && commitSha.length > 0">
                  ·
                  <c-link target="_blank" rel="noopener" type="primary" :href="`https://github.com/CorentinTh/it-tools/tree/${commitSha}`">
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
              <div class="privacy-notice">隐私说明：常用工具在浏览器处理。我们会发送匿名访问、UTM 参数和跨站点击事件；不发送输入内容、文件名或永久标识。</div>
            </div>
          </details>
        </div>
      </div>
    </template>

    <template #content>
      <header class="ecosystem-header">
        <RouterLink to="/" class="ecosystem-brand" aria-label="IT - TOOLS 首页" aria-current="page">
          <span class="ecosystem-brand__icon">IT</span>
          <span>IT - TOOLS</span>
        </RouterLink>
        <nav class="ecosystem-nav ecosystem-nav--desktop" aria-label="i41 产品导航">
          <a
            v-for="item in ecosystemNavItems"
            :key="item.label"
            class="ecosystem-nav__item"
            :class="{ 'ecosystem-nav__item--cta': item.cta }"
            :href="item.href"
            :data-tooltip="item.tooltip"
            :aria-label="item.tooltip"
          >{{ item.label }}</a>
        </nav>
      </header>
      <nav class="ecosystem-nav ecosystem-nav--mobile" aria-label="i41 产品导航">
        <a
          v-for="item in ecosystemNavItems"
          :key="item.label"
          class="ecosystem-nav__item"
          :class="{ 'ecosystem-nav__item--cta': item.cta }"
          :href="item.href"
          :data-tooltip="item.tooltip"
          :aria-label="item.tooltip"
        >{{ item.label }}</a>
      </nav>

      <div class="utility-bar" flex items-center justify-center gap-2>
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

.ecosystem-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  height: 64px;
  padding: 0 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
  color: #172133;
  box-sizing: border-box;
}

.ecosystem-brand {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  gap: 10px;
  color: #172133;
  font-size: 18px;
  font-weight: 800;
  text-decoration: none;
}

.ecosystem-brand__icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
  color: #fff;
  font-size: 13px;
  letter-spacing: -0.03em;
}

.ecosystem-nav {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.ecosystem-nav__item {
  position: relative;
  display: inline-flex;
  justify-content: center;
  padding: 8px 10px;
  border-radius: 8px;
  color: #4b5563;
  font-size: 14px;
  line-height: 20px;
  text-decoration: none;
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover {
    background: #eff6ff;
    color: #1d4ed8;
  }

  &::after {
    position: absolute;
    z-index: 20;
    top: calc(100% + 8px);
    left: 50%;
    padding: 5px 8px;
    border-radius: 6px;
    background: #172133;
    color: #fff;
    content: attr(data-tooltip);
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    opacity: 0;
    pointer-events: none;
    transform: translate(-50%, -4px);
    transition: opacity 0.15s ease, transform 0.15s ease;
  }

  &:hover::after,
  &:focus-visible::after {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.ecosystem-nav__item--cta {
  min-width: 72px;
  box-sizing: border-box;
  background: #2563eb;
  color: #fff;
  font-weight: 700;

  &:hover {
    background: #1d4ed8;
    color: #fff;
  }
}

.ecosystem-nav--mobile {
  display: none;
}

.utility-bar {
  min-height: 52px;
}

@media (max-width: 1180px) {
  .ecosystem-header {
    padding: 0 16px;
  }

  .ecosystem-nav--desktop {
    display: none;
  }

  .ecosystem-nav--mobile {
    display: flex;
    overflow-x: auto;
    padding: 8px 16px;
    border-bottom: 1px solid #e5e7eb;
    background: #fff;
    scrollbar-width: thin;
  }
}

@media (max-width: 480px) {
  .ecosystem-brand {
    font-size: 16px;
  }
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

.footer-disclosure summary {
  cursor: pointer;
  font-size: 12px;
}

.footer-disclosure__content {
  display: grid;
  gap: 6px;
  margin-top: 10px;
  padding: 0 12px;
  font-size: 12px;
  line-height: 1.5;
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
