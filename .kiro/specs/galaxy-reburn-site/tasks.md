# 实现计划：galaxy-reburn-site

## 概述

基于 VitePress 构建《银河浴火》双语阅读站点，在现有小说仓库中新增 `docs/` 子目录，整理中英文章节内容，配置 i18n、侧边栏、字数徽章组件，并通过 GitHub Actions 自动部署至 GitHub Pages。

---

## 任务

- [x] 1. 初始化项目结构与依赖
  - 在仓库根目录创建 `package.json`，添加 `vitepress`（^1.3.0）和 `gray-matter`（^4.0.3）依赖
  - 创建 `docs/` 目录及 `docs/.vitepress/` 子目录
  - 创建 `docs/.vitepress/theme/` 子目录
  - 创建 `scripts/` 目录
  - 在 `.gitignore` 中追加 `node_modules/` 和 `docs/.vitepress/dist/`
  - 删除 `Old_English/` 目录（已废弃）
  - _需求：1.1、7.1、6.5_

- [x] 2. 编写 VitePress 主配置文件
  - [x] 2.1 创建 `docs/.vitepress/config.ts`，配置 `title`、`base`（`/GalaxyReburn/`）、`locales`（`root` 为中文 `/zh/`，`en` 为英文 `/en/`）
    - 实现中文侧边栏（`zhSidebar`）：列出全部 10 章 + 间章，按阅读顺序排列，标题使用中文
    - 实现英文侧边栏（`enSidebar`）：列出全部 10 章 + 间章，按阅读顺序排列，标题使用英文
    - 实现中文顶部导航（`zhNav`）：首页 + 世界观设定入口
    - 实现英文顶部导航（`enNav`）：Home + World Setting 入口
    - 世界观设定页（`000`）不列入主章节侧边栏，仅通过顶部导航访问
    - _需求：1.1、2.1、2.5、3.1、3.2、3.4、3.5、6.4、7.2_

  - [x] 2.2 验证侧边栏配置覆盖所有章节
    - 确认 `enSidebar` 和 `zhSidebar` 各包含 11 个条目（10 章 + 1 间章）
    - 确认 URL 格式符合 `/<locale>/<NNN>-<slug>/` 模式
    - _需求：3.6、6.1、6.2、6.3_

- [x] 3. 创建自定义主题与阅读样式
  - [x] 3.1 创建 `docs/.vitepress/theme/custom.css`
    - 设置正文字体为 serif 字族（`Georgia`、`Noto Serif SC`、`Source Han Serif`）
    - 设置行高不低于 1.85（满足需求 ≥1.7）
    - 限制内容列宽为 `70ch`
    - 设置段落间距 `1.2em`
    - 设置 `blockquote` 引言块样式（斜体、左边框、次要文字色）
    - _需求：5.1、5.2、5.3、5.6_

  - [x] 3.2 创建 `docs/.vitepress/theme/WordCountBadge.vue`
    - 使用 `useData()` 读取 `frontmatter.wordCount` 和 `lang`
    - 若 `wordCount` 不存在则不渲染任何内容
    - 根据语言显示"字"或"words"单位
    - 使用 VitePress CSS 变量（`--vp-c-bg-soft`、`--vp-c-text-2`）保证明暗主题兼容
    - _需求：4.1、4.2、4.3、4.4_

  - [x] 3.3 创建 `docs/.vitepress/theme/index.ts`
    - 继承 `DefaultTheme`
    - 全局注册 `WordCountBadge` 组件
    - 引入 `custom.css`
    - _需求：4.3、5.4_

- [x] 4. 整理并创建章节 Markdown 文件
  - [x] 4.1 在 `docs/en/` 下创建全部 12 个英文章节文件（含 `000-background-settings.md` 和间章），从 `English/` 目录复制内容并整理
    - 文件命名遵循 `<NNN>-<slug>.md` 格式（零填充三位数字前缀）
    - 每个文件顶部添加 Frontmatter 块（`wordCount` 字段暂留空或设为 0）
    - 在 Frontmatter 下方添加 `<WordCountBadge />` 组件调用
    - _需求：3.6、4.2、6.1、7.4_

  - [x] 4.2 在 `docs/zh/` 下创建全部 12 个中文章节文件（含 `000-background-settings.md` 和间章），从 `中文版/` 目录复制内容并整理
    - 文件命名与英文目录结构一致
    - 每个文件顶部添加 Frontmatter 块和 `<WordCountBadge />` 组件调用
    - _需求：3.6、4.2、6.2、7.4_

