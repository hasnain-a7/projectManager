import Layout from "./Layout/Layout";
import Home from "./Pages/Home";

import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;
