import { Fragment, useContext } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import LibraryContext from "../../../context/library/libraryContext";

export default function BookCard({ book }) {
  const libraryContext = useContext(LibraryContext);
  const { getBookImageUrl } = libraryContext;

  const card = (
    <Fragment>
      <CardContent>
        {book.hasImage ? (
          <img
            src={getBookImageUrl(book)}
            srcSet={getBookImageUrl(book)}
            alt={book.title}
            loading="lazy"
            width="100%"
          />
        ) : (
          <span />
        )}
        <Typography variant="h5" component="div">
          {book.title}
        </Typography>
        <Typography variant="body2">
          {book.description.slice(
            0,
            book.description.slice(0, 150).lastIndexOf(" ")
          ) + "..."}
        </Typography>
      </CardContent>
    </Fragment>
  );

  return (
    <Box sx={{ minWidth: 275, maxWidth: 275 }}>
      <Card
        variant="outlined"
        sx={{
          minWidth: 256,
          p: 1,
          m: 1,
          cursor: "pointer",
          position: "relative",
        }}
        onClick={() =>
          window.location.replace(`/library/page/${book.firstPage}`)
        }
      >
        {card}
      </Card>
    </Box>
  );
}
