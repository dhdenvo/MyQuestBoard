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
import ReadContents from "../../components/readContents";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import SavedSearchIcon from "@mui/icons-material/SavedSearch";

export default function BookPage() {
  const libraryContext = useContext(LibraryContext);
  const { page, retrievePage, removePath, savePath, searchForPage } =
    libraryContext;
  const { pageId, pathId } = useParams();

  const [searchIn, setSearchIn] = useState("");

  useEffect(() => {
    retrievePage(pageId, pathId);
    // eslint-disable-next-line
  }, []);

  return (
    <Grid container sx={{ justifyContent: "center" }}>
      <Grid item desktop={12}>
        <Typography
          variant="h4"
          sx={{ textAlign: "left", cursor: "pointer" }}
          onClick={() =>
            (window.location.href = `/library/book/${page.book._id}`)
          }
        >
          {page?.book?.title}
        </Typography>
      </Grid>
      <Grid item desktop={10}>
        <Typography variant="h2" sx={{ textAlign: "left" }}>
          {page?.pageTitle}
        </Typography>
      </Grid>
      <Grid container item desktop={2}>
        <Grid item desktop={12}>
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
        <Grid item desktop={12}>
          <Typography>Page {page?.pageNum}</Typography>
        </Grid>
      </Grid>
      <Grid item desktop={2} />
      <Grid item desktop={12}>
        <ReadContents content={page?.content} />
      </Grid>
      <Grid item desktop={4}>
        <PageButton page={page?.prevPage} path={pathId} />
      </Grid>
      <Grid item desktop={1} />
      <Grid item desktop={2}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchForPage(page.book._id, searchIn);
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
      <Grid item desktop={1} />
      <Grid container item desktop={4}>
        {(page?.nextPages || []).map((nextPage) => (
          <Grid item desktop={12} sx={{ p: 0.5 }}>
            <PageButton page={nextPage} isForward path={pathId} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
