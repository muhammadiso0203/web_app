import { Route, Routes } from "react-router";
import MainLayout from "./layout/mainLayout";
import Tests from "./page/test/test";
import User from "./page/user/user";
import First from "./page/inde";
import AiTest from "./page/test/aiTest";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<First />} />
          <Route path="/test" element={<Tests />} />
          <Route path="/ai-test" element={<AiTest />} />
          <Route path="/user" element={<User />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
