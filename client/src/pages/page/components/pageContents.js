import { Box } from "@mui/material";
import MuiMarkdown from "mui-markdown";

export default function PageContents({ page }) {
  return (
    <Box
      sx={{
        textAlign: "left",
        backgroundColor: "paper.main",
        border: 3,
        borderColor: "paper.border",
        mt: 1,
        p: 1,
      }}
    >
      <MuiMarkdown>{page?.content}</MuiMarkdown>
    </Box>
  );
}
