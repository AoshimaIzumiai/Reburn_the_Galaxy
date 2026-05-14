# Design Document: galaxy-reburn-site

## Overview

基于 VitePress 构建的《银河浴火》双语小说阅读站点。项目在现有小说仓库中新增一个 `docs/` 子目录作为 VitePress 源，原有小说 Markdown 文件经过整理后复制至 `docs/en/` 和 `docs/zh/`，通过 GitHub Actions 自动部署至 GitHub Pages。

---

## 1. 项目目录结构

```
GalaxyReburn/
├── docs/                          # VitePress 源目录
│   ├── .vitepress/
│   │   ├── config.ts              # 主配置文件（i18n、sidebar、nav）
│   │   ├── theme/
│   │   │   ├── index.ts           # 自定义主题入口
│   │   │   ├── WordCountBadge.vue # 字数徽章组件
│   │   │   └── custom.css         # 阅读样式覆盖
│   ├── index.md                   # 双语首页（根路径 /）
│   ├── en/                        # 英文章节
│   │   ├── 000-background-settings.md
│   │   ├── 001-chapter-1-prologue-phoenix.md
│   │   ├── 002-chapter-2-the-journey-begins.md
│   │   ├── 003-chapter-3-fireworks-in-space.md
│   │   ├── 004-chapter-4-ablaze.md
│   │   ├── 005-chapter-5-her-will.md
│   │   ├── 006-chapter-6-after-the-storm.md
│   │   ├── 006-interlude-i-blight-chrysanthemum-candy.md
│   │   ├── 007-chapter-7-prometheus-array.md
│   │   ├── 008-chapter-8-dreams.md
│   │   ├── 009-chapter-9-her-the-illusion-and-the-crossroads.md
│   │   └── 010-chapter-10-to-my-dearest-friend.md
│   └── zh/                        # 中文章节
│       ├── 000-background-settings.md
│       ├── 001-chapter-1-prologue-phoenix.md
│       ├── ... (同英文结构)
│       └── 010-chapter-10-to-my-dearest-friend.md
├── scripts/
│   └── count-words.js             # 字数统计脚本
├── .github/
│   └── workflows/
│       └── deploy.yml             # GitHub Actions 部署工作流
├── package.json
└── English/、中文版/、设定/        # 原有小说文件（保留，不纳入站点）
```

---

## 2. VitePress 配置（config.ts）

### 2.1 i18n 与基础配置

```typescript
// docs/.vitepress/config.ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '银河浴火 | Reburn the Galaxy',
  base: '/GalaxyReburn/',  // GitHub Pages 仓库名

  locales: {
    root: {
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
    // 全局配置
  }
})
```

### 2.2 侧边栏配置（手动维护）

```typescript
const enSidebar = [
  {
    text: 'Chapters',
    items: [
      { text: 'Chapter 1: Prologue — Phoenix',              link: '/en/001-chapter-1-prologue-phoenix' },
      { text: 'Chapter 2: The Journey Begins',              link: '/en/002-chapter-2-the-journey-begins' },
      { text: 'Chapter 3: Fireworks in Space',              link: '/en/003-chapter-3-fireworks-in-space' },
      { text: 'Chapter 4: Ablaze',                          link: '/en/004-chapter-4-ablaze' },
      { text: 'Chapter 5: Her Will',                        link: '/en/005-chapter-5-her-will' },
      { text: 'Chapter 6: After the Storm',                 link: '/en/006-chapter-6-after-the-storm' },
      { text: 'Interlude I: Blight Chrysanthemum Candy',    link: '/en/006-interlude-i-blight-chrysanthemum-candy' },
      { text: 'Chapter 7: Prometheus Array',                link: '/en/007-chapter-7-prometheus-array' },
      { text: 'Chapter 8: Dreams',                          link: '/en/008-chapter-8-dreams' },
      { text: 'Chapter 9: Her, the Illusion, and the Crossroads', link: '/en/009-chapter-9-her-the-illusion-and-the-crossroads' },
      { text: 'Chapter 10: To My Dearest Friend',           link: '/en/010-chapter-10-to-my-dearest-friend' },
    ]
  }
]

// 中文侧边栏结构相同，文字替换为中文标题
```

### 2.3 顶部导航（含世界观入口）

```typescript
const enNav = [
  { text: 'Home', link: '/' },
  { text: 'World Setting', link: '/en/000-background-settings' },
]

const zhNav = [
  { text: '首页', link: '/' },
  { text: '世界观设定', link: '/zh/000-background-settings' },
]
```

---

## 3. 字数徽章组件（WordCountBadge.vue）

### 3.1 组件设计

```vue
<!-- docs/.vitepress/theme/WordCountBadge.vue -->
<template>
  <div v-if="wordCount" class="word-count-badge">
    <span class="badge-icon">📖</span>
    <span class="badge-text">{{ formattedCount }} {{ unit }}</span>
  </div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

const { frontmatter, lang } = useData()

const wordCount = computed(() => frontmatter.value.wordCount)
const isZh = computed(() => lang.value === 'zh-CN')

const formattedCount = computed(() => {
  if (!wordCount.value) return ''
  return wordCount.value.toLocaleString()
})

const unit = computed(() => isZh.value ? '字' : 'words')
</script>

<style scoped>
.word-count-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.85em;
  margin-bottom: 1.5rem;
}
</style>
```

