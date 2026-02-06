import { motion } from "framer-motion";
import { Trophy, User, TrendingUp } from "lucide-react";
import { useTopUsers } from "../hooks/useTopUsers";
import { useTelegram } from "../hooks/useTelegram";

const Leaderboard = () => {
    const { data: topUsers, isLoading } = useTopUsers();
    const { user: tgUser } = useTelegram();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="p-6 pt-10 min-h-screen bg-background pb-32">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <Trophy className="w-8 h-8 text-yellow-500" />
                    <h2 className="text-3xl font-black">Top Scholars</h2>
                </div>
                <p className="text-gray-400">Global IELTS ranking by points</p>
            </motion.div>

            {/* Top 3 Podiums (Simplified for mobile) */}
            <div className="grid grid-cols-3 gap-2 mb-10 items-end px-2">
                {topUsers?.slice(0, 3).map((user, index) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.2 }}
                        className="flex flex-col items-center"
                    >
                        <div className={`relative mb-3 ${index === 0 ? "mb-6" : ""}`}>
                            <div className={`w-16 h-16 rounded-full p-1 bg-linear-to-br ${index === 0 ? "from-yellow-400 to-amber-600 w-20 h-20" :
                                    index === 1 ? "from-gray-300 to-gray-500" :
                                        "from-orange-400 to-orange-700"
                                }`}>
                                <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                                    <User className="w-8 h-8 text-gray-400" />
                                </div>
                            </div>
                            <div className={`absolute -bottom-2 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 border-background ${index === 0 ? "bg-yellow-500 text-background" :
                                    index === 1 ? "bg-gray-400 text-background" :
                                        "bg-orange-600 text-white"
                                }`}>
                                {index + 1}
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 truncate w-full text-center max-w-[70px]">
                            {user.username ? `@${user.username}` : "Scholar"}
                        </span>
                        <span className="text-sm font-black text-white">{user.score || 0}</span>
                    </motion.div>
                ))}
            </div>

            {/* List */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3"
            >
                {topUsers?.slice(3).map((user, index) => {
                    const isCurrentUser = String(user.telegramId) === String(tgUser?.id);

                    return (
                        <motion.div
                            key={user.id}
                            variants={itemVariants}
                            className={`glass-card p-4 flex items-center justify-between border ${isCurrentUser ? "border-blue-500/50 bg-blue-500/5" : "border-white/5"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <span className="w-6 text-sm font-bold text-gray-500">{index + 4}</span>
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                    <User className="w-5 h-5 text-gray-400" />
                                </div>
                                <div>
                                    <h4 className={`text-sm font-bold ${isCurrentUser ? "text-blue-400" : "text-white"}`}>
                                        {user.username ? `@${user.username}` : "Anonymous Scholar"}
                                        {isCurrentUser && <span className="ml-2 text-[10px] bg-blue-500/20 px-2 py-0.5 rounded-full uppercase">You</span>}
                                    </h4>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{user.testAttempts} tests done</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-end">
                                <span className="text-sm font-black text-white">{user.score || 0}</span>
                                <span className="text-[8px] font-bold text-blue-500 uppercase tracking-tighter">points</span>
                            </div>
                        </motion.div>
                    );
                })}

                {topUsers?.length === 0 && (
                    <div className="text-center py-20">
                        <TrendingUp className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No rankings yet. Start a test to lead!</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Leaderboard;
