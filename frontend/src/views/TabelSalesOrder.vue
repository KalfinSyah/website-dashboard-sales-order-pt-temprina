<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import router from '@/router';
import { useSalesOrderStore } from '@/stores/salesOrder';

const store = useSalesOrderStore();
const salesOrderData = ref<any[]>([]);
const filteredSalesOrderData = ref<any[]>([]);
const searchQuery = ref('');
const isRefreshData = ref(false);
const doSearch = () => {
    const keywords = searchQuery.value.trim().toLowerCase();

    isRefreshData.value = true;

    filteredSalesOrderData.value = salesOrderData.value.filter((so) =>
        [
            so.trx_so,
            so.business_unit,
            so.sub_business_unit,
            so.cabang,
            so.customer,
            so.bill_to,
            so.status,
        ]
            .filter(Boolean)
            .some((value) =>
                String(value).toLowerCase().includes(keywords)
            )
    );

    if (
        filteredSalesOrderData.value.length === 0
    ) {
        Swal.fire({
            icon: 'warning',
            title: 'Data Not Found',
            text: `No sales order found for "${keywords}"`,
            confirmButtonText: 'OK',
        });
    }
};
const removeSearch = () => {
    searchQuery.value = '';
    isRefreshData.value = false;
    filteredSalesOrderData.value = [];
};
const exportToExcel = async () => {
    const result = await Swal.fire({
        title: 'Export Excel?',
        text: 'Apakah Anda yakin ingin mengexport data Sales Order ke Excel?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya, Export',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#009D1F',
    })

    if (!result.isConfirmed) {
        return
    }

    const data = salesOrderData.value.map((so, index) => ({
        No: index + 1,
        'No. TRX SO': so.trx_so,
        'Business Unit': so.business_unit,
        'Sub Business Unit': so.sub_business_unit,
        Cabang: so.cabang,
        Tanggal: so.so_date,
        Customer: so.customer,
        'Ship To': so.bill_to,
        Amount: so.grand_total,
        Status: so.status,
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        'Sales Orders'
    )

    const now = new Date()

    const today =
        `${now.getFullYear()}-` +
        `${String(now.getMonth() + 1).padStart(2, '0')}-` +
        `${String(now.getDate()).padStart(2, '0')}`

    XLSX.writeFile(
        workbook,
        `sales-orders-${today}.xlsx`
    )

    Swal.fire({
        icon: 'success',
        title: 'Berhasil',      
        text: 'File Excel berhasil diexport',
        timer: 1500,
        showConfirmButton: false,
    })
}

watch(
    () => store.loaded,
    (value) => {
        if (value) {
            salesOrderData.value = store.salesOrders;
        }
    },
    {
        immediate: true,
    }
);
</script>

<template>
    <div class="grid grid-rows-[auto_1fr]">
        <div class="grid grid-cols-[1fr_1fr] mt-5 mr-5 ml-5">
            <div class="grid grid-cols-[350px_50px]">
                <input 
                    v-model="searchQuery"
                    class="w-85 h-12.5 pl-3.5 pr-3.5 bg-white placeholder:italic"
                    placeholder="masukkan kata kunci....." 
                />
                <template v-if="!isRefreshData">
                    <div class="grid place-items-center w-12.5 h-12.5 bg-white cursor-pointer" @click="doSearch">
                        <img class="w-6.25 h-6.25" alt="Search Icon" src="../../assets/images/search_button.png" />
                    </div>
                </template> 
                <template v-else>
                    <div class="grid place-items-center w-12.5 h-12.5 bg-white cursor-pointer" @click="removeSearch">
                        <img class="w-6.25 h-6.25" alt="Search Icon" src="../../assets/images/remove.png" />
                    </div>
                </template>  
            </div>
            <button 
                @click="exportToExcel"
                class="justify-self-end text-[#009D1F] font-bold pr-3 pl-3 bg-white cursor-pointer"
            >
                Export ke Excel
            </button>
        </div>
        <div class="overflow-y-auto m-5">
            <table class="table-fixed">
                <thead class="sticky top-0 bg-white z-10 [&_th]:pl-2.5 [&_th]:pr-2.5">
                    <tr>
                        <th class="w-12.5">No</th>
                        <th class="w-37.5">No. TRX SO</th>
                        <th class="w-37.5">Business Unit</th>
                        <th class="w-37.5">Sub Business Unit</th>
                        <th class="w-37.5">Cabang</th>
                        <th class="w-12.5">Tanggal</th>
                        <th class="w-37.5">Customer</th>
                        <th class="w-37.5">Ship To</th>
                        <th class="w-25">Amount</th>
                        <th class="w-12.5">Status</th>
                        <th class="w-12.5">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="filteredSalesOrderData.length === 0">
                        <tr
                            v-for="(so, index) in salesOrderData"
                            :key="so.trx_so"
                            class="text-[12px] odd:[&>td:not(:last-child)]:bg-[#F2F2F2] even:[&>td:not(:last-child)]:bg-white"
                        >
                            <td class="text-center p-1">{{ index + 1 }}</td>
                            <td class="text-center p-1">{{ so.trx_so }}</td>
                            <td class="text-center p-1">{{ so.business_unit }}</td>
                            <td class="text-center p-1">{{ so.sub_business_unit }}</td>
                            <td class="text-center p-1">{{ so.cabang }}</td>
                            <td class="text-center p-1">{{ so.so_date }}</td>
                            <td class="text-center p-1">{{ so.customer }}</td>
                            <td class="text-center p-1">{{ so.bill_to }}</td>
                            <td class="text-center p-1">{{ so.grand_total }}</td>
                            <td class="text-center p-1">{{ so.status }}</td>
                            <td class="text-center p-2">
                                <button
                                    class="w-9 h-9 rounded-full bg-white mx-auto cursor-pointer"
                                    @click="router.push({
                                        name: 'detail-sales-order',
                                        params: { noTrxSo: so.trx_so }
                                    })"
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr
                            v-for="(so, index) in filteredSalesOrderData"
                            :key="so.trx_so"
                            class="text-[12px] odd:[&>td:not(:last-child)]:bg-[#F2F2F2] even:[&>td:not(:last-child)]:bg-white"
                        >
                            <td class="text-center p-1">{{ index + 1 }}</td>
                            <td class="text-center p-1">{{ so.trx_so }}</td>
                            <td class="text-center p-1">{{ so.business_unit }}</td>
                            <td class="text-center p-1">{{ so.sub_business_unit }}</td>
                            <td class="text-center p-1">{{ so.cabang }}</td>
                            <td class="text-center p-1">{{ so.so_date }}</td>
                            <td class="text-center p-1">{{ so.customer }}</td>
                            <td class="text-center p-1">{{ so.bill_to }}</td>
                            <td class="text-center p-1">{{ so.grand_total }}</td>
                            <td class="text-center p-1">{{ so.status }}</td>
                            <td class="text-center p-2">
                                <button
                                    class="w-9 h-9 rounded-full bg-white mx-auto cursor-pointer"
                                    @click="router.push({
                                        name: 'detail-sales-order',
                                        params: { noTrxSo: so.trx_so }
                                    })"
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</template>