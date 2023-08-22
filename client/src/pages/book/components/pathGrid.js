import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import BaseCard from "../../../components/baseCard";
import { Typography } from "@mui/material";

export default function PathGrid({ book }) {
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
            </BaseCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
