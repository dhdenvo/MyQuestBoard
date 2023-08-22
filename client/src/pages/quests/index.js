import { useContext, useEffect } from "react";
import QuestContext from "../../context/quest/questContext";
import { Grid, Typography } from "@mui/material";
import QuestCard from "./components/questCard";

export default function QuestPage() {
  const questContext = useContext(QuestContext);
  const { quests, retrieveQuests } = questContext;

  useEffect(() => {
    retrieveQuests();
    // eslint-disable-next-line
  }, []);

  return (
    <Grid container sx={{ pt: 2 }}>
      <Grid item xs={12}>
        <Typography variant="h1">Quest Board</Typography>
      </Grid>
      <Grid item container xs={12} sx={{ pt: 2 }}>
        {quests.map((quest) => (
          <Grid item xs={3}>
            <QuestCard quest={quest} key={quest._id} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
