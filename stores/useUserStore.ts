import { UserTableRow } from "@/utils/types";
import { User } from "@supabase/supabase-js";
import { create } from "zustand";

type Store = {
  userData: User | null;
  userProfile: UserTableRow | null;
  actions: {
    setUserProfile: (profile: UserTableRow) => void;
    setUserData: (user: User) => void;
  };
  reset: () => void;
};

export const useUserStore = create<Store>((set) => ({
  userData: null,
  userProfile: null,
  actions: {
    setUserProfile(profile) {
      set((state) => ({
        ...state,
        userProfile: profile,
      }));
    },
    setUserData(user) {
      set((state) => ({
        ...state,
        userData: user,
      }));
    },
  },
  reset: () =>
    set({
      userData: null,
      userProfile: null,
    }),
}));

export const useUserActions = () => useUserStore((state) => state.actions);
export const useUserProfile = () => useUserStore((state) => state.userProfile);
export const useUserData = () => useUserStore((state) => state.userData);
