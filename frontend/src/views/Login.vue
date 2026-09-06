<script setup ="ts">
import { ref } from 'vue';
import { login } from '@/requests/Login'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()
const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const handleLogin = async () => {
    const result = await login(
        username.value,
        password.value
    )

    if (result?.success) {
        await Swal.fire({
            icon: 'success',
            title: 'Login Berhasil',
            text: `Selamat datang ${result.user.name}`,
            confirmButtonText: 'OK'
        })

        if (rememberMe.value) {
            localStorage.setItem(
                'token',
                result.user.name
            )
        } else {
            sessionStorage.setItem(
                'token',
                result.user.name
            )
        }

        router.push('/')
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Login Gagal',
            text: result?.message || 'Username atau password salah',
            confirmButtonText: 'OK'
        })
    }
}

</script>

<template>
    <div class="h-screen flex items-center justify-center">
        <div class="grid grid-rows-[auto_auto] w-100 h-fit">
            <div class="pl-4 pr-4 pt-2 pb-2 bg-white">
                <div class="grid grid-rows-[1fr_1fr]">
                    <input v-model="username" class="bg-[#A8A8A8] p-2 mb-1.5 mt-1" type="text" name="username" placeholder="username">
                    <input v-model="password" class="bg-[#A8A8A8] p-2 mb-2.5 mt-1.5" type="password" name="password" placeholder="password">
                </div>
                <div class="flex items-center gap-2">
                    <input
                        v-model="rememberMe"
                        type="checkbox"
                        class="w-5 h-5 appearance-none bg-[#A8A8A8] border border-[#A8A8A8] rounded
                            checked:bg-[#1AB00A] cursor-pointer"
                    />
                    <p>Ingat Saya</p>
                </div>
            </div>
            
            <p @click="handleLogin" class="h-fit text-center text-[#1AB00A] text-2xl font-bold bg-white mt-2 p-2">LOGIN</p>
        </div>
    </div>
</template>