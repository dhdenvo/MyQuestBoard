import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import QuestCard from "./questCard";

export default function QuestGrid({ quests }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {quests.map((quest) => (
          <Grid item xs={2} sm={4} md={4} key={quest._id}>
            <QuestCard quest={quest} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
