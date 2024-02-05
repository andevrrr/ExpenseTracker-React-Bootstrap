import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const MainPage = lazy(() => import("./pages/MainPage"));
const WelcomePage = lazy(() => import("./pages/WelcomePage"));

const App = () => {
  return (
    <BrowserRouter>
      <Suspense>
        <Routes>
          <Route index element={<WelcomePage />} />
          <Route path="/main" element={<MainPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
