import { useContext, useEffect } from "react";
import LibraryContext from "../../context/library/libraryContext";
import BookGrid from "./components/bookGrid";

export default function BookPage() {
  const libraryContext = useContext(LibraryContext);
  const { books, retrieveBooks } = libraryContext;

  useEffect(() => {
    retrieveBooks();
    // eslint-disable-next-line
  }, []);

  return <BookGrid books={books} />;
}
