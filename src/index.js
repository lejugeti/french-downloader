import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import SearchPage from "./components/search-page/search-page";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        {/* <Route path='invoices' element={<Invoices />} /> */}
        <Route path='search' element={<SearchPage />} />
      </Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
