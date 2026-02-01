import { Routes, Route } from "react-router";
import First from "./page";
import TestsLevel from "./page/test/tests";
import OneLevelTest from "./page/test/OneLevelTest";
import TwoLevelTest from "./page/test/twoLevelTest";
import AiTest from "./page/test/aiTest";
import MainLayout from "./layout/mainLayout";
import TranslateWord from "./page/test/translateWord";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* 1-ekran */}
        <Route index element={<First />} />
        <Route path="tests" element={<TestsLevel />} />
        <Route path="/level1" element={<OneLevelTest />} />
        <Route path="/level2" element={<TwoLevelTest />} />
        <Route path="translate-word" element={<TranslateWord/>}/>

        <Route path="ai-test" element={<AiTest />} />
        
      </Route>
    </Routes>
  );
};

export default App;
