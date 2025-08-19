import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import CreatePost from "./components/CreatePost/CreatePost";
import "@aws-amplify/ui-react/styles.css";
import Navbar from "./components/Navbar/Navbar";

export default function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create-post" element={<CreatePost />} />
      </Routes>
    </Router>
  );
}
