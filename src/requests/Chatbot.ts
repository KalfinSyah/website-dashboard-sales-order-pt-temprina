export const chatbot = async (
    message: string,
) => {
    try {
        const response: Response = await fetch(import.meta.env.VITE_CHATBOT_API_ENDPOINT, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_CHATBOT_API_KEY}`,
            },
            body: JSON.stringify({
                message,
            }),
        })
        return await response.json()
    } catch (error) {
        console.error(error)
        return false
    }
}