import { motion } from "framer-motion";
import { Bell, Shield, Moon, Globe, HelpCircle, ChevronRight, Check } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "../config/config";
import { useTelegram } from "../hooks/useTelegram";

const Settings = () => {
    const { profile } = useAuth();
    const { user: tgUser } = useTelegram();
    const queryClient = useQueryClient();

    const updateSettingsMutation = useMutation({
        mutationFn: async (settings: any) => {
            const response = await request.patch(`/users/settings/${tgUser?.id}`, settings);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        }
    });

    const toggleNotifications = () => {
        updateSettingsMutation.mutate({ notificationsEnabled: !profile?.notificationsEnabled });
    };

    const changeLanguage = () => {
        const nextLang = profile?.language === "uz" ? "en" : "uz";
        updateSettingsMutation.mutate({ language: nextLang });
    };

    const settingsItems = [
        {
            icon: <Bell className="w-5 h-5" />,
            label: "Notifications",
            value: profile?.notificationsEnabled ? "Enabled" : "Disabled",
            color: "text-blue-400",
            onClick: toggleNotifications
        },
        {
            icon: <Shield className="w-5 h-5" />,
            label: "Privacy",
            value: "Public Profile",
            color: "text-purple-400"
        },
        {
            icon: <Moon className="w-5 h-5" />,
            label: "Theme",
            value: "Dark Mode",
            color: "text-orange-400"
        },
        {
            icon: <Globe className="w-5 h-5" />,
            label: "Language",
            value: profile?.language === "uz" ? "O'zbekcha" : "English",
            color: "text-emerald-400",
            onClick: changeLanguage
        },
    ];

    return (
        <div className="p-6 pt-10 min-h-screen bg-background pb-32 font-['Inter']">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h2 className="text-3xl font-black mb-2 tracking-tight">Settings</h2>
                <p className="text-gray-400 text-sm">Personalize your learning experience</p>
            </motion.div>

            <div className="space-y-6">
                <div className="glass-card overflow-hidden">
                    <div className="p-2 space-y-1">
                        {settingsItems.map((item, index) => (
                            <motion.button
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={item.onClick}
                                className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2.5 rounded-xl bg-white/5 ${item.color} group-hover:scale-110 transition-transform`}>
                                        {item.icon}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold">{item.label}</p>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{item.value}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {item.label === "Notifications" && (
                                        <div className={`w-10 h-5 rounded-full p-1 transition-colors ${profile?.notificationsEnabled ? "bg-blue-500" : "bg-white/10"}`}>
                                            <div className={`w-3 h-3 bg-white rounded-full transition-transform ${profile?.notificationsEnabled ? "translate-x-5" : "translate-x-0"}`} />
                                        </div>
                                    )}
                                    {item.onClick && <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />}
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div className="glass-card p-5 group flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-white/5 text-gray-400 group-hover:scale-110 transition-transform">
                            <HelpCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold">Help Center</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Support & FAQ</p>
                        </div>
                    </div>
                    <button className="text-blue-400 text-xs font-black uppercase tracking-widest hover:text-blue-300 transition-colors">Support</button>
                </div>

                <div className="flex flex-col items-center gap-2 py-10">
                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        Version 1.2.0
                    </div>
                    <p className="text-[10px] text-gray-600 font-medium">© 2026 IELTS Master AI. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Settings;
