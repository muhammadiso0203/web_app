import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  Languages,
  Trophy,
  Flame,
  ChevronRight,
  User,
  Crown
} from "lucide-react";
import { useTelegram } from "../hooks/useTelegram";
import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user: tgUser } = useTelegram();
  const { isPro, isLoading, profile } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const features = [
    {
      title: "Full Mock Test",
      description: "Practice with real IELTS exam format",
      icon: <BookOpen className="w-6 h-6 text-blue-400" />,
      path: "/tests",
      color: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      title: "Vocabulary Builder",
      description: "Learn new words with interactive tests",
      icon: <Languages className="w-6 h-6 text-purple-400" />,
      path: "/translate-word",
      color: "bg-purple-500/10",
      border: "border-purple-500/20"
    },
    {
      title: "AI Test Lab",
      description: "Personalized feedback using AI power",
      icon: <Brain className="w-6 h-6 text-emerald-400" />,
      path: "/ai-test",
      color: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white p-6 pb-24 font-['Inter']">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-white/10 shadow-lg">
            {tgUser?.photo_url ? (
              <img src={tgUser.photo_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <h2 className="text-sm text-gray-400">Welcome back,</h2>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">{tgUser?.first_name || "Scholar"}</span>
              {isPro && (
                <div className="px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center gap-1">
                  <Crown className="w-3 h-3 text-yellow-500" />
                  <span className="text-[10px] font-bold text-yellow-500 uppercase">Pro</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <button onClick={() => navigate("/leaderboard")} className="p-2 rounded-xl bg-white/5 border border-white/10">
          <Trophy className="w-5 h-5 text-yellow-500" />
        </button>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-4 mb-8"
      >
        <motion.div variants={itemVariants} className="glass-card p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-orange-500">
            <Flame className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Streak</span>
          </div>
          <div className="text-2xl font-bold">{profile?.streak || 0} Days</div>
        </motion.div>
        <motion.div variants={itemVariants} className="glass-card p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-blue-500">
            <Trophy className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Top Score</span>
          </div>
          <div className="text-2xl font-bold">{profile?.bestScore || 0}</div>
        </motion.div>
      </motion.div>

      {/* Main Actions */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest ml-1">Learning Path</h3>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {features.map((feature, index) => (
            <motion.button
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(feature.path)}
              className={`w-full flex items-center justify-between p-5 rounded-3xl border ${feature.border} ${feature.color} backdrop-blur-sm transition-all relative overflow-hidden group`}
            >
              <div className="flex items-center gap-5">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-lg leading-tight">{feature.title}</h4>
                  <p className="text-sm text-gray-400 leading-tight mt-1">{feature.description}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />

              {/* Subtle hover background effect */}
              <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000" />
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Daily Progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-10 p-5 glass-card relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold">Daily Goal</h4>
            <span className="text-xs text-blue-400 font-bold">
              {Math.min(100, Math.round(((profile?.dailyTestsCount || 0) / (profile?.dailyGoal || 5)) * 100))}%
            </span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, ((profile?.dailyTestsCount || 0) / (profile?.dailyGoal || 5)) * 100)}%` }}
              transition={{ duration: 1, delay: 1 }}
              className="h-full bg-linear-to-r from-blue-500 to-purple-600 rounded-full"
            />
          </div>
          <p className="text-xs text-gray-400 mt-4 leading-relaxed">
            {profile?.dailyTestsCount >= profile?.dailyGoal
              ? "Amazing! You've reached your daily goal. Keep it up! 🚀"
              : `You've completed ${profile?.dailyTestsCount || 0} tests today. ${profile?.dailyGoal - profile?.dailyTestsCount} more to go!`}
          </p>
        </div>

        {/* Background Decorative Element */}
        <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-blue-500/10 blur-3xl rounded-full" />
      </motion.div>
    </div>
  );
};

export default Dashboard;
