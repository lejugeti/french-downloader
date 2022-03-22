import logo from "./logo.svg";
import "./App.css";

import Navbar from "./components/navbar/navbar.component";
import SearchPage from "./components/search-page/search-page";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className='App'>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
