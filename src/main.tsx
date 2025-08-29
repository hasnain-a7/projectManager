import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import LoginPage from "./Pages/LoginPage";
import TaskManager from "./Components/TaskManager";
import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
} from "react-router-dom";
import { UserProvider } from "./AuthContext/UserContext";
import Layout from "./Pages/Layout";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<Layout />}>
        <Route index element={<TaskManager />} />
      </Route>
    </>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <UserProvider>
    <RouterProvider router={router} />
  </UserProvider>
);
