import { useContext, useEffect, useState } from "react";
import LibraryContext from "../../context/library/libraryContext";
import {
  ButtonBase,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import PageButton from "./components/pageButton";
import PageContents from "./components/pageContents";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import SavedSearchIcon from "@mui/icons-material/SavedSearch";

export default function BookPage() {
  const libraryContext = useContext(LibraryContext);
  const { page, retrievePage, removePath, savePath } = libraryContext;
  const { pageId } = useParams();

  const [searchIn, setSearchIn] = useState("");

  useEffect(() => {
    retrievePage(pageId);
    // eslint-disable-next-line
  }, []);

  return (
    <Grid container sx={{ justifyContent: "center" }}>
      <Grid item xs={12}>
        <Typography variant="h4" sx={{ textAlign: "left" }}>
          {page?.book?.title}
        </Typography>
      </Grid>
      <Grid item xs={10}>
        <Typography variant="h2" sx={{ textAlign: "left" }}>
          {page?.pageTitle}
        </Typography>
      </Grid>
      <Grid container item xs={2}>
        <Grid item xs={12}>
          {page?.pathSaved ? (
            <ButtonBase onClick={() => removePath(page)}>
              <StarIcon color="special" />
              <Typography>Path Saved</Typography>
            </ButtonBase>
          ) : (
            <ButtonBase onClick={() => savePath(page)}>
              <StarBorderIcon />
              <Typography>Save Path</Typography>
            </ButtonBase>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography>Page {page?.pageNum}</Typography>
        </Grid>
      </Grid>
      <Grid item xs={2} />
      <Grid item xs={12}>
        <PageContents page={page} />
      </Grid>
      <Grid item xs={4}>
        <PageButton page={page?.prevPage} />
      </Grid>
      <Grid item xs={1} />
      <Grid item xs={2}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchPage(searchIn);
          }}
        >
          <TextField
            sx={{ mt: 2 }}
            id="standard-basic"
            label="Page search"
            type="search"
            variant="filled"
            onChange={(e) => setSearchIn(e?.target?.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SavedSearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </form>
      </Grid>
      <Grid item xs={1} />
      <Grid container item xs={4}>
        {(page?.nextPages || []).map((nextPage) => (
          <Grid item xs={12} sx={{ p: 0.5 }}>
            <PageButton page={nextPage} isForward />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
