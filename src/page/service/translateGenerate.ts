import { useMutation } from "@tanstack/react-query"
import { request } from "../../config/config"

export const useTranslateGenerate = () => {
    return useMutation({
        mutationFn: (telegramId: string) => {
            return request.post('ai/generate-translate-test', { telegramId }).then((res) => res.data)
        }
    })
}
