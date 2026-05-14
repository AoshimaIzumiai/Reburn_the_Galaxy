#!/usr/bin/env node
/**
 * count-words.js
 * Computes word counts for all chapter Markdown files and writes them
 * into each file's YAML frontmatter as `wordCount`.
 *
 * English files: whitespace-delimited word count
 * Chinese files: CJK character count (汉字数)
 *
 * Usage: node scripts/count-words.js
 */

const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const DOCS_DIR = path.join(__dirname, '..', 'docs')
const LOCALES = ['en', 'zh']

/**
 * Strip Markdown headings, HTML tags, fenced code blocks, and inline code
 * from content before counting.
 */
function stripMarkdown(content) {
  return content
    .replace(/^#{1,6}\s+.*/gm, '')          // headings
    .replace(/```[\s\S]*?```/g, ' ')         // fenced code blocks
    .replace(/`[^`\n]+`/g, ' ')              // inline code
    .replace(/<[^>]+>/g, ' ')                // HTML tags
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // markdown links → keep text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')    // images → remove
}

/**
 * Count English words (whitespace-delimited tokens).
 */
function countEnglishWords(content) {
  const cleaned = stripMarkdown(content)
  const tokens = cleaned.trim().split(/\s+/).filter(w => w.length > 0)
  return tokens.length
}

/**
 * Count CJK characters (汉字数).
 */
function countCJKChars(content) {
  const cleaned = stripMarkdown(content)
  const matches = cleaned.match(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g)
  return matches ? matches.length : 0
}

let totalFiles = 0
let totalUpdated = 0

LOCALES.forEach(locale => {
  const dir = path.join(DOCS_DIR, locale)
  if (!fs.existsSync(dir)) {
    console.warn(`[warn] Directory not found: ${dir}`)
    return
  }

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'))

  files.forEach(filename => {
    const filepath = path.join(dir, filename)
    const raw = fs.readFileSync(filepath, 'utf-8')
    const parsed = matter(raw)

    const count = locale === 'zh'
      ? countCJKChars(parsed.content)
      : countEnglishWords(parsed.content)

    const prevCount = parsed.data.wordCount
    parsed.data.wordCount = count

    const updated = matter.stringify(parsed.content, parsed.data)
    fs.writeFileSync(filepath, updated, 'utf-8')

    const unit = locale === 'zh' ? '字' : 'words'
    const changed = prevCount !== count ? ' (updated)' : ''
    console.log(`[${locale}] ${filename}: ${count.toLocaleString()} ${unit}${changed}`)

    totalFiles++
    if (prevCount !== count) totalUpdated++
  })
})

console.log(`\nDone. Processed ${totalFiles} files, updated ${totalUpdated}.`)
