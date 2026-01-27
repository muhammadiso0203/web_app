import { Link } from "react-router";

const TestsLevel = () => {
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
    </div>
  );
}
export default TestsLevel