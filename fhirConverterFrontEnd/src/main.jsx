import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.tsx";
import Login from "./Login.jsx";
import PatientPage from "./PatientPage.jsx";
import "./styles/globals.css";

const router = createBrowserRouter([
  { path: "/", element: <Login />, errorElement: <h1 className="display-2">Wrong page!</h1> },
  { path: "/convertPage", element: <App />, errorElement: <h1 className="display-2">Wrong page!</h1> },
  { path: "/patientPage", element: <PatientPage />, errorElement: <h1 className="display-2">Wrong page!</h1> },
  { path: "*", element: <Login /> }, // catch-all last
]);

const el = document.getElementById("root");
if (!el) throw new Error("Root element #root not found");

createRoot(el).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
