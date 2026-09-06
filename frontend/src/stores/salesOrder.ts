import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSalesOrderStore = defineStore('salesOrder', () => {
    const salesOrders = ref<any[]>([]);
    const loaded = ref(false);

    const fetchSalesOrders = async () => {
        if (loaded.value) {
            return salesOrders.value;
        }

        try {
            const response = await fetch(
                import.meta.env.VITE_SALES_ORDER_API_ENDPOINT,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${import.meta.env.VITE_SALES_ORDER_API_KEY}`,
                    },
                }
            );

            const result = await response.json();

            salesOrders.value = result.data;
            loaded.value = true;

            return result.data;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    return {
        salesOrders,
        loaded,
        fetchSalesOrders,
    };
});