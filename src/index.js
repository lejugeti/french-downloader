import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import SearchPage from "./components/search-page/search-page";
import DownloadPage from "./components/download-page/download-page";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route path='search' element={<SearchPage />} />
        <Route path='downloads' element={<DownloadPage />} />
      </Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