- [x] 5. 创建首页
  - 创建 `docs/index.md`，使用 VitePress `layout: home` 格式
  - `hero` 区域同时显示中英文标题（`name`、`text`）和双语简介（`tagline`）
  - 提供两个 CTA 按钮：开始阅读（中文 `/zh/001-...`）和 Start Reading（英文 `/en/001-...`）
  - `features` 区域显示作者名和中英双语故事简介
  - 页面底部添加同人声明（版权归 Firi Games 所有，非商业创作）
  - _需求：8.1、8.2、8.3、8.4、8.5_

- [x] 6. 编写字数统计脚本
  - [x] 6.1 创建 `scripts/count-words.cjs`
    - 使用 `gray-matter` 解析 Markdown Frontmatter
    - 扫描 `docs/en/` 和 `docs/zh/` 下所有 `.md` 文件
    - 英文文件：去除标题、HTML 标签、代码块后，按空白分隔统计单词数
    - 中文文件：去除标题、HTML 标签、代码块后，统计 CJK 字符数（`\u4e00-\u9fff`、`\u3400-\u4dbf`）
    - 将计算结果写入每个文件的 `wordCount` Frontmatter 字段（不存在则创建）
    - 脚本幂等：多次运行结果相同
    - 统计时排除 Frontmatter 内容本身
    - _需求：4.5、4.6、9.1、9.2、9.3、9.4、9.5、9.6_

  - [ ]* 6.2 为字数统计脚本编写单元测试
    - 测试英文单词计数逻辑（含标题/HTML/代码块过滤）
    - 测试中文 CJK 字符计数逻辑
    - 测试 Frontmatter 写入与幂等性
    - _需求：9.5、9.6_

- [x] 7. 在 `package.json` 中添加 npm 脚本
  - 添加 `docs:dev`（`vitepress dev docs`）
  - 添加 `docs:build`（`vitepress build docs`）
  - 添加 `docs:preview`（`vitepress preview docs`）
  - 添加 `count-words`（`node scripts/count-words.js`）
  - _需求：1.1、9.7_

- [x] 8. 检查点 — 本地构建验证
  - 确认 `npm run docs:build` 能够成功完成，无报错
  - 确认所有章节页面路由正确生成
  - 确认 `WordCountBadge` 组件在有/无 `wordCount` 字段时行为正确
  - 如有问题，向用户反馈后继续。

- [x] 9. 配置 GitHub Actions 部署工作流
  - 创建 `.github/workflows/deploy.yml`
  - 触发条件：`push` 到 `main` 分支，以及 `workflow_dispatch`
  - 配置 `permissions`：`contents: read`、`pages: write`、`id-token: write`
  - `build` job：checkout → setup-node（v20，启用 npm cache）→ `npm ci` → `npm run docs:build` → 上传 `docs/.vitepress/dist` 为 Pages artifact
  - `deploy` job：依赖 `build` job，使用 `actions/deploy-pages@v4` 部署
  - 构建失败时不部署（通过 job 依赖关系保证）
  - _需求：1.2、1.3、1.4、1.5、9.7_

- [x] 10. 最终检查点 — 完整验证
  - 确认所有文件已创建且路径正确
  - 确认 `docs/en/` 和 `docs/zh/` 各有 12 个 Markdown 文件
  - 确认 `Old_English/` 目录已删除
  - 确认 GitHub Actions 工作流文件语法正确
  - 如有问题，向用户反馈后继续。

---

## 备注

- 标有 `*` 的子任务为可选项，可跳过以加快 MVP 进度
- 每个任务均引用了对应的需求条款，便于追溯
- 字数统计脚本（`count-words.js`）需在添加或更新章节后手动运行，不集成到 CI 构建流程中
- VitePress 明暗主题切换由框架内置支持，`custom.css` 使用 CSS 变量自动适配
- 侧边栏为手动维护，新增章节只需在 `config.ts` 中添加一条条目

## 任务依赖图

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1", "3.1", "3.2", "6.1"] },
    { "id": 2, "tasks": ["2.2", "3.3", "4.1", "4.2", "7"] },
    { "id": 3, "tasks": ["5", "6.2"] },
    { "id": 4, "tasks": ["9"] }
  ]
}
```
