import React, { useEffect, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import phaserGame from "./PhaserGame";
import HelloWorldScene from "./scenes/HelloWorldScene";

const handleClick = () => {
  const scene = phaserGame.scene.keys.helloworld as HelloWorldScene;
  scene.createEmitter();
};

function App() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let lastCalledTime = Date.now();
    let fps = 0;
    function renderLoop() {
      if (!ref.current) return;
      let delta = (Date.now() - lastCalledTime) / 1000;
      lastCalledTime = Date.now();
      fps = 1 / delta;
      ref.current.innerText = "fps " + fps.toFixed();
      requestAnimationFrame(renderLoop);
    }
    renderLoop();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div
          ref={ref}
          style={{
            backgroundColor: "purple",
            fontSize: 30,
            color: "wheat",
          }}
        />
        <button className="App-button" onClick={handleClick}>
          Or click me
        </button>
      </header>
    </div>
  );
}

export default App;
