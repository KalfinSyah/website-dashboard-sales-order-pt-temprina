<script setup lang="ts">
import { nextTick, ref, type Ref } from 'vue';
import { chatbot } from '@/requests/Chatbot';
import { marked } from 'marked';

const userMessage: Ref<string> = ref('');
const messages: Ref<Array<[string, 'user' | 'bot']>> = ref([]);

const chatContainer = ref<HTMLElement | null>(null);

const scrollToBottom = async () => {
    await nextTick();

    if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
};

const handleSendMessage = async () => {
    const currentMessage = userMessage.value.trim();
    messages.value.push([currentMessage, 'user']);
    userMessage.value = '';
    const loadingIndex = messages.value.length;
    messages.value.push(['Loading...', 'bot']);
    scrollToBottom();
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
    scrollToBottom();
}
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
        <div class="grid grid-cols-[calc(100vw-400px)_60px] items-center justify-between m-4 bg-white">
            <input class="p-2 ml-2" v-model="userMessage" placeholder="masukkan pesan disini....." @keyup.enter="handleSendMessage"/>
            <img class="w-10 h-10 align-self-center" src="../../assets/images/kirim_pesan.png" @click="handleSendMessage" alt="Send Icon" />
        </div>
    </div>
</template>