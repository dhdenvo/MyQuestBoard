import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function NextPages({ page, isForward }) {
  console.log("DIRECTION", isForward);
  if (!page) return <></>;
  return (
    <Button
      size="small"
      variant="contained"
      color={page?.followsPath ? "special" : "common"}
      sx={{ textTransform: "none" }}
      onClick={() => (window.location.href = `/library/page/${page._id}`)}
    >
      {isForward ? <></> : <ArrowBackIcon />}
      {page?.pageTitle}
      {isForward ? <ArrowForwardIcon /> : <></>}
    </Button>
  );
}
