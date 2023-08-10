import logo from "./logo.svg";
import "./App.css";
import PageRouter from "./pages/pageRouter";
import AdventurerState from "./context/adventurer/adventurerState";
import QuestState from "./context/quest/questState";
import AuthHandler from "./context/auth/authHandler";
import LibraryState from "./context/library/libraryState";

function App() {
  return (
    <div className="App">
      <AuthHandler>
        <AdventurerState>
          <QuestState>
            <LibraryState>
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <PageRouter />
              </header>
            </LibraryState>
          </QuestState>
        </AdventurerState>
      </AuthHandler>
    </div>
  );
}

export default App;
