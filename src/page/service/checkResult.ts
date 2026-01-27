import { useMutation } from "@tanstack/react-query";
import { request } from "../../config/config";

type CheckResultPayload = {
  tests: number[];
  answers: number[];
};

export interface SubmitTestPayload {
  tests: any[];
  answers: number[];
  user?: {
    username?: string;
    firstName?: string;
  };
}

export const useCheckResult = () => {
  return useMutation({
    mutationFn: (data: CheckResultPayload) => {
      return request.post("ai/check-result", data).then((res) => res.data);
    },
  });
};

export const useSubmitTest = () => {
  return useMutation({
    mutationFn: (data: SubmitTestPayload) => {
      return request.post("/tests/submit", data).then((res) => res.data);
    },
  });
};
