import { Fragment } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export default function BaseCard({ doc, imageGetter, onClick, children }) {
  let card = (
    <CardContent>
      {doc?.hasImage ? (
        <Box
          component="img"
          src={imageGetter(doc) || ""}
          sx={{
            width: "100%",
            minHeight: "224px",
          }}
          alt={doc.title}
        />
      ) : (
        <></>
      )}
      {children}
    </CardContent>
  );

  // If the card is complete, cover it in the complete symbol
  if (doc?.isComplete)
    card = (
      <Fragment>
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
      </Fragment>
    );

  return (
    <Box sx={{ minWidth: 275, maxWidth: 275 }}>
      <Card
        variant="outlined"
        sx={{
          minWidth: 256,
          p: 1,
          m: 1,
          cursor: onClick ? "pointer" : undefined,
          position: "relative",
        }}
        onClick={onClick || (() => {})}
      >
        {card}
      </Card>
    </Box>
  );
}
