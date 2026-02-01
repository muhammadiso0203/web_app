import { useMutation } from "@tanstack/react-query";
import { request } from "../../config/config";

interface AiFeedbackPayload {
    telegramId: string;
    questions: any[];
    userAnswers: number[];
}

export const useAiFeedback = () => {
    return useMutation({
        mutationFn: (data: AiFeedbackPayload) => {
            return request.post("ai/detailed-feedback", data).then((res) => res.data);
        },
    });
};
