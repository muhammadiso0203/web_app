import { ArrowLeft, ChevronRight, Lock } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";

const TestsLevel = () => {
  const navigate = useNavigate();
  const { isPro } = useAuth();

  const levels = [
    {
      id: "level1",
      title: "Foundation Level",
      subtitle: "Perfect for beginners (CEFR A1-B1)",
      path: "/level1",
      color: "from-blue-500 to-indigo-600",
      locked: false
    },
    {
      id: "level2",
      title: "Advanced Mastery",
      subtitle: "Targeting Band 7.0 - 9.0",
      path: "/level2",
      color: "from-purple-500 to-pink-600",
      locked: !isPro
    },
    {
      id: "level3",
      title: "Academic Writing",
      subtitle: "Intensive Task 1 & 2 preparation",
      path: "/level3",
      color: "from-emerald-500 to-teal-600",
      locked: true
    }
  ];

  return (
    <div className="min-h-screen bg-background text-white p-6 pb-32">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4 mb-10"
      >
        <button
          onClick={() => navigate(-1)}
          className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold">Select Level</h2>
          <p className="text-sm text-gray-500">Choose your current IELTS level</p>
        </div>
      </motion.div>

      <div className="space-y-6">
        {levels.map((level, index) => (
          <motion.button
            key={level.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileTap={!level.locked ? { scale: 0.98 } : {}}
            onClick={() => !level.locked && navigate(level.path)}
            className={`w-full relative overflow-hidden p-6 rounded-[32px] text-left transition-all group ${level.locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
              }`}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-linear-to-br ${level.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
            <div className={`absolute inset-0 border-2 border-white/5 group-hover:border-white/10 rounded-[32px] transition-colors`} />

            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold">{level.title}</h3>
                  {level.locked && <Lock className="w-4 h-4 text-gray-500" />}
                </div>
                <p className="text-sm text-gray-400">{level.subtitle}</p>
              </div>
              {!level.locked && (
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ChevronRight className="w-5 h-5" />
                </div>
              )}
            </div>

            {/* Decorative element */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-linear-to-br ${level.color} blur-3xl opacity-20`} />
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 text-center"
      >
        <p className="text-sm text-blue-400 font-medium">
          New levels are added every week! Stay tuned for Academic Reading and Listening modules.
        </p>
      </motion.div>
    </div>
  );
}

export default TestsLevel;