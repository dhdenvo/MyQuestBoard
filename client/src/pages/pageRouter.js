import { Routes, Route, BrowserRouter } from "react-router-dom";

import QuestsPage from "./quests";
import LoginPage from "./login";
import BooksPage from "./books";
import PagePage from "./page";
import BookPage from "./book";

export default function PageRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/adventurers" element={<LoginPage />} />
        <Route path="/quests" element={<QuestsPage />} />
        <Route path="/library" element={<BooksPage />} />
        <Route path="/library/book/:bookId" element={<BookPage />} />
        <Route path="/library/page/:pageId" element={<PagePage />} />
        <Route
          path="/library/page/:pageId/path/:pathId"
          element={<PagePage />}
        />
      </Routes>
    </BrowserRouter>
  );
}
