import { createRouter, createWebHistory} from 'vue-router'


import Authentification from '../components/authentification.vue'
import Main from '../components/Main.vue'
import Article from '../components/Article.vue'
import Account from '../components/Account.vue'
import Help from '../components/Help.vue'
import Redaction from '../components/Redaction.vue'
import Error from '../components/Error.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [      
        {
            path: '/main/:userId',
            name: 'Main',
            component: Main,
            props: true
        },
        {
            path: '/',
            name: 'Authentification',
            component: Authentification, 
        },
        {
            path: '/main/:userId/article/:articleId',
            name: 'Article',
            component: Article, 
        },       
        {
            path: '/main/:userId/account',
            name: 'Account',
            component: Account, 
        },
        {
            path: '/main/:userId/help',
            name: 'Help',
            component: Help,
        },
        {
            path: '/main/:userId/redact-article',
            name: 'Redaction',
            component: Redaction,
        },
        {
            path: '/error/:userId',
            name: 'Error',
            component: Error,
        },
            


    ]
})

export default router