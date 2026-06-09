import React, { useState } from "react";
import HomeScreen from "./src/screens/HomeScreen";

export default function App() {
  const [theme, setTheme] = useState("dark");

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return <HomeScreen theme={theme} toggleTheme={toggleTheme} />;
}