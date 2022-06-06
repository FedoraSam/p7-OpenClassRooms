import { createApp } from 'vue'

import router from '@/router'
import App from './App.vue'
import Header from './components/Menu.vue'

const app = createApp(App)
const header = createApp(Header)

header.use(router).mount('#header')
app.use(router).mount('#app')

