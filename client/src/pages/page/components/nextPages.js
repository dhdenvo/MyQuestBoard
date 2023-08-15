import { Button, Grid } from "@mui/material";

export default function NextPages({ page }) {
  return (page?.nextPages || []).map((nextPage) => (
    <Grid item xs={12}>
      <Button
        size="small"
        variant="contained"
        color={nextPage?.followsPath ? "special" : "common"}
        sx={{ textTransform: "none" }}
        onClick={() => (window.location.href = `/library/page/${nextPage._id}`)}
      >
        {nextPage?.pageTitle}
      </Button>
    </Grid>
  ));
}
