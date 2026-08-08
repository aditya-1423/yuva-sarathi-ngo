import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import AOS from "aos";
import "aos/dist/aos.css";

import { Toaster } from "react-hot-toast";

AOS.init({
  duration: 1000,
  once: true,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />

    <Toaster
      position="top-right"
      reverseOrder={false}
    />
  </React.StrictMode>
);