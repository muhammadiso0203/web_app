import { ArrowLeft, ChevronRight, Lock, Crown } from "lucide-react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

const TestsLevel = () => {
  const navigate = useNavigate();
  const { isPro } = useAuth();
  const [showProAlert, setShowProAlert] = useState(false);

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
    }
  ];

  const handleLevelClick = (path: string, locked: boolean) => {
    if (locked) {
      setShowProAlert(true);
      setTimeout(() => setShowProAlert(false), 3000);
      return;
    }
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 pb-32 relative">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4 mb-10"
      >
        <button
          onClick={() => navigate(-1)}
          className="p-3 rounded-2xl bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold">Select Level</h2>
          <p className="text-sm text-muted-foreground">Choose your current IELTS level</p>
        </div>
      </motion.div>

      <div className="space-y-6">
        {levels.map((level, index) => (
          <motion.button
            key={level.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleLevelClick(level.path, level.locked)}
            className={`w-full relative overflow-hidden p-6 rounded-[32px] text-left transition-all group ${level.locked ? "opacity-80" : "cursor-pointer"}`}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-linear-to-br ${level.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
            <div className={`absolute inset-0 border-2 border-white/5 group-hover:border-white/10 rounded-[32px] transition-colors`} />

            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold">{level.title}</h3>
                  {level.locked && (
                    <div className="px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-yellow-500" />
                      <span className="text-[10px] font-bold text-yellow-500 uppercase">Pro</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-400">{level.subtitle}</p>
              </div>
              {!level.locked ? (
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ChevronRight className="w-5 h-5" />
                </div>
              ) : (
                <Lock className="w-5 h-5 text-gray-600" />
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

      {/* Pro Alert Toast */}
      <AnimatePresence>
        {showProAlert && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs p-4"
            style={{ zIndex: 100 }}
          >
            <div className="bg-gray-900/95 backdrop-blur-xl border border-yellow-500/30 text-white p-6 rounded-3xl flex flex-col items-center text-center gap-4 shadow-2xl shadow-yellow-500/20">
              <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mb-2">
                <Crown className="w-8 h-8 text-yellow-500" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">Bu faqat Pro obunachilar uchun</h4>
                <p className="text-sm text-gray-400">Pro obunani faollashtirish uchun Admin bilan bog'laning</p>
              </div>
              <button
                onClick={() => setShowProAlert(false)}
                className="mt-2 text-sm font-bold text-yellow-500 hover:text-yellow-400 transition-colors"
              >
                Yopish
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TestsLevel;