import { motion } from "framer-motion";
import { Bell, Shield, Moon, Globe, HelpCircle } from "lucide-react";

const Settings = () => {
    const settingsItems = [
        { icon: <Bell className="w-5 h-5" />, label: "Notifications", value: "Enabled", color: "text-blue-400" },
        { icon: <Shield className="w-5 h-5" />, label: "Privacy", value: "Manage", color: "text-purple-400" },
        { icon: <Moon className="w-5 h-5" />, label: "Theme", value: "Dark", color: "text-orange-400" },
        { icon: <Globe className="w-5 h-5" />, label: "Language", value: "Uzbek", color: "text-emerald-400" },
    ];

    return (
        <div className="p-6 pt-10 min-h-screen bg-[#09090b]">
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Settings</h2>
                <p className="text-gray-400">Manage your learning preferences</p>
            </div>

            <div className="space-y-6">
                <div className="glass-card overflow-hidden">
                    {settingsItems.map((item, index) => (
                        <motion.button
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors ${index !== settingsItems.length - 1 ? "border-bottom border-white/5" : ""
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-xl bg-white/5 ${item.color}`}>
                                    {item.icon}
                                </div>
                                <span className="font-medium">{item.label}</span>
                            </div>
                            <span className="text-sm text-gray-500">{item.value}</span>
                        </motion.button>
                    ))}
                </div>

                <div className="glass-card p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-xl bg-white/5 text-gray-400">
                            <HelpCircle className="w-5 h-5" />
                        </div>
                        <span className="font-medium">Help Center</span>
                    </div>
                    <button className="text-blue-400 text-sm font-bold">Contact Support</button>
                </div>

                <div className="text-center text-[10px] text-gray-600 uppercase tracking-[0.2em] font-bold py-10">
                    IELTS Master v1.0.0
                </div>
            </div>
        </div>
    );
};

export default Settings;
