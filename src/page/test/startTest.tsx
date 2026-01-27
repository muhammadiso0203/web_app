import { useState } from "react";
import { useNavigate } from "react-router";

const StartTest = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const next = () => {
    if (!name.trim()) {
      setError(true);
      return;
    }

    localStorage.setItem("test_user_name", name.trim());
    navigate("/tests");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-slate-900 p-6 rounded-2xl text-white">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Ismingizni kiriting
        </h2>

        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError(false);
          }}
          placeholder="Masalan: Ali"
          className={`w-full px-4 py-3 rounded-xl bg-black
            border transition-all
            ${
              error
                ? "border-red-500 focus:border-red-500"
                : "border-slate-700 focus:border-blue-500"
            }
            focus:outline-none`}
        />

        {error && (
          <p className="text-red-500 text-sm mt-2">
            Ism kiritish majburiy
          </p>
        )}

        <button
          onClick={next}
          className="mt-4 w-full py-3 rounded-xl
            bg-linear-to-r from-blue-500 to-blue-600
            font-semibold active:scale-95 transition"
        >
          Davom etish
        </button>
      </div>
    </div>
  );
};

export default StartTest;
