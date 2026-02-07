export const getTelegramUser = () => {
    const tg = (window as any)?.Telegram?.WebApp;
    const user = tg?.initDataUnsafe?.user;

    if (user) {
        return {
            telegramId: String(user.id),
            username: user.username,
            firstName: user.first_name,
            lastName: user.last_name,
            languageCode: user.language_code,
            isPremium: user.is_premium
        };
    }

    // Fallback for local development
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return {
            telegramId: "123456789",
            username: "testuser",
            firstName: "Test User",
            lastName: "",
            languageCode: "en",
            isPremium: false
        };
    }

    return null;
};
