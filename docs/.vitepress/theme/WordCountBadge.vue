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
