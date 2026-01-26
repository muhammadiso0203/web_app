import { BookOpen, User } from "lucide-react";
import { Link } from "react-router";

const First = () => {
  return (
    <nav className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-slate-900 to-slate-950 p-6">
      <h1 className="text-2xl font-bold text-white mb-8">
        🎓 IELTS Test Platform
      </h1>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <Link
          to="/test"
          className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl
                     bg-linear-to-r from-blue-500 to-blue-600
                     text-white text-lg font-semibold
                     shadow-lg shadow-blue-500/30
                     hover:scale-[1.03] hover:from-blue-600 hover:to-blue-700
                     active:scale-95 transition-all duration-200"
        >
          <BookOpen className="w-8 h-8"/> Start Test
        </Link>

        <Link
          to="/user"
          className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl
                     bg-linear-to-r from-emerald-500 to-emerald-600
                     text-white text-lg font-semibold
                     shadow-lg shadow-emerald-500/30
                     hover:scale-[1.03] hover:from-emerald-600 hover:to-emerald-700
                     active:scale-95 transition-all duration-200"
        >
          <User className="w-8 h-8"/> User Profile
        </Link>
      </div>
    </nav>
  );
};

export default First;
