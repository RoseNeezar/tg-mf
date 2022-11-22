// ⬇️ not exported, so that no one can subscribe to the entire store
import create from "zustand";
import { combine } from "zustand/middleware";
import shallow from "zustand/shallow";

export const useBearStore = create(
  combine({ bears: 0, fish: 0 }, (set) => ({
    action: {
      increasePopulation: (by: number) =>
        set((state) => ({ bears: state.bears + by })),
      increaseFishPopulation: (by: number) =>
        set((state) => ({ bears: state.fish + by })),
      eatFish: () => set((state) => ({ fish: state.fish - 1 })),
      removeAllBears: () => set({ bears: 0 }),
    },
  }))
);

// 💡 exported - consumers don't need to write selectors
export const useBears = () => useBearStore((state) => state.bears);
export const useFish = () => useBearStore((state) => state.fish);
export const useBearActions = () => useBearStore((state) => state.action);

export const incbear = (val: number) =>
  useBearStore.setState((s) => ({
    bears: val,
  }));
export const incfish = (val: number) =>
  useBearStore.setState((s) => ({
    fish: val,
  }));
