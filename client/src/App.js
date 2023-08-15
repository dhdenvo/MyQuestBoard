import "./App.css";
import PageRouter from "./pages/pageRouter";
import AdventurerState from "./context/adventurer/adventurerState";
import QuestState from "./context/quest/questState";
import AuthHandler from "./context/auth/authHandler";
import LibraryState from "./context/library/libraryState";
import AppHeader from "./components/appHeader";
import { ThemeProvider, createTheme } from "@mui/material";

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
                  <PageRouter />
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
