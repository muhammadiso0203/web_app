import { useNavigate } from "react-router";

const First = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-sm text-center space-y-4">
        <h1 className="text-white text-2xl font-bold">
          🎓 IELTS Test Platform
        </h1>

        <button
          onClick={() => navigate("/tests")}
          className="w-full py-4 rounded-xl
                     bg-blue-600 text-white font-semibold
                     active:scale-95 transition"
        >
          📖 Start Test
        </button>

        <button
          onClick={() => navigate("/ai-test")}
          className="w-full py-4 rounded-xl
                     bg-green-600 text-white font-semibold
                     active:scale-95 transition"
        >
          ⭐ AI bilan test ishlash
        </button>
      </div>
    </div>
  );
};

export default First;
