<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import Navigator from '@/components/Navigator.vue'
import { RouterView, useRoute } from 'vue-router'
import { useSalesOrderStore } from '@/stores/salesOrder'
import { useRouter } from 'vue-router';

const router = useRouter()
const currentTime = ref('')
const store = useSalesOrderStore();
const route = useRoute()
const isLoginPage = computed(() => route.path === '/login')
const isLoading = ref(true);

let interval: ReturnType<typeof setInterval>

const updateClock = () => {
    const now = new Date()

    currentTime.value =
        now.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        }) +
        ' ' +
        now.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        })
}

onMounted(async () => {
    updateClock();

    interval = setInterval(() => {
        updateClock();
    }, 1000);

    await store.fetchSalesOrders();

});

onUnmounted(() => {
    clearInterval(interval)
})

watch(
    () => store.loaded,
    (loaded) => {
        if (!loaded) return

        isLoading.value = false

        const token =
            localStorage.getItem('token') ||
            sessionStorage.getItem('token')

        router.push(token ? '/' : '/login')
    },
    { immediate: true }
)
</script>

<template>
    <template v-if="isLoading">
        <div class="flex flex-col items-center justify-center align-middle h-screen gap-3">
            <div
                class="w-12 h-12 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"
            ></div>

            <p class="text-sm text-gray-500 italic">
                Loading...
            </p>
        </div>
   </template>
   <template v-else>
        <template v-if="isLoginPage">
                <RouterView class="bg-[#DADADA]" /> 
        </template>
        <template v-else>
                <div class="grid grid-cols-[300px_calc(100%-300px)] grid-rows-[50px_calc(100%-50px)] h-screen">
                    <h1 class="text-[20px] font-bold text-center self-center">DASHBOARD SALES ORDER</h1>
                    <p class="text-[16px] text-center self-center">{{ currentTime }}</p>
                    <Navigator />
                    <RouterView class="bg-[#DADADA]" /> 
                </div>
        </template>
   </template>
</template>