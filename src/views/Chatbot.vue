<script setup lang="ts">
import { nextTick, ref, watch, type Ref } from 'vue';
import { chatbot } from '@/requests/Chatbot';
import { marked } from 'marked';
import Swal from 'sweetalert2';

const userMessage: Ref<string> = ref('');
const messages: Ref<Array<[string, 'user' | 'bot']>> = ref(
    JSON.parse(localStorage.getItem("chatbot-history") || '[]')
);

const chatContainer = ref<HTMLElement | null>(null);

const scrollToBottom = async () => {
    await nextTick();

    if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
};

const handleSendMessage = async () => {
    const currentMessage = userMessage.value.trim();
    if (!currentMessage) {
        Swal.fire({
            title: 'Pesan kosong',
            text: 'Tidak bisa mengirim pesan kosong',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }
    messages.value.push([currentMessage, 'user']);
    userMessage.value = '';
    const loadingIndex = messages.value.length;
    messages.value.push(['Loading...', 'bot']);
    scrollToBottom();
    try {
        const response = await chatbot(currentMessage);
        if (!response) {
            messages.value[loadingIndex] = [
                'Failed to get response',
                'bot'
            ];
            return;
        }
        messages.value[loadingIndex] = [
            response.chatbot_response,
            'bot'
        ];
    } catch (error) {
        messages.value[loadingIndex] = [
            'Failed to get response',
            'bot'
        ];

    }
    scrollToBottom();
};

const clearAllMessage = async () => {
    if (messages.value.length === 0) {
        Swal.fire({
            title: 'Tidak ada pesan',
            text: 'Tidak ada pesan yang bisa dihapus',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    const result = await Swal.fire({
        title: 'Hapus semua percakapan?',
        text: 'Tindakan in akan menghapus semua percakapan anda dengan chatbot.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, hapus semua',
        cancelButtonText: 'Batalkan',
        reverseButtons: true
    });

    if (result.isConfirmed) {
        messages.value = [];
        localStorage.removeItem('chatbot-history');

        await Swal.fire({
            title: 'Percakapan berhasil terhapus!',
            text: 'Percakapan anda dengan chatbot berhasil terhapus.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
    }
};

watch(
    messages,
    (newMessages) => {
        localStorage.setItem(
            "chatbot-history",
            JSON.stringify(newMessages)
        );
    },
    { deep: true }
);
</script>

<template>
    <div class="grid grid-rows-[calc(100vh-140px)_90px]">
        <div ref="chatContainer" class="overflow-y-auto flex flex-col">
            <div
                v-for="(message, index) in messages"
                :class="[
                    message[1] === 'user'
                        ? 'bg-white self-end'
                        : 'bg-[#8CCAFF] self-start',
                    'p-3 m-4 w-fit'
                ]"
                :key="index"
                v-html="marked.parse(message[0])"
            >
            </div>
        </div>
        <div class="grid grid-cols-[calc(100vw-460px)_60px_60px] items-center justify-between m-4 bg-white">
            <input class="p-2 ml-2" v-model="userMessage" placeholder="masukkan pesan disini....." @keyup.enter="handleSendMessage"/>
            <img 
                class="w-10 h-10 align-self-center" 
                :class="userMessage.trim()
                    ? 'cursor-pointer opacity-100'
                    : 'cursor-not-allowed opacity-40 grayscale'"
                src="../../assets/images/kirim_pesan.png" 
                @click="handleSendMessage" alt="Send Icon" />
            <img
                class="w-6 h-8 align-self-center transition-opacity duration-200"
                :class="messages.length > 0
                    ? 'cursor-pointer opacity-100 grayscale-0'
                    : 'cursor-not-allowed opacity-40 grayscale'"
                src="../../assets/images/trash.png"
                @click="clearAllMessage"
                alt="Delete All Messages Icon"
            />
        </div>
    </div>
</template>