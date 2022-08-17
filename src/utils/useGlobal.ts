import create from "zustand/vanilla";

interface IGlobal {
  navigate: string;
}

export const { getState: getGlobalState, setState: setGlobalState } =
  create<IGlobal>((set, get) => ({
    navigate: "",
  }));
