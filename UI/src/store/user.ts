import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IUser {
  loggedIn: boolean;
  name: string;
  profile: string;
  setLoggedIn: (loggedIn: boolean) => void;
  setName: (name: string) => void;
  setProfile: (profile: string) => void;
  checkLoginStatus: () => void;
}
export const useUserStore = create<IUser>()(
  persist(
    (set, get) => ({
      loggedIn: false,
      name: "",
      profile: "",
      setLoggedIn: (loggedIn: boolean) => {
        set({ loggedIn });
        localStorage.setItem("loggedIn", JSON.stringify(loggedIn)); // Persist loggedIn state
      },
      setName: (name: string) => set({ name }),
      setProfile: (profile: string) => set({ profile }),
      checkLoginStatus: () => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          set({ loggedIn: true });
        } else {
          set({ loggedIn: false });
        }
      },
    }),
    {
      name: "user-storage",
      getStorage: () => localStorage,
    }
  )
);
