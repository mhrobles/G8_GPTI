import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes,Route} from "react-router-dom";
import { useState, useEffect } from "react";
import SearchRecipe from "./SearchRecipe.jsx";
import SearchCountry from "./SearchCountry.jsx";
import Home from "./Home.jsx";

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
          <Route path="/country" element={<SearchCountry/>} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );      
}

export default App;