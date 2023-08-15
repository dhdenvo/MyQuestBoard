import { Box } from "@mui/material";
import MuiMarkdown from "mui-markdown";

export default function PageContents({ page }) {
  return (
    <Box sx={{ textAlign: "left" }}>
      <MuiMarkdown>{page?.content}</MuiMarkdown>
    </Box>
  );
}
