import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import MainPage from "./pages/MainPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<WelcomePage />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
