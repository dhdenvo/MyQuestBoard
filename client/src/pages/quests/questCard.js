import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function OutlinedCard(quest) {
  const card = (
    <React.Fragment>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {quest.frequency}
        </Typography>
        <Typography variant="h5" component="div">
          {quest.title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {quest.dueDate.toISOString()}
        </Typography>
        <Typography variant="body2">{quest.description}</Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {quest.rankPoints} rank points gained
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Complete quest</Button>
      </CardActions>
    </React.Fragment>
  );

  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">{card}</Card>
    </Box>
  );
}
