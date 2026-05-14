import { defineConfig } from 'vitepress'

const zhSidebar = [
  {
    text: '章节',
    items: [
      { text: '第一章 序幕：凤凰',                link: '/zh/001-chapter-1-prologue-phoenix' },
      { text: '第二章 将始之旅',                  link: '/zh/002-chapter-2-the-journey-begins' },
      { text: '第三章 太空花火',                  link: '/zh/003-chapter-3-fireworks-in-space' },
      { text: '第四章 燃烧着的',                  link: '/zh/004-chapter-4-ablaze' },
      { text: '第五章 她的意志',                  link: '/zh/005-chapter-5-her-will' },
      { text: '第六章 劫数之后',                  link: '/zh/006-chapter-6-after-the-storm' },
      { text: '第六章间章 布莱特菊味糖',           link: '/zh/006-interlude-i-blight-chrysanthemum-candy' },
      { text: '第七章 普罗米修斯阵列',             link: '/zh/007-chapter-7-prometheus-array' },
      { text: '第八章 梦与梦',                    link: '/zh/008-chapter-8-dreams' },
      { text: '第九章 她、幻境与岔路口',           link: '/zh/009-chapter-9-her-the-illusion-and-the-crossroads' },
      { text: '第十章 致挚友',                    link: '/zh/010-chapter-10-to-my-dearest-friend' },
    ]
  }
]

const enSidebar = [
  {
    text: 'Chapters',
    items: [
      { text: 'Chapter 1: Prologue — Phoenix',                        link: '/en/001-chapter-1-prologue-phoenix' },
      { text: 'Chapter 2: The Journey Begins',                        link: '/en/002-chapter-2-the-journey-begins' },
      { text: 'Chapter 3: Fireworks in Space',                        link: '/en/003-chapter-3-fireworks-in-space' },
      { text: 'Chapter 4: Ablaze',                                    link: '/en/004-chapter-4-ablaze' },
      { text: 'Chapter 5: Her Will',                                  link: '/en/005-chapter-5-her-will' },
      { text: 'Chapter 6: After the Storm',                           link: '/en/006-chapter-6-after-the-storm' },
      { text: 'Interlude I: Blight Chrysanthemum Candy',              link: '/en/006-interlude-i-blight-chrysanthemum-candy' },
      { text: 'Chapter 7: Prometheus Array',                          link: '/en/007-chapter-7-prometheus-array' },
      { text: 'Chapter 8: Dreams',                                    link: '/en/008-chapter-8-dreams' },
      { text: 'Chapter 9: Her, the Illusion, and the Crossroads',     link: '/en/009-chapter-9-her-the-illusion-and-the-crossroads' },
      { text: 'Chapter 10: To My Dearest Friend',                     link: '/en/010-chapter-10-to-my-dearest-friend' },
    ]
  }
]

const zhNav = [
  { text: '首页', link: '/' },
  { text: '世界观设定', link: '/zh/000-background-settings' },
]

const enNav = [
  { text: 'Home', link: '/' },
  { text: 'World Setting', link: '/en/000-background-settings' },
]

export default defineConfig({
  title: '银河浴火 | Reburn the Galaxy',
  base: '/Reburn_the_Galaxy/',

  locales: {
    zh: {
      label: '中文',
      lang: 'zh-CN',
      link: '/zh/',
      themeConfig: {
        nav: zhNav,
        sidebar: zhSidebar,
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        nav: enNav,
        sidebar: enSidebar,
      }
    }
  },

  themeConfig: {
    // 全局主题配置（明暗切换由 VitePress 内置支持）
  }
})
