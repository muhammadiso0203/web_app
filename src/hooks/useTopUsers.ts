import { useQuery } from "@tanstack/react-query";
import { request } from "../config/config";

export interface TopUser {
    id: number;
    telegramId: string;
    username: string;
    score: number;
    testAttempts: number;
}

export const useTopUsers = () => {
    return useQuery<TopUser[]>({
        queryKey: ["top-users"],
        queryFn: async () => {
            const response = await request.get("/users/top");
            return response.data;
        },
    });
};
