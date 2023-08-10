import logo from "./logo.svg";
import "./App.css";
import PageRouter from "./pages/pageRouter";
import AdventurerState from "./context/adventurer/adventurerState";
import QuestState from "./context/quest/questState";
import AuthHandler from "./context/auth/authHandler";
import LibraryState from "./context/library/libraryState";
import AppHeader from "./components/appHeader";

function App() {
  return (
    <div className="App">
      <AuthHandler>
        <AdventurerState>
          <QuestState>
            <LibraryState>
              <AppHeader />
              <PageRouter />
            </LibraryState>
          </QuestState>
        </AdventurerState>
      </AuthHandler>
    </div>
  );
}

export default App;
