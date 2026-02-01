import { useMutation } from "@tanstack/react-query"
import { request } from "../../config/config"

export const useTestGenerate = () => {
    return useMutation({
        mutationFn: (telegramId: string) => {
            return request.post('ai/generate-test', { telegramId }).then((res) => res.data)
        }
    })
}