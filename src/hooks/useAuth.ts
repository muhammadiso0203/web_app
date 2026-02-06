import { useMutation, useQuery } from "@tanstack/react-query";
import { request } from "../config/config";
import { useTelegram } from "./useTelegram";
import { useEffect, useState } from "react";

export const useAuth = () => {
    const { initData, user: tgUser } = useTelegram();
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    const loginMutation = useMutation({
        mutationFn: async (data: { initData: string }) => {
            const response = await request.post("/auth/telegram", data);
            return response.data;
        },
        onSuccess: (data) => {
            localStorage.setItem("token", data.access_token);
            setToken(data.access_token);
        },
    });

    useEffect(() => {
        if (initData && !token) {
            loginMutation.mutate({ initData });
        }
    }, [initData, token]);

    const { data: subscription } = useQuery({
        queryKey: ["subscription-me"],
        queryFn: async () => {
            const response = await request.get("/subscriptions/me");
            return response.data;
        },
        enabled: !!token,
    });

    const { data: profile, isLoading: isProfileLoading } = useQuery({
        queryKey: ["user-profile", tgUser?.id],
        queryFn: async () => {
            const response = await request.get(`/users/me/${tgUser?.id}`);
            return response.data;
        },
        enabled: !!token && !!tgUser?.id,
    });

    return {
        token,
        isPro: subscription?.isPro || false,
        user: profile || loginMutation.data?.user || tgUser,
        isLoading: loginMutation.isPending || (isProfileLoading && !!token && !!tgUser?.id),
        profile
    };
};
