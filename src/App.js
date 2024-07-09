import logo from './logo.svg';
import './App.css';
import { Dashboard } from './components/ui/Dashboard.js'
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Dashboard></Dashboard>
      </BrowserRouter>
    </div>
  );
}

export default App;
