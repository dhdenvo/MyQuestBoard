import { Routes, Route, BrowserRouter } from "react-router-dom";

import QuestsPage from "./quests";
import LoginPage from "./login";
import BooksPage from "./books";

export default function PageRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/adventurers" element={<LoginPage />} />
        <Route path="/quests" element={<QuestsPage />} />
        <Route path="/library" element={<BooksPage />} />
      </Routes>
    </BrowserRouter>
  );
}
