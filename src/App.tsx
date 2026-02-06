import { Routes, Route } from "react-router";
import Dashboard from "./page";
import TestsLevel from "./page/test/tests";
import OneLevelTest from "./page/test/OneLevelTest";
import TwoLevelTest from "./page/test/twoLevelTest";
import AiTest from "./page/test/aiTest";
import MainLayout from "./layout/mainLayout";
import TranslateWord from "./page/test/translateWord";
import Profile from "./page/profile";
import Settings from "./page/settings";
import Leaderboard from "./page/leaderboard";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="tests" element={<TestsLevel />} />
        <Route path="level1" element={<OneLevelTest />} />
        <Route path="level2" element={<TwoLevelTest />} />
        <Route path="translate-word" element={<TranslateWord />} />
        <Route path="ai-test" element={<AiTest />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="leaderboard" element={<Leaderboard />} />
      </Route>
    </Routes>
  );
};

export default App;
