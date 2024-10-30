import React from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import LandingPage from "./Pages/landingPage";
import AdminDashboard from "./Components/admin-dashboard/AdminDashboard"
import Checkout from "./Components/Checkout/Checkout"
import Cancel from "./Cancel"
const BASE_FE_URL = process.env.REACT_APP_BASE_FE_URL;
function App() {
  return (
    <Router>
      <div className="App">
        <Toaster />
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path=`${BASE_FE_URL}/admin/*` element={<AdminDashboard />} />
          <Route path=`${BASE_FE_URL}/checkout` element={<Checkout />} />

          <Route path=`${BASE_FE_URL}/api/cancel` element={<Cancel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
