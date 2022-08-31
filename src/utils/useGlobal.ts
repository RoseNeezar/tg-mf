import create from "zustand";

interface IGlobal {
  navigate: string;
}

const useGlobalstore = create<IGlobal>((set, get) => ({
  navigate: "no knice",
}));
export default useGlobalstore;
