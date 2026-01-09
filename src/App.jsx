import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Category from "./pages/Category";


import "./styles/layout.css";
import Donations from "./pages/Donations";
import Events from "./pages/Events";
import Contacts from "./pages/Contact";

export default function App() {
  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-content">


        <div className="page-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/categories" element={<Category />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/events" element={<Events />} />
            <Route path="/contacts" element={<Contacts />} />

          </Routes>
        </div>
      </div>
    </div>
  );
}
