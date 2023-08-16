import { Fragment, useContext, useEffect } from "react";
import LibraryContext from "../../context/library/libraryContext";
import PathGrid from "./components/pathGrid";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import ReadContents from "../../components/readContents";

export default function BookPage() {
  const libraryContext = useContext(LibraryContext);
  const { book, retrieveBook, getBookImageUrl } = libraryContext;
  const { bookId } = useParams();

  useEffect(() => {
    retrieveBook(bookId);
    // eslint-disable-next-line
  }, []);

  const viewOriginalButton = (
    <Button
      size="small"
      variant="contained"
      sx={{ textTransform: "none" }}
      onClick={() => window.open(book?.originalSource, "_blank")}
    >
      View original
    </Button>
  );

  return (
    <div className="libraryPage">
      <Grid container>
        <Grid item xs={11} sx={{ textAlign: "left" }}>
          <Typography variant="h1" sx={{ fontSize: "3em" }}>
            {book?.title}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          {book?.hasImage ? (
            <Box
              component="img"
              src={getBookImageUrl(book) || ""}
              sx={{
                width: "100%",
                border: 2,
              }}
              alt={book.title}
            />
          ) : (
            <></>
          )}
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "left" }}>
          <ReadContents content={book?.description} />
        </Grid>
        <Grid item xs={12}>
          <Button
            size="large"
            variant="contained"
            sx={{ textTransform: "none", mt: 2 }}
            onClick={() =>
              (window.location.href = `/library/page/${book.firstPage}`)
            }
          >
            Start reading
          </Button>
        </Grid>
        {book?.paths?.length ? (
          <Fragment>
            <Grid item xs={2}>
              <Typography variant="h4">Saved paths:</Typography>
            </Grid>
            <Grid item xs={8} />
            <Grid item xs={2}>
              {viewOriginalButton}
            </Grid>
            <Grid item xs={12} sx={{ p: 2 }}>
              <PathGrid book={book} />
            </Grid>
          </Fragment>
        ) : (
          <Fragment>
            <Grid item xs={10} />
            <Grid item xs={2}>
              {viewOriginalButton}
            </Grid>
          </Fragment>
        )}
      </Grid>
    </div>
  );
}
