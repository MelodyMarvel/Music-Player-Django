import React from "react";
import { createRoot } from 'react-dom/client';

import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import HomePage from "./HomePage";


function App() {
    return (
        <div className="center">
        <HomePage />
      </div>
    )
}

const appRoot = document.getElementById("app");
const root = createRoot(appRoot);
root.render(<App />);
