import { useContext, useEffect } from "react";
import LibraryContext from "../../context/library/libraryContext";
import { Box, Button, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { MuiMarkdown } from "mui-markdown";

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
      <Box
        sx={{
          minWidth: "80%",
          maxWidth: "80%",
          textAlign: "left",
          color: "black",
          backgroundColor: "#c2c6d0",
        }}
      >
        <MuiMarkdown>{page?.content}</MuiMarkdown>
      </Box>
      {(page?.nextPages || []).map((nextPage) => (
        <Grid item xs={12}>
          <Button
            size="small"
            variant="contained"
            sx={{ textTransform: "none" }}
            onClick={() =>
              (window.location.href = `/library/page/${nextPage._id}`)
            }
          >
            {nextPage?.pageTitle}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
}
