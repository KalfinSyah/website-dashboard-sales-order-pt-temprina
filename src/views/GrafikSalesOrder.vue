<script setup lang="ts">
import { useSalesOrderStore } from '@/stores/salesOrder';
import { computed, ref, type ComputedRef } from 'vue';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import { getStatusPresentasePerubahan, hitungPersentasePerubahan, isCurrentMonth, isCurrentYear, isNaikOrTurunOrTidakAdaPerubahan, isToday, lastMonth, yesterday } from '@/utils';

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
)
const store = useSalesOrderStore();
const sumSalesNow = computed(() => {
    return store.salesOrders.filter(order =>
        isToday(order.so_date)
    ).length
})
const sumSalesYesterday = computed(() => {
    return store.salesOrders
        .filter(order => {
            const [orderDay, orderMonth, orderYear] =
                order.so_date.split('/').map(Number)

            return (
                orderDay === yesterday().getDate() &&
                orderMonth === yesterday().getMonth() + 1 &&
                orderYear === yesterday().getFullYear()
            )
        })
        .length
})
const tampilkanPersentasePerubahanSalesOrderHariIniDenganKemarin = computed(() => 
    isNaikOrTurunOrTidakAdaPerubahan(
        hitungPersentasePerubahan(
            sumSalesNow.value,
            sumSalesYesterday.value
        )
    )
)
const sumSalesThisMonth = computed(() => {
    return store.salesOrders.filter(order =>
        isCurrentMonth(order.so_date)
    ).length
})
const sumSalesLastMonth = computed(() => {
    return store.salesOrders.filter(order => {
            const [, orderMonth, orderYear] =
                order.so_date.split('/').map(Number)

            return (
                orderMonth === lastMonth().getMonth() + 1 &&
                orderYear === lastMonth().getFullYear()
            )
        })
        .length
})
const tampilkanPersentasePerubahanSalesOrderBulanIniDenganBulanLalu = computed(() =>
    isNaikOrTurunOrTidakAdaPerubahan(
        hitungPersentasePerubahan(
            sumSalesThisMonth.value,
            sumSalesLastMonth.value
        )
    )
)
const totalAmountChosenYear = computed(() => {
    let sum = 0
    for (const i of store.salesOrders) {
        if (i.so_date.split('/')[2] === year.value.toString()) {
            sum += Number(i.grand_total || 0)
        }
    }
    return sum
})
const totalAmountChosenYearIDR = computed(() => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(totalAmountChosenYear.value)
})
const totalAmountOneYearBeforeChoosenYear = computed(() => {
    let sum = 0
    for (const i of store.salesOrders) {
        if (i.so_date.split('/')[2] === (year.value - 1).toString()) {
            sum += Number(i.grand_total || 0)
        }
    }
    return sum
})
const displayTotalAmount = computed(() =>
    isNaikOrTurunOrTidakAdaPerubahan(
        hitungPersentasePerubahan(
            totalAmountChosenYear.value,
            totalAmountOneYearBeforeChoosenYear.value
        )
    )
)

const statusSalesDay = getStatusPresentasePerubahan(
    sumSalesNow,
    sumSalesYesterday
)

const statusSalesMonth = getStatusPresentasePerubahan(
    sumSalesThisMonth,
    sumSalesLastMonth
)

const statusTotalAmount = getStatusPresentasePerubahan(
    totalAmountChosenYear,
    totalAmountOneYearBeforeChoosenYear
)
const year = ref(new Date().getFullYear())
const controlYear = (symbol: string) => {
    const currentYear = new Date().getFullYear()
    if (symbol === '+') {
        if (year.value < currentYear) year.value++
    } else {
        year.value--
    }
}
const dataJumlahPenjualanPerbulan = computed(() => {
    const monthlyTotals = Array(12).fill(0)

    store.salesOrders.forEach(order => {
        const [, month, orderYear] = order.so_date
            .split('/')
            .map(Number)

        if (orderYear === year.value) {
            monthlyTotals[month - 1]++
        }
    })

    return monthlyTotals
})
const chartData = computed(() => ({
    labels: [
        'Jan', 'Feb', 'Mar', 'Apr',
        'May', 'Jun', 'Jul', 'Aug',
        'Sep', 'Oct', 'Nov', 'Dec'
    ],
    datasets: [
        {
            label: `Pesanan`,
            data: dataJumlahPenjualanPerbulan.value,
            backgroundColor: 'black',
            barThickness: 10,
        }
    ]
}))
const chartOptions = {
    responsive: true,
    scales: {
        x: {
            border: {
                color: 'black',
                width: 3
            }
        },
        y: {
            border: {
                color: 'black',
                width: 3
            }
        }
    }
}

</script>

<template>
    <div class="grid grid-rows-[auto_1fr] overflow-auto">
        <div class="grid grid-rows-2 h-fit w-fit justify-self-end font-bold">
            <div class="justify-self-center mt-3">
                <p>Tahun</p>
            </div>
            <div class="grid grid-cols-3 justify-items-center items-center">
                <img @click="controlYear('-')" src="../../assets/images/back.png"></img>
                <p class="bg-white p-2">{{ year }}</p>
                <img @click="controlYear('+')" src="../../assets/images/forward.png"></img>
            </div>
        </div>
        <div class="gird grid-rows-3 w-fit ml-5">
            <div class="grid grid-cols-2 w-fit gap-5">
                <div class="bg-white p-4">
                    <p class="font-bold">Total Pesanan Hari Ini</p>
                    <p class="font-bold text-[40px]">{{ sumSalesNow }}</p>
                    <p>
                        <span
                            :class="{
                                'text-green-500': statusSalesDay === 'naik',
                                'text-red-500': statusSalesDay === 'turun',
                                'text-gray-500': statusSalesDay === 'tetap'
                            }"
                        >
                            {{ tampilkanPersentasePerubahanSalesOrderHariIniDenganKemarin }}
                        </span>
                        dari hari kemarin
                    </p>
                </div>
                <div class="bg-white p-4">
                    <p class="font-bold">Total Pesanan bulan Ini</p>
                    <p class="font-bold text-[40px]">{{ sumSalesThisMonth }}</p>
                    <p>
                        <span
                            :class="{
                                'text-green-500': statusSalesMonth === 'naik',
                                'text-red-500': statusSalesMonth === 'turun',
                                'text-gray-500': statusSalesMonth === 'tetap'
                            }"
                        >
                            {{ tampilkanPersentasePerubahanSalesOrderBulanIniDenganBulanLalu }}
                        </span>
                        dari bulan kemarin
                    </p>
                </div>
            </div>
            <div class="bg-white w-full p-4 mt-5">
                <p class="font-bold">Total Amounts</p>
                <p class="font-bold text-[40px]"> {{ totalAmountChosenYearIDR }} </p>
                <p>
                    <span
                        :class="{
                            'text-green-500': statusTotalAmount === 'naik',
                            'text-red-500': statusTotalAmount === 'turun',
                            'text-gray-500': statusTotalAmount === 'tetap'
                        }"
                    >
                        {{ displayTotalAmount }}
                    </span>
                    dari tahun kemarin
                </p>
            </div>
            <div class="mt-5 mb-5 h-75 pt-3 pr-3 pl-1 bg-white">
                <p class="font-bold text-center">Grafik Total Pesanan Perbulan</p>
                <Bar
                    :data="chartData"
                    :options="chartOptions"
                    class=""
                />
            </div>
        </div>
    </div>
</template>