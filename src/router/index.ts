import { createRouter, createWebHistory } from 'vue-router'

import TabelSalesOrder from '../views/TabelSalesOrder.vue'
import GrafikSalesOrder from '../views/GrafikSalesOrder.vue'
import DetailSalesOrder from '../views/DetailSalesOrder.vue'
import Chatbot from '../views/Chatbot.vue'
import Login from '@/views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'tabel-sales-order',
      component: TabelSalesOrder,
    },

    {
      path: '/login',
      name: 'login',
      component: Login,
    },

    {
      path: '/:noTrxSo',
      name: 'detail-sales-order',
      component: DetailSalesOrder,
    },

    {
      path: '/grafik-sales-order',
      name: 'grafik-sales-order',
      component: GrafikSalesOrder,
    },

    {
      path: '/chatbot',
      name: 'chatbot',
      component: Chatbot,
    },
  ],
})

export default router