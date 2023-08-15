import { useContext, useEffect } from "react";
import LibraryContext from "../../context/library/libraryContext";
import BookGrid from "./components/bookGrid";
import { Typography } from "@mui/material";

export default function BookPage() {
  const libraryContext = useContext(LibraryContext);
  const { books, retrieveBooks } = libraryContext;

  useEffect(() => {
    retrieveBooks();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="libraryPage">
      <Typography variant="h1"> Library </Typography>
      <BookGrid books={books} />
    </div>
  );
}
