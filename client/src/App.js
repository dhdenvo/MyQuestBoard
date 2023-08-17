import "./App.css";
import PageRouter from "./pages/pageRouter";
import AdventurerState from "./context/adventurer/adventurerState";
import QuestState from "./context/quest/questState";
import AuthHandler from "./context/auth/authHandler";
import LibraryState from "./context/library/libraryState";
import AppHeader from "./components/appHeader";
import { Grid, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    common: {
      main: "#1976D2",
      contrastText: "#FFFFFF",
    },
    special: {
      main: "#D1C030",
      contrastText: "#FFFFFF",
    },
    backing: {
      main: "#E0E0E0",
    },
    paper: {
      main: "#FFF9ED",
      border: "#FFE09E",
    },
  },
  breakpoints: {
    values: {
      // Mobile verticle
      mobVer: 700,
      // Mobile horizontal
      mobHor: 1400,
      // Desktop
      desktop: 1920,
    },
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <AuthHandler>
          <AdventurerState>
            <QuestState>
              <LibraryState>
                <AppHeader>
                  <Grid container sx={{ p: "1%", minHeight: "91vh" }}>
                    <Grid item desktop={2} />
                    <Grid
                      item
                      desktop={8}
                      sx={{
                        backgroundColor: "backing.main",
                        p: "1%",
                        border: 3,
                      }}
                    >
                      <PageRouter />
                    </Grid>
                    <Grid item desktop={2} />
                  </Grid>
                </AppHeader>
              </LibraryState>
            </QuestState>
          </AdventurerState>
        </AuthHandler>
      </ThemeProvider>
    </div>
  );
}

export default App;
