import { motion } from "framer-motion";
import { User, Mail, LogOut } from "lucide-react";
import { useTelegram } from "../hooks/useTelegram";

const Profile = () => {
    const { user } = useTelegram();

    return (
        <div className="p-6 pt-10 min-h-screen bg-background">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center mb-10"
            >
                <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-500 to-purple-600 p-1 mb-4">
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden border-2 border-white/5">
                        {user?.photo_url ? (
                            <img src={user.photo_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-10 h-10 text-gray-400" />
                        )}
                    </div>
                </div>
                <h2 className="text-2xl font-bold">{user?.first_name} {user?.last_name || ""}</h2>
                <p className="text-gray-400">@{user?.username || "scholar"}</p>
            </motion.div>

            <div className="space-y-4">
                <div className="glass-card p-5 space-y-4">
                    <div className="flex items-center gap-4 text-gray-300">
                        <User className="w-5 h-5 text-blue-400" />
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">User ID</p>
                            <p className="font-medium">{user?.id || "N/A"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-gray-300 border-t border-white/5 pt-4">
                        <Mail className="w-5 h-5 text-blue-400" />
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Language</p>
                            <p className="font-medium">{user?.language_code || "English"}</p>
                        </div>
                    </div>
                </div>

                <button className="w-full p-4 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold flex items-center justify-center gap-2">
                    <LogOut className="w-5 h-5" />
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default Profile;
