import React, { useEffect, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import phaserGame from "./PhaserGame";
import Preloader from "./scenes/Preloader";

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

  useEffect(() => {
    const scene = phaserGame.scene.keys.game as Preloader;

    scene.scene.add("preloader", new Preloader(), true);
    return () => {};
  });

  return (
    <div className="bg-purple-400 h-screen p-4">
      {/* <div className="mt-2" id="game"></div> */}
    </div>
  );
}

export default App;
