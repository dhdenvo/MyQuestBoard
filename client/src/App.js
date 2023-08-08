import logo from "./logo.svg";
import "./App.css";
import PageRouter from "./pages/pageRouter";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <PageRouter />
      </header>
    </div>
  );
}

export default App;
