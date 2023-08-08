import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AdventurerSnippet from "./adventurerSnippet";

export default function AdventurerGrid({ adventurers = [] }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        sx={{ pt: 2 }}
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {adventurers.map((adventurer) => (
          <AdventurerSnippet adventurer={adventurer} key={adventurer._id} />
        ))}
      </Grid>
    </Box>
  );
}
