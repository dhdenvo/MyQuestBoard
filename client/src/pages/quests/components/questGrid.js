import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import QuestCard from "./questCard";

export default function QuestGrid({ quests }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        sx={{ pt: 2, justifyContent: "center" }}
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {quests.map((quest) => (
          <QuestCard quest={quest} key={quest._id} />
        ))}
      </Grid>
    </Box>
  );
}
