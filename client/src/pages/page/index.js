import { useContext, useEffect } from "react";
import LibraryContext from "../../context/library/libraryContext";
import { Grid, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import NextPages from "./components/nextPages";
import PageContents from "./components/pageContents";

export default function BookPage() {
  const libraryContext = useContext(LibraryContext);
  const { page, retrievePage } = libraryContext;
  const { pageId } = useParams();

  useEffect(() => {
    retrievePage(pageId);
    // eslint-disable-next-line
  }, []);

  return (
    <Grid
      container
      sx={{ pt: 5, pb: 2, justifyContent: "center" }}
      spacing={{ xs: 12, md: 1 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
    >
      <Typography variant="h1">{page?.pageTitle}</Typography>
      <PageContents page={page} />
      <NextPages page={page} />
    </Grid>
  );
}
