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

  return <QuestGrid quests={quests} />;
}
