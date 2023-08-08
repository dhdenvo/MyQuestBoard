import logo from "./logo.svg";
import "./App.css";
import PageRouter from "./pages/pageRouter";
import AdventurerState from "./context/adventurer/adventurerState";

function App() {
  return (
    <div className="App">
      <AdventurerState>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <PageRouter />
        </header>
      </AdventurerState>
    </div>
  );
}

export default App;
