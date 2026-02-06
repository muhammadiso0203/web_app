export const useTelegram = () => {
    const tg = (window as any).Telegram?.WebApp;

    const user = tg?.initDataUnsafe?.user;

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
