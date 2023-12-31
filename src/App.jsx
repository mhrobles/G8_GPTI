import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes,Route} from "react-router-dom";
import { useState, useEffect } from "react";
import SearchRecipe from "./Pages/SearchRecipe.jsx";
import SearchNewCountry from "./Pages/SearchNewCountry.jsx";
import Home from "./Pages/Home.jsx";

function App() {
  const [data, setData] = useState(null);

  function About() {
    return <div>About Page</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/recipe" element={<SearchRecipe/>} />
          <Route path="/country" element={<SearchNewCountry/>} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );      
}

export default App;