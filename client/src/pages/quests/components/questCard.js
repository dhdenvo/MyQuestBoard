import { Fragment, useContext } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import QuestContext from "../../../context/quest/questContext";

export default function QuestCard({ quest }) {
  const questContext = useContext(QuestContext);
  const { getQuestImageUrl, completeQuest } = questContext;

  let card = (
    <Fragment>
      <CardContent>
        {quest.hasImage ? (
          <img
            src={getQuestImageUrl(quest)}
            srcSet={getQuestImageUrl(quest)}
            alt={quest.title}
            loading="lazy"
            width="100%"
          />
        ) : (
          <span />
        )}
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
      </CardContent>
      <CardActions sx={{ justifyContent: "center" }}>
        {quest.isComplete ? (
          <span />
        ) : (
          <Button
            size="small"
            variant="contained"
            onClick={() => completeQuest(quest._id)}
          >
            Complete quest
          </Button>
        )}
      </CardActions>
    </Fragment>
  );

  if (quest.isComplete)
    card = (
      <div>
        <Typography
          sx={{
            position: "absolute",
            rotate: "-40deg",
            top: "34%",
            left: "0%",
            fontSize: 60,
            color: "#03c00a",
            textDecoration: "underline",
          }}
        >
          Complete
        </Typography>
        <CheckCircleOutlineIcon
          sx={{
            position: "absolute",
            rotate: "-40deg",
            top: "50%",
            left: "50%",
            color: "#03c00a",
            fontSize: 60,
          }}
        />
        <Box sx={{ opacity: [0.4, 0.4, 0.4] }}>{card}</Box>
      </div>
    );

  return (
    <Box sx={{ minWidth: 275, maxWidth: 275 }}>
      <Card
        variant="outlined"
        sx={{
          minWidth: 256,
          p: 1,
          m: 1,
          cursor: "pointer",
          position: "relative",
        }}
      >
        {card}
      </Card>
    </Box>
  );
}
