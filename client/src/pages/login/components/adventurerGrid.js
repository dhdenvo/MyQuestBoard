import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AdventurerLogin from "./adventurerLogin";

export default function AdventurerGrid({ adventurers = [] }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {adventurers.map((adventurer) => (
          <Grid item xs={2} sm={4} md={4} key={adventurer._id}>
            <AdventurerLogin adventurer={adventurer} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
