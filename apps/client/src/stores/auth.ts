// import { create } from "zustand";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// interface User {
//   id: string;
//   email: string;
//   name: string;
//   avatar?: string;
// }

// interface AuthState {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;

//   // Actions
//   setUser: (user: User | null) => void;
//   setLoading: (loading: boolean) => void;
//   logout: () => Promise<void>;
//   hydrate: () => Promise<void>;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   isAuthenticated: false,
//   isLoading: true,

//   setUser: (user) =>
//     set({
//       user,
//       isAuthenticated: !!user,
//     }),

//   setLoading: (isLoading) => set({ isLoading }),

//   logout: async () => {
//     await AsyncStorage.multiRemove(["accessToken", "refreshToken", "user"]);
//     set({ user: null, isAuthenticated: false });
//   },

//   hydrate: async () => {
//     try {
//       const userJson = await AsyncStorage.getItem("user");
//       const accessToken = await AsyncStorage.getItem("accessToken");

//       if (userJson && accessToken) {
//         const user = JSON.parse(userJson);
//         set({ user, isAuthenticated: true, isLoading: false });
//       } else {
//         set({ isLoading: false });
//       }
//     } catch (error) {
//       console.error("Failed to hydrate auth state:", error);
//       set({ isLoading: false });
//     }
//   },
// }));
