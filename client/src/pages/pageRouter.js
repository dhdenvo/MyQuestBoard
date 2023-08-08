import { Routes, Route, BrowserRouter } from "react-router-dom";

import QuestsPage from "./quests";
import LoginPage from "./login";

export default function PageRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/adventurers" element={<LoginPage />} />
        <Route path="/quests" element={<QuestsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
