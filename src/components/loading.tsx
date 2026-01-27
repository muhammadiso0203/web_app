import { LoaderCircle } from "lucide-react";

const Loading = ({ text = "Yuklanmoqda..." }: { text?: string }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white gap-4">
      <LoaderCircle className="w-10 h-10 animate-spin text-blue-500" />
      <p className="text-sm text-slate-400">{text}</p>
    </div>
  );
};

export default Loading;
