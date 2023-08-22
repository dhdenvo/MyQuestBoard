import { useContext } from "react";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import QuestContext from "../../../context/quest/questContext";
import BaseCard from "../../../components/baseCard";

export default function QuestCard({ quest }) {
  const questContext = useContext(QuestContext);
  const { getQuestImageUrl, completeQuest } = questContext;

  return (
    <BaseCard imageGetter={getQuestImageUrl} doc={quest}>
      <Typography variant="h5" component="div">
        {quest.title}
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {quest.dueDate}
      </Typography>
      <Typography variant="body2">{quest.description}</Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {quest.rankPoints} rank points gained
      </Typography>
      <CardActions sx={{ justifyContent: "center" }}>
        {quest.isComplete ? (
          <span />
        ) : (
          <Button
            size="small"
            variant="contained"
            onClick={() => completeQuest(quest._id)}
            sx={{ mt: -1, mb: -3 }}
          >
            Complete quest
          </Button>
        )}
      </CardActions>
    </BaseCard>
  );
}
