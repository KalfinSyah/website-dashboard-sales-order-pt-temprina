export const login = async (
    username: string,
    password: string,
) => {
    try {
        const response: Response = await fetch(import.meta.env.VITE_LOGIN_ENDPOINT, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_CHATBOT_API_KEY}`,
            },
            body: JSON.stringify({
                username,
                password
            }),
        })
        return await response.json()
    } catch (error) {
        console.error(error)
        return false
    }
}