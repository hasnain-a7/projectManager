import React from "react";
import TaskManager from "../Components/TaskManager";

const Home = () => {
  return (
    <div className="home-page">
      <nav className="navbar">
        <h1 className="logo">Task Manager</h1>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <TaskManager />
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Task Manager. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
