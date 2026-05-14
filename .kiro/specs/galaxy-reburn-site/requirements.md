# Requirements Document

## Introduction

《银河浴火》（Reburn the Galaxy）阅读站点是一个基于 VitePress 构建的静态网站，用于托管同名同人小说的中英双语章节内容。网站部署于 GitHub Pages，面向小说读者提供舒适的阅读体验，支持中英文切换、章节导航、字数预览及明暗主题。站点结构需支持未来扩展至 100+ 章节而无需重构。

## Glossary

- **Site**：指整个 VitePress 静态阅读站点
- **Reader**：访问站点阅读小说的用户
- **Chapter Page**：展示单个章节正文内容的页面
- **Sidebar**：页面左侧的章节导航栏，手动维护
- **Language Switcher**：顶部导航栏中用于切换中英文版本的控件
- **Word Count Badge**：章节页面顶部显示的静态字数标记
- **Frontmatter**：Markdown 文件顶部的 YAML 元数据块，用于存储字数等预计算数据
- **Theme**：VitePress 的视觉主题，包含明色模式（light）和暗色模式（dark）
- **GitHub Actions**：用于自动化构建和部署的 CI/CD 工作流
- **Interlude**：正章之间的间章（如"第六章间章"）
- **Word Count Script**：离线运行的 Node.js 脚本，用于计算各章节字数并写入 Frontmatter；英文按单词数（word count），中文按汉字数；需手动运行，不在构建流程中执行
- **World Setting Page**：000 设定页，作为独立的"世界观"入口，不列入主章节侧边栏

---

## Requirements

### Requirement 1: VitePress 框架与 GitHub Pages 部署

**User Story:** As a reader, I want to access the novel on a stable, publicly available website, so that I can read chapters from any device without needing to download files.

#### Acceptance Criteria

1. THE Site SHALL be built using VitePress as the static site generator framework.
2. THE Site SHALL be hosted on GitHub Pages under a public repository.
3. WHEN a commit is pushed to the `main` branch, THE GitHub Actions Workflow SHALL automatically build the VitePress site and deploy the output to GitHub Pages.
4. IF the build step fails, THEN THE GitHub Actions Workflow SHALL report the failure and SHALL NOT deploy a broken build to GitHub Pages.
5. THE Site SHALL be accessible via a public HTTPS URL after successful deployment.

---

### Requirement 2: 双语支持与语言切换

**User Story:** As a reader, I want to switch between the Chinese and English versions of the novel, so that I can read in my preferred language.

#### Acceptance Criteria

1. THE Site SHALL provide both a Chinese (`/zh/`) and an English (`/en/`) locale, each containing the full set of available chapters.
2. THE Language Switcher SHALL be displayed in the top navigation bar on every page.
3. WHEN a Reader selects a language in the Language Switcher, THE Site SHALL navigate to the corresponding locale's equivalent page.
4. THE Site SHALL NOT automatically redirect the Reader based on browser language; locale selection SHALL be left entirely to the Reader.
5. THE Site SHALL use VitePress's built-in i18n configuration to manage the two locales.

---

### Requirement 3: 手动维护的侧边栏导航

**User Story:** As a reader, I want to see a structured chapter list in the sidebar, so that I can navigate directly to any chapter.

#### Acceptance Criteria

1. THE Sidebar SHALL list all currently available chapters for the active locale, including interludes, in reading order.
2. THE Sidebar SHALL be defined via hand-written VitePress configuration, not auto-generated from the file system.
3. WHEN a Reader clicks a chapter entry in the Sidebar, THE Site SHALL navigate to that chapter's page.
4. THE Sidebar SHALL display each chapter's title in the language of the active locale.
5. THE Sidebar configuration SHALL support adding new chapter entries without requiring changes to any source code outside the VitePress config file.
6. THE Chapter Page URL SHALL follow the pattern `/<locale>/<NNN>-<slug>/` where `<NNN>` is the zero-padded three-digit chapter number and `<slug>` is a URL-safe title derived from the chapter title (e.g., `/en/001-chapter-1-prologue/`).

---

### Requirement 4: 章节页面静态字数显示

**User Story:** As a reader, I want to see the word count of a chapter before I start reading, so that I can gauge how long it will take to read.

#### Acceptance Criteria

1. THE Chapter Page SHALL display a Word Count Badge at the top of the page, above the chapter body text.
2. THE Word Count Badge SHALL show the pre-computed word count value stored in the chapter file's Frontmatter field `wordCount`.
3. THE Site SHALL use a VitePress custom component or Markdown extension to render the Word Count Badge from the `wordCount` Frontmatter value.
4. IF a chapter file's Frontmatter does not contain a `wordCount` field, THEN THE Chapter Page SHALL NOT display a Word Count Badge for that chapter.
5. THE word count values SHALL be computed offline via the Word Count Script and written into each chapter file's Frontmatter before deployment; THE Site SHALL NOT compute word counts at build time or runtime.
6. FOR English chapter files, THE Word Count Script SHALL count the number of whitespace-delimited words (word count). FOR Chinese chapter files, THE Word Count Script SHALL count the number of CJK characters (汉字数).

