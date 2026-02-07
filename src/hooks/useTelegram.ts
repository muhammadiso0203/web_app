import { getTelegramUser } from "../utils/telegram";

export const useTelegram = () => {
    const tg = (window as any).Telegram?.WebApp;

    let user = tg?.initDataUnsafe?.user;

    // Fallback for local dev
    if (!user) {
        const fallback = getTelegramUser();
        if (fallback) {
            user = {
                id: Number(fallback.telegramId),
                username: fallback.username,
                first_name: fallback.firstName,
                last_name: fallback.lastName,
                language_code: fallback.languageCode,
                is_premium: fallback.isPremium,
            };
        }
    }

    const onClose = () => {
        tg?.close();
    };

    const onExpand = () => {
        tg?.expand();
    };

    return {
        tg,
        user,
        onClose,
        onExpand,
        initData: tg?.initData,
    };
};
