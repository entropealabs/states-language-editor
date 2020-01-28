import React from "react";
import ReactDOM from "react-dom";
import init from "./editor";

import "./styles.css";

function App() {
  return (
    <div className="App">
      <h1>States Language Editor</h1>
      <div style={{ width: "100vw", height: "90vh" }} ref={el => init(el)} />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
