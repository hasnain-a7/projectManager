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
import ImportedTaskPage from "./Pages/ImportedTaskPage";
import CompeletedTaskPage from "./Pages/CompeletedTaskPage";
import PersonalPage from "./Pages/PersonalPage";
import { TaskProvider } from "./TaskContext/TaskContext";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboarPage />} />
        <Route path="/dashboard" element={<TaskManager />} />
        <Route path="/add-task" element={<AddTaskPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/important" element={<ImportedTaskPage />} />
        <Route path="/completed" element={<CompeletedTaskPage />} />
        <Route path="/personal" element={<PersonalPage />} />
        <Route path="/task/detail" element={<DetailPage />} />
      </Route>
    </>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <UserProvider>
    <TaskProvider>
      <RouterProvider router={router} />
    </TaskProvider>
  </UserProvider>
);
