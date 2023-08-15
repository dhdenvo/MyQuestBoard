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
                    <Grid item xs={2} />
                    <Grid
                      item
                      xs={8}
                      sx={{
                        backgroundColor: "backing.main",
                        p: "1%",
                        border: 3,
                      }}
                    >
                      <PageRouter />
                    </Grid>
                    <Grid item xs={2} />
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
