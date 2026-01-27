import { useMutation } from "@tanstack/react-query"
import { request } from "../../config/config"

export const useTestGenerate = () => {
    return useMutation({
        mutationFn: () => {
            return request.post('ai/generate-test').then((res) => res.data)
        }
    })
}