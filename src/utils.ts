import { computed, type ComputedRef } from "vue"

export const isToday = (dateString: String) => {
    const [day, month, year] = dateString.split('/').map(Number)

    const today = new Date()

    return (
        day === today.getDate() &&
        month === today.getMonth() + 1 &&
        year === today.getFullYear()
    )
}
export const isCurrentMonth = (dateString: string) => {
    const [, month, year] = dateString.split('/').map(Number)

    const today = new Date()

    return (
        month === today.getMonth() + 1 &&
        year === today.getFullYear()
    )
}
export const isCurrentYear = (dateString: string) => {
    const [, , year] = dateString.split('/').map(Number)
    const today = new Date()
    return year === today.getFullYear()
}

export const yesterday = () => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    return d
}

export const lastMonth = () => {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() - 1)
    return d
}

export const hitungPersentasePerubahan = (current: number, previous: number) => {
    if (previous === 0) {
        return 0
    }

    return ((current - previous) / previous) * 100
}

export const isNaikOrTurunOrTidakAdaPerubahan = (value: number) => {
    if (value > 0) {
        return `Naik ${value.toFixed(1)}%`
    }

    if (value < 0) {
        return `Turun ${Math.abs(value).toFixed(1)}%`
    }

    return 'Tidak ada perubahan'
}

export const getStatusPresentasePerubahan = (
    current: ComputedRef<number>,
    previous: ComputedRef<number>
) => {
    return computed(() => {
        const value = hitungPersentasePerubahan(
            current.value,
            previous.value
        )

        if (value > 0) return 'naik'
        if (value < 0) return 'turun'

        return 'tetap'
    })
}