import logo from "./logo.svg";
import "./App.css";

import Navbar from "./components/navbar/navbar.component";
import SearchPage from "./components/search-page/search-page";
import { Link, Outlet } from "react-router-dom";

function App() {
  return (
    <div className='App'>
      <Navbar />
      {/* <Link to='/search'>Search</Link> */}
      <Outlet />
    </div>
  );
}

export default App;
