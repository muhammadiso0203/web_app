import { Outlet, useNavigate, useLocation } from "react-router";
import { motion } from "framer-motion";
import { Home, BookOpen, Settings, User, Trophy } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();

  useEffect(() => {
    if (profile?.theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, [profile?.theme]);

  const navItems = [
    { icon: <Home className="w-6 h-6" />, label: "Home", path: "/" },
    { icon: <BookOpen className="w-6 h-6" />, label: "Tests", path: "/tests" },
    { icon: <Trophy className="w-6 h-6" />, label: "Top", path: "/leaderboard" },
    { icon: <Settings className="w-6 h-6" />, label: "Settings", path: "/settings" },
    { icon: <User className="w-6 h-6" />, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Dynamic Content */}
      <main className="mx-auto max-w-lg">
        <Outlet />
      </main>

      {/* Modern Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 pointer-events-none">
        <div className="mx-auto max-w-sm glass rounded-3xl p-2 flex items-center justify-between pointer-events-auto shadow-2xl border border-white/5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative flex flex-col items-center justify-center py-2 px-3 transition-all duration-300 group flex-1"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-bg"
                    className="absolute inset-0 bg-blue-500/10 rounded-2xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <div className={`relative transition-colors duration-300 ${isActive ? "text-blue-400" : "text-gray-500 group-hover:text-gray-300"}`}>
                  {item.icon}
                </div>

                <span className={`text-[8px] font-bold mt-1 transition-colors duration-300 ${isActive ? "text-blue-400" : "text-gray-500 group-hover:text-gray-300"}`}>
                  {item.label}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="nav-dot"
                    className="absolute -bottom-1 w-1 h-1 bg-blue-400 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;