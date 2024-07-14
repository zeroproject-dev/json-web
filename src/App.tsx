import { useState } from "react";
import "./App.css";
import { MainPage } from "./pages";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <main
      className={`${darkMode ? "dark" : ""} absolute top-0 left-0 w-dvw h-dvh`}
    >
      <div className="dark:bg-gray-800 absolute top-0 left-0 w-dvw h-dvh px-6">
        <MainPage darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
    </main>
  );
}

export default App;
