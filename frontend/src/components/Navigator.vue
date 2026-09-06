<script setup ="ts">
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()
const logout = async () => {
    const result = await Swal.fire({
        title: 'Logout?',
        text: 'Anda yakin ingin keluar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Logout',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#dc2626',
    })

    if (result.isConfirmed) {
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')
        router.push('/login')
    }
}
</script>
<template>
    <div class="flex flex-col text-[20px] justify-between">
        <ul class="bg-[#E8E8E8] text-center [&>li]:p-1">

            <router-link to="/" custom v-slot="{ isActive, navigate }">
                <li
                    @click="navigate"
                    :class="[
                        'cursor-pointer',
                        isActive ? 'bg-[#DADADA] font-semibold italic' : ''
                    ]"
                >
                    Tabel Sales Order
                </li>
            </router-link>

            <router-link to="/grafik-sales-order" custom v-slot="{ isActive, navigate }">
                <li
                    @click="navigate"
                    :class="[
                        'cursor-pointer',
                        isActive ? 'bg-[#DADADA] font-semibold italic' : ''
                    ]"
                >
                    Grafik Sales Order
                </li>
            </router-link>

            <router-link to="/chatbot" custom v-slot="{ isActive, navigate }">
                <li
                    @click="navigate"
                    :class="[
                        'cursor-pointer',
                        isActive ? 'bg-[#DADADA] font-semibold italic' : ''
                    ]"
                >
                    Sistem RAG
                </li>
            </router-link>

        </ul>

        <div class="p-4 flex">
            <img class="w-20 h-20 mr-4" src="../../assets/images/def_profile.png" alt="Logo" />
            <div class="flex flex-col justify-center">
                <p>Admin</p>
                <button class="text-red-500 hover:text-red-700" @click="logout">Logout</button>
            </div>
        </div>
    </div>
</template>
