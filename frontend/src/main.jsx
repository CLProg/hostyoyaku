import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import App from "./App.jsx";
import axios from "axios";

// --- ADD THIS SECTION ---
// This ensures all axios calls use your Render URL automatically
axios.defaults.baseURL =
  import.meta.env.VITE_APP_URL;
axios.defaults.withCredentials = true;
// ------------------------

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
