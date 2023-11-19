import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes,Route} from "react-router-dom";
import { useState, useEffect } from "react";
import SearchRecipe from "./routes/SearchRecipe.jsx";
import SearchNewCountry from "./routes/SearchNewCountry.jsx";
import Home from "./routes/Home.jsx";

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