---

### Requirement 5: 适合小说阅读的视觉样式

**User Story:** As a reader, I want a comfortable reading experience with appropriate typography and layout, so that I can read long chapters without eye strain.

#### Acceptance Criteria

1. THE Chapter Page SHALL render body text using a serif font family.
2. THE Chapter Page SHALL apply a line height of no less than 1.7 to body text.
3. THE Chapter Page SHALL constrain the content column width to approximately 70 characters (`70ch`) on desktop viewports.
4. THE Site SHALL provide both a light mode and a dark mode, toggled via the standard VitePress theme switcher in the top navigation bar.
5. WHEN a Reader toggles the theme, THE Site SHALL persist the selected theme across page navigations within the same session.
6. THE Chapter Page SHALL apply consistent typographic styles to both the Chinese and English locales.

---

### Requirement 6: 当前章节的完整覆盖

**User Story:** As a reader, I want all existing chapters to be accessible on the site, so that I can read the complete published story.

#### Acceptance Criteria

1. THE Site SHALL include pages for all English chapter files currently located in the `English/` directory, including the interlude (006 Interlude I).
2. THE Site SHALL include pages for all Chinese chapter files currently located in the `中文版/` directory, including the interlude (006 第六章间章).
3. THE Sidebar SHALL list all chapters described in Acceptance Criteria 1 and 2 in their correct reading order.
4. THE World Setting Page (`000`) SHALL be accessible from both locales via a dedicated navigation entry (e.g., a top nav link or a separate sidebar section labeled "世界观 / World Setting"), and SHALL NOT be listed as a numbered chapter in the main chapter Sidebar.
5. THE Site SHALL NOT include any content from the `Old_English/` directory; that directory is considered deprecated and SHALL be deleted from the repository.

---

### Requirement 7: 可扩展至 100+ 章节

**User Story:** As the site maintainer, I want the site structure to support future growth to 100 or more chapters, so that I never need to restructure the project when adding new content.

#### Acceptance Criteria

1. THE Site's directory structure and VitePress configuration SHALL support adding new chapter Markdown files without modifying any file outside the VitePress config and the new chapter file itself.
2. THE Sidebar configuration format SHALL remain consistent regardless of the total number of chapters, requiring only the addition of a new entry object per new chapter.
3. THE Site SHALL NOT use any build-time logic that imposes a hard limit on the number of chapters.
4. WHERE a chapter numbering scheme is used, THE Site SHALL use a zero-padded three-digit numeric prefix (e.g., `001`, `002`) to ensure correct lexicographic sort order for up to 999 chapters.

---

### Requirement 8: 首页与项目介绍

**User Story:** As a new reader, I want to see an introduction to the novel when I first visit the site, so that I understand what the story is about before I start reading.

#### Acceptance Criteria

1. THE Site SHALL provide a bilingual home page accessible at the root URL (`/`).
2. THE Home Page SHALL display the novel's title in both Chinese and English simultaneously.
3. THE Home Page SHALL display a brief introduction to the story in both Chinese and English simultaneously, without automatic locale redirection.
4. THE Home Page SHALL provide clearly labeled navigation links to begin reading from the first chapter in both the Chinese locale (`/zh/`) and the English locale (`/en/`).
5. THE Home Page SHALL display the author name and a disclaimer noting the fanfiction nature of the work.

---

### Requirement 9: 字数统计脚本

**User Story:** As the site maintainer, I want a script to automatically compute and write word counts into chapter Frontmatter, so that I do not have to count words manually when adding new chapters.

#### Acceptance Criteria

1. THE Word Count Script SHALL be a standalone Node.js script located in the repository (e.g., `scripts/count-words.js`).
2. WHEN executed, THE Word Count Script SHALL scan all Markdown files in the `docs/en/` and `docs/zh/` directories (or equivalent VitePress source directories).
3. FOR each scanned Markdown file, THE Word Count Script SHALL compute the word count according to the locale-specific rule: whitespace-delimited word count for English files, CJK character count for Chinese files.
4. THE Word Count Script SHALL write the computed value into the `wordCount` field of each file's Frontmatter, creating the Frontmatter block if it does not already exist.
5. THE Word Count Script SHALL be idempotent: running it multiple times on the same file SHALL produce the same result.
6. THE Word Count Script SHALL exclude Frontmatter content itself, Markdown headings (`#`), and HTML tags from the word/character count.
7. THE Word Count Script SHALL be run manually by the maintainer after adding or updating a chapter; it SHALL NOT be integrated into the GitHub Actions build workflow.
