import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  id: string | undefined;
};

type Actions = {
  set: (id: string | undefined) => void;
  unset: () => void;
};

export const useSelectedPlayerStore = create<State & Actions>()(
  immer((set) => ({
    id: undefined,
    set: (id: string | undefined) =>
      set((state) => {
        state.id = id;
      }),
    unset: () =>
      set((state) => {
        state.id = undefined;
      }),
  })),
);
