import DefaultTheme from 'vitepress/theme'
import WordCountBadge from './WordCountBadge.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: { app: any }) {
    app.component('WordCountBadge', WordCountBadge)
  }
}
