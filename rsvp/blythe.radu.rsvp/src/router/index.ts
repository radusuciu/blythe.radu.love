import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import Response from '@/views/Response.vue'

const routes = [{
    path: '/',
    name: 'home',
    component: Home
}, {
    path: '/respond/:guestId',
    name: 'response',
    component: Response, 
    props: true,
}]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
