import { Fragment, useContext, useEffect } from "react";
import LibraryContext from "../../context/library/libraryContext";
import PathGrid from "./components/pathGrid";
import { Button, Grid, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import ReadContents from "../../components/readContents";

export default function BookPage() {
  const libraryContext = useContext(LibraryContext);
  const { book, retrieveBook } = libraryContext;
  const { bookId } = useParams();

  useEffect(() => {
    retrieveBook(bookId);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="libraryPage">
      <Grid container>
        <Grid item xs={10}>
          <Typography variant="h1"> {book?.title} </Typography>
        </Grid>
        <Grid item xs={2}>
          <Button
            size="small"
            variant="contained"
            sx={{ textTransform: "none" }}
            onClick={() => window.open(book?.originalSource, "_blank")}
          >
            View original
          </Button>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "left" }}>
          <ReadContents content={book?.description} />
        </Grid>
        <Grid item xs={12}>
          <Button
            size="large"
            variant="contained"
            sx={{ textTransform: "none" }}
            onClick={() =>
              (window.location.href = `/library/page/${book.firstPage}`)
            }
          >
            Start reading
          </Button>
        </Grid>
        {book?.paths?.length ? (
          <Fragment>
            <Grid item xs={3}>
              <Typography variant="h4">Saved paths:</Typography>
            </Grid>
            <Grid item xs={9} />
            <Grid item xs={12}>
              <PathGrid book={book} />
            </Grid>
          </Fragment>
        ) : (
          <></>
        )}
      </Grid>
    </div>
  );
}
