import { Box } from "@mui/material";
import MuiMarkdown from "mui-markdown";

export default function PageContents({ page }) {
  return (
    <Box
      sx={{
        minWidth: "80%",
        maxWidth: "80%",
        textAlign: "left",
        color: "black",
        backgroundColor: "#c2c6d0",
      }}
    >
      <MuiMarkdown>{page?.content}</MuiMarkdown>
    </Box>
  );
}
