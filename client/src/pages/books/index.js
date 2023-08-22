import { useContext, useEffect } from "react";
import LibraryContext from "../../context/library/libraryContext";
import { Grid, Typography } from "@mui/material";
import BookCard from "./components/bookCard";

export default function BookPage() {
  const libraryContext = useContext(LibraryContext);
  const { books, retrieveBooks } = libraryContext;

  useEffect(() => {
    retrieveBooks();
    // eslint-disable-next-line
  }, []);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h1"> Library </Typography>
      </Grid>
      <Grid container item xs={12} sx={{ justifyContent: "center" }}>
        {(books || []).map((book) => (
          <Grid item xs={3} key={book._id}>
            <BookCard book={book} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
