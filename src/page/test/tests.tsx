import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";

const TestsLevel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 p-5 flex flex-col items-center justify-center gap-4 font-sans">
      <h2 className="text-white text-center text-xl font-semibold mb-2">
        Choose Level
      </h2>

      <Link
        to="/level1"
        className="w-full rounded-2xl bg-linear-to-r from-blue-600 to-blue-800
                   text-white text-lg font-semibold py-5 text-center
                   shadow-lg active:scale-95 transition-transform"
      >
        Level 1
      </Link>

      <Link
        to="/level2"
        className="w-full rounded-2xl bg-linear-to-r from-green-500 to-green-700
                   text-white text-lg font-semibold py-5 text-center
                   shadow-lg active:scale-95 transition-transform"
      >
        Level 2
      </Link>

      <button
        onClick={() => navigate(-1)}
        className="w-[40%] py-4 rounded-2xl bg-slate-800 text-slate-200 text-base font-semibold
                   flex items-center justify-center gap-2 shadow-md shadow-black/40 hover:bg-slate-700
                   hover:text-white active:scale-95 transition-all duration-200"
      >
        <ArrowLeft className="w-5 h-5" /> Ortga
      </button>
    </div>
  );
}
export default TestsLevel