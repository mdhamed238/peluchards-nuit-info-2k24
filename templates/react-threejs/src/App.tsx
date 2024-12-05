import React from "react";
import ModelViewer from "./components/ModelViewer";
import "./App.css";

function App() {
  return (
    <div className='App'>
      <h1 className='title'>3D Model Viewer</h1>
      <div className='viewer-container'>
        <ModelViewer />
      </div>
    </div>
  );
}

export default App;
