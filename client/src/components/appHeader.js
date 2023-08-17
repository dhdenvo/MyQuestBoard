import { createElement } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import ShieldIcon from "@mui/icons-material/Shield";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import { Grid } from "@mui/material";

const pages = [
  { name: "Quests", path: "quests", logo: ShieldIcon },
  { name: "Library", path: "library", logo: AutoStoriesIcon },
  { name: "Adventurers", path: "adventurers", logo: EmojiPeopleIcon },
];

export default function AppHeader({ children }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ alignItems: "center" }}>
        <Toolbar>
          <Grid container>
            {pages.map(({ name, path, logo }) => (
              <Grid item desktop={12 / pages.length}>
                <Button
                  key={name}
                  disabled={window.location.href.endsWith(path)}
                  onClick={() => (window.location.href = `/${path}`)}
                  sx={{
                    my: 2,
                    pl: 2,
                    color: "white",
                    display: "flex",
                    "&.Mui-disabled": { color: "#c0c0c0" },
                  }}
                >
                  {createElement(logo, { sx: { pr: 1, fontSize: 50 } })}
                  {name}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Toolbar>
      </AppBar>
      {children}
    </Box>
  );
}
