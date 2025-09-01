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
import DashboarPage from "./Pages/DashboardPage";
import AddTaskPage from "./Pages/AddTaskPage";
import ProfilePage from "./Pages/ProfilePage";
import DetailPage from "./Pages/DetailPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<LoginPage />} />
      <Route path="app" element={<Layout />}>
        <Route index element={<TaskManager />} />
        <Route path="/app/dashboard" element={<DashboarPage />} />
        <Route path="/app/add-task" element={<AddTaskPage />} />
        <Route path="/app/profile" element={<ProfilePage />} />
        <Route path="/app/task/detail" element={<DetailPage />} />
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