### 3.2 注册到自定义主题

```typescript
// docs/.vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import WordCountBadge from './WordCountBadge.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('WordCountBadge', WordCountBadge)
  }
}
```

### 3.3 在章节 Markdown 中使用

每个章节文件顶部添加 Frontmatter 和组件调用：

```markdown
---
wordCount: 3842
---

<WordCountBadge />

# Chapter 1: Prologue — Phoenix
...
```

---

## 4. 字数统计脚本（scripts/count-words.js）

```javascript
// scripts/count-words.js
const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')  // npm install gray-matter

const DOCS_DIR = path.join(__dirname, '../docs')
const LOCALES = ['en', 'zh']

function countWords(content, locale) {
  // 去除 Markdown 标题、HTML 标签、代码块
  const cleaned = content
    .replace(/^#{1,6}\s+.*/gm, '')      // 去除标题
    .replace(/<[^>]+>/g, '')             // 去除 HTML 标签
    .replace(/```[\s\S]*?```/g, '')      // 去除代码块
    .replace(/`[^`]+`/g, '')             // 去除行内代码

  if (locale === 'zh') {
    // 中文：统计 CJK 字符数
    const cjkMatches = cleaned.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g)
    return cjkMatches ? cjkMatches.length : 0
  } else {
    // 英文：统计空白分隔的单词数
    const words = cleaned.trim().split(/\s+/).filter(w => w.length > 0)
    return words.length
  }
}

LOCALES.forEach(locale => {
  const dir = path.join(DOCS_DIR, locale)
  if (!fs.existsSync(dir)) return

  fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .forEach(filename => {
      const filepath = path.join(dir, filename)
      const raw = fs.readFileSync(filepath, 'utf-8')
      const parsed = matter(raw)

      const count = countWords(parsed.content, locale)
      parsed.data.wordCount = count

      const updated = matter.stringify(parsed.content, parsed.data)
      fs.writeFileSync(filepath, updated, 'utf-8')
      console.log(`[${locale}] ${filename}: ${count.toLocaleString()} ${locale === 'zh' ? '字' : 'words'}`)
    })
})
```

运行方式：`node scripts/count-words.js`

---

## 5. 自定义阅读样式（custom.css）

```css
/* docs/.vitepress/theme/custom.css */

/* 章节页面正文样式 */
.vp-doc {
  font-family: 'Georgia', 'Noto Serif SC', 'Source Han Serif', serif;
  line-height: 1.85;
}

/* 限制内容宽度 */
.vp-doc .content-container,
.VPDoc .container {
  max-width: 70ch;
}

/* 段落间距 */
.vp-doc p {
  margin: 1.2em 0;
}

/* 引言块样式（用于章节题词） */
.vp-doc blockquote {
  font-style: italic;
  border-left: 3px solid var(--vp-c-brand);
  padding-left: 1em;
  color: var(--vp-c-text-2);
}
```

---

## 6. GitHub Actions 部署工作流

```yaml
# .github/workflows/deploy.yml
name: Deploy VitePress to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build VitePress
        run: npm run docs:build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 7. 首页设计（docs/index.md）

```markdown
---
layout: home

hero:
  name: "银河浴火"
  text: "Reburn the Galaxy"
  tagline: "基于 Phoenix II 的同人小说 | A fanfiction based on Phoenix II"
  actions:
    - theme: brand
      text: 开始阅读（中文）
      link: /zh/001-chapter-1-prologue-phoenix
    - theme: alt
      text: Start Reading (English)
      link: /en/001-chapter-1-prologue-phoenix
    - theme: alt
      text: 世界观设定
      link: /zh/000-background-settings

features:
  - title: 作者 / Author
    details: 菁鸟 Tsingpica
  - title: 简介
    details: 以渴望成为希普斯战士的少女凤凰为主视角，讲述她与挚友戴沙在银河对抗虚空军的战争中所经历的成长与故事。
  - title: Introduction
    details: Following Phoenix, a girl who dreams of becoming a Shipsian Warrior, and her close friend Disar, as they grow and struggle through the galactic war against the Void Army.
---

> ⚠️ *Phoenix II* and all related intellectual property belong to **Firi Games**. This project is a non-commercial fanfiction and is not affiliated with the original developers.
```

---

## 8. package.json 脚本

```json
{
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs",
    "count-words": "node scripts/count-words.js"
  },
  "devDependencies": {
    "vitepress": "^1.3.0"
  },
  "dependencies": {
    "gray-matter": "^4.0.3"
  }
}
```

---

## 9. 数据流图

```
原始 Markdown 文件 (English/, 中文版/)
        │
        ▼ 复制/整理
docs/en/*.md  docs/zh/*.md
        │
        ▼ node scripts/count-words.js（手动运行）
Frontmatter: wordCount: N
        │
        ▼ git push to main
GitHub Actions: npm run docs:build
        │
        ▼
docs/.vitepress/dist/  →  GitHub Pages
```
