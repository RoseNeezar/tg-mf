import { useEffect, useRef } from "react";
import { config } from "./PhaserGame";
import useGlobalstore from "./utils/useGlobal";

function App() {
  const ref = useRef<HTMLDivElement | null>(null);
  const data = useGlobalstore((s) => s.navigate);

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
    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div className="bg-green-400 text-lg h-screen w-screen flex flex-row">
      <div className="w-52 h-screen bg-purple-500">{data}</div>
      <div className="w-52 h-screen bg-purple-100">
        {/* {useBound.getState().navigate} */}
      </div>
      <div className="mt-10  ">
        <div id="game" />
      </div>
    </div>
  );
}

export default App;
