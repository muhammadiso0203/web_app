import { Routes, Route } from "react-router";
import First from "./page";
import StartTest from "./page/test/startTest";
import TestsLevel from "./page/test/tests";
import OneLevelTest from "./page/test/OneLevelTest";
import TwoLevelTest from "./page/test/twoLevelTest";
import AiTest from "./page/test/aiTest";
import MainLayout from "./layout/mainLayout";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* 1-ekran */}
        <Route index element={<First />} />

        {/* 2-ekran */}
        <Route path="start" element={<StartTest />} />

        {/* 3-ekran */}
        <Route path="tests" element={<TestsLevel />} />
        <Route path="/level1" element={<OneLevelTest />} />
        <Route path="/level2" element={<TwoLevelTest />} />

        <Route path="ai-test" element={<AiTest />} />
        
      </Route>
    </Routes>
  );
};

export default App;
