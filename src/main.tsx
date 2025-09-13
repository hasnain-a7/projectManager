import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import LoginPage from "./Pages/LoginPage";
import TaskManager from "./components/TaskManager";
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
import ProjectPage from "./Pages/ProjectPage";
import { ThemeProvider } from "./ThemeContext/theme-provider";
import HomePage from "./Pages/HomePage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboarPage />} />
        <Route path="/dashboard" element={<DashboarPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/important" element={<ImportedTaskPage />} />
        <Route path="/completed" element={<CompeletedTaskPage />} />
        <Route path="/personal" element={<PersonalPage />} />
        <Route path="/task/detail" element={<DetailPage />} />
        <Route path="/projects/:projectId" element={<ProjectPage />} />
      </Route>
    </>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <UserProvider>
      <TaskProvider>
        <RouterProvider router={router} />
      </TaskProvider>
    </UserProvider>
  </ThemeProvider>
);
