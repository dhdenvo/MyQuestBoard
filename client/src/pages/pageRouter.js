import { Routes, Route, BrowserRouter } from "react-router-dom";

import QuestsPage from "./quests";

export default function PageRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/quests" element={<QuestsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
