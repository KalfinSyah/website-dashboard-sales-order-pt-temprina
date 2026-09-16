<script setup lang="ts">
import { useSalesOrderStore } from '@/stores/salesOrder';
import { computed, ref, watch, type ComputedRef } from 'vue';
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
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const day = yesterday.getDate()
    const month = yesterday.getMonth() + 1
    const year = yesterday.getFullYear()

    return store.salesOrders
        .filter(order => {
            const [orderDay, orderMonth, orderYear] =
                order.so_date.split('/').map(Number)

            return (
                orderDay === day &&
                orderMonth === month &&
                orderYear === year
            )
        })
        .length   // ✅ count, not sum
})
const sumSalesThisMonth = computed(() => {
    return store.salesOrders.filter(order =>
        isCurrentMonth(order.so_date)
    ).length
})
const sumSalesLastMonth = computed(() => {
    const currentMonth = new Date().getMonth() + 1
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1

    return store.salesOrders
        .filter(order => {
            const [, month] = order.so_date.split('/').map(Number)
            return month === lastMonth
        })
        .length   // ✅ count, not sum
})
const totalAmountThisYear = computed(() => {
    return store.salesOrders
        .filter(order => {
            const [, , yearFromSO] = order.so_date.split('/').map(Number)

            return yearFromSO === year.value
        })
        .reduce((sum, order) => sum + Number(order.total_amount || 0), 0)
})
const totalAmountThisYearIDR = computed(() => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(totalAmountThisYear.value)
})
const displayTotalAmount = computed(() =>
    formatPerubahan(
        hitungPersenPerubahan(
            totalAmountThisYear.value,
            totalAmountLastYear.value
        )
    )
)
const displaySalesMonth = computed(() =>
    formatPerubahan(
        hitungPersenPerubahan(
            sumSalesThisMonth.value,
            sumSalesLastMonth.value
        )
    )
)
const displaySalesDay = computed(() => 
    formatPerubahan(
        hitungPersenPerubahan(
            sumSalesNow.value,
            sumSalesYesterday.value
        )
    )
)
const totalAmountLastYear = computed(() => {
    return store.salesOrders
        .filter(order => {
            const [, , yearFromSO] = order.so_date.split('/').map(Number)

            return yearFromSO === year.value - 1
        })
        .reduce((sum, order) => sum + Number(order.total_amount || 0), 0)
})
const hitungPersenPerubahan = (current: number, previous: number) => {
    if (previous === 0) {
        return 0
    }

    return ((current - previous) / previous) * 100
}
const formatPerubahan = (value: number) => {
    if (value > 0) {
        return `Naik ${value.toFixed(1)}%`
    }

    if (value < 0) {
        return `Turun ${Math.abs(value).toFixed(1)}%`
    }

    return 'Tidak ada perubahan'
}
const createStatusPerubahan = (
    current: ComputedRef<number>,
    previous: ComputedRef<number>
) => {
    return computed(() => {
        const value = hitungPersenPerubahan(
            current.value,
            previous.value
        )

        if (value > 0) return 'naik'
        if (value < 0) return 'turun'

        return 'tetap'
    })
}
const statusSalesDay = createStatusPerubahan(
    sumSalesNow,
    sumSalesYesterday
)

const statusSalesMonth = createStatusPerubahan(
    sumSalesThisMonth,
    sumSalesLastMonth
)

const statusTotalAmount = createStatusPerubahan(
    totalAmountThisYear,
    totalAmountLastYear
)
const year = ref(new Date().getFullYear())
const controlYear = (symbol: String) => {
    if (symbol === '+') {
        year.value++
    } else {
        year.value--
    }
}
const isToday = (dateString: String) => {
    const [day, month, year] = dateString.split('/').map(Number)

    const today = new Date()

    return (
        day === today.getDate() &&
        month === today.getMonth() + 1 &&
        year === today.getFullYear()
    )
}
const isCurrentMonth = (dateString: string) => {
    const [, month, year] = dateString.split('/').map(Number)

    const today = new Date()

    return (
        month === today.getMonth() + 1 &&
        year === today.getFullYear()
    )
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
                            {{ displaySalesDay }}
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
                            {{ displaySalesMonth }}
                        </span>
                        dari bulan kemarin
                    </p>
                </div>
            </div>
            <div class="bg-white w-full p-4 mt-5">
                <p class="font-bold">Total Amounts</p>
                <p class="font-bold text-[40px]"> {{ totalAmountThisYearIDR }} </p>
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