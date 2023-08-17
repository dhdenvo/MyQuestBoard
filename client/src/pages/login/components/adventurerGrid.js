import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AdventurerSnippet from "./adventurerSnippet";

export default function AdventurerGrid({ adventurers = [] }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container sx={{ pt: 2, justifyContent: "center" }}>
        {adventurers.map((adventurer) => (
          <AdventurerSnippet adventurer={adventurer} key={adventurer._id} />
        ))}
      </Grid>
    </Box>
  );
}
