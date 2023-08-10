import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import BookCard from "./bookCard";

export default function BookGrid({ books }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        sx={{ pt: 2, justifyContent: "center" }}
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {books.map((book) => (
          <BookCard book={book} key={book._id} />
        ))}
      </Grid>
    </Box>
  );
}
