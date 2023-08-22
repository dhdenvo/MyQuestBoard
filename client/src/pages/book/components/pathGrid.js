import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import BaseCard from "../../../components/baseCard";
import { Button, CardActions, Typography } from "@mui/material";
import { useContext } from "react";
import LibraryContext from "../../../context/library/libraryContext";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function PathGrid({ book }) {
  const libraryContext = useContext(LibraryContext);
  const { removePath } = libraryContext;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container sx={{ pt: 0 }}>
        {book.paths.map((path) => (
          <Grid item xs={3} key={path._id}>
            <BaseCard
              onClick={() =>
                (window.location.href = `/library/page/${book.firstPage}/path/${path._id}`)
              }
            >
              <Typography variant="h5" component="div">
                {path.pageTitle}
              </Typography>
              <Typography variant="body2">
                {path.content.slice(
                  0,
                  path.content.slice(0, 150).lastIndexOf(" ")
                ) + "..."}
              </Typography>
              <CardActions sx={{ justifyContent: "center" }}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => removePath(path)}
                  sx={{ mb: -3, textTransform: "none" }}
                >
                  <DeleteForeverIcon /> Remove path
                </Button>
              </CardActions>
            </BaseCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
