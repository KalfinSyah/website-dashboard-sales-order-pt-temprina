<script lang="ts" setup>
import { useSalesOrderStore } from '@/stores/salesOrder';
import { ref, watch } from 'vue';
import {useRoute} from 'vue-router';

const salesOrderFields = [
  { label: 'Business Unit', key: 'business_unit' },
  { label: 'Sub Business Unit', key: 'sub_business_unit' },
  { label: 'Cabang', key: 'cabang' },
  { label: 'No. TRX SO', key: 'trx_so' },
  { label: 'So Date', key: 'so_date' },
  { label: 'So Type', key: 'so_type' },
  { label: 'Item Type', key: 'item_type' },
  { label: 'Customer Type', key: 'customer_type' },
  { label: 'Pemasaran', key: 'pemasaran' },
  { label: 'Pembayaran', key: 'pembayaran' },
  { label: 'Customer', key: 'customer' },
  { label: 'Alamat Customer', key: 'alamat_customer' },
  { label: 'No. NPWP', key: 'npwp' },
  { label: 'Nama NPWP', key: 'nama_npwp' },
  { label: 'Contact Person', key: 'contact_person' },
  { label: 'No. PO Customer', key: 'no_po_customer' },
  { label: 'Order Type 1', key: 'order_type_1' },
  { label: 'Order Type 2', key: 'order_type_2' },
  { label: 'PPN Type', key: 'ppn_type' },
  { label: 'Nama Penerima', key: 'nama_penerima' },
  { label: 'Alamat', key: 'alamat' },
  { label: 'Due Date', key: 'due_date' },
  { label: 'Payment Term', key: 'payment_term' },
  { label: 'Currency', key: 'currency' },
  { label: 'Exchange Rate', key: 'exchange_rate' },
  { label: 'Catatan', key: 'catatan' },
  { label: 'Status', key: 'status' },
  { label: 'Total Amount', key: 'total_amount' },
  { label: 'Total Discount Amount', key: 'total_discount_amount' },
  { label: 'PPN', key: 'ppn_amount' },
  { label: 'Grand Total', key: 'grand_total' }
]
const route = useRoute();
const store = useSalesOrderStore();
const selectedSalesOrder = ref<any>({});
watch(
    () => store.loaded,
    (value) => {
        if (value) {
            selectedSalesOrder.value = store.salesOrders.find(so => so.trx_so === route.params.noTrxSo);
        }
    },
    {
        immediate: true,
    }
);
</script>

<template>
    <div class="grid grid-cols-3 overflow-auto justify-items-center pt-3">
        <div
            v-for="field in salesOrderFields"
            :key="field.key"
            class="text-xs"
        >
            <p class="font-medium mb-1">
                {{ field.label }}
            </p>

            <div
                class="border h-8 w-75 px-2 flex items-center justify-center overflow-auto text-center bg-white"
            >
                {{ selectedSalesOrder[field.key] || '-' }}
            </div>
        </div>
    </div>
</template>