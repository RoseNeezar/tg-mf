import { useEffect, useRef } from "react";
import { config } from "./PhaserGame";
import { useBears, useBearStore, useFish } from "./utils/useBearStore";
import useGlobalstore from "./utils/useGlobal";

const Some = () => {
  const ref = useRef(useBearStore.getState().fish);
  useEffect(() => {
    return useBearStore.subscribe((s) => (ref.current = s.fish));
  }, []);

  console.log("rerender-fist");
  return <div>{ref.current}</div>;
};
function App() {
  const ref = useRef<HTMLDivElement | null>(null);
  const data = useGlobalstore((s) => s.navigate);

  const bears = useBears();
  console.log("rerender-bear");
  // useEffect(() => {
  //   let lastCalledTime = Date.now();
  //   let fps = 0;
  //   function renderLoop() {
  //     if (!ref.current) return;
  //     let delta = (Date.now() - lastCalledTime) / 1000;
  //     lastCalledTime = Date.now();
  //     fps = 1 / delta;
  //     ref.current.innerText = "fps " + fps.toFixed();
  //     requestAnimationFrame(renderLoop);
  //   }
  //   renderLoop();
  // }, []);

  useEffect(() => {
    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div className="flex flex-row w-screen h-screen text-lg bg-green-400">
      <div className="h-screen bg-purple-500 w-52">{data}</div>
      <div className="h-screen bg-blue-500 w-52">{bears}</div>
      <Some />
      <div className="h-screen bg-purple-100 w-52">
        {/* {useBound.getState().navigate} */}
      </div>
      <div className="mt-10 ">
        <div id="game" />
      </div>
    </div>
  );
}

export default App;
