// import { create } from "zustand";
// import { Appearance, ColorSchemeName } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// type ThemeMode = "light" | "dark" | "system";

// interface ThemeState {
//   mode: ThemeMode;
//   colorScheme: "light" | "dark";

//   // Actions
//   setMode: (mode: ThemeMode) => Promise<void>;
//   hydrate: () => Promise<void>;
// }

// const getSystemColorScheme = (): "light" | "dark" => {
//   return Appearance.getColorScheme() === "dark" ? "dark" : "light";
// };

// export const useThemeStore = create<ThemeState>((set, get) => ({
//   mode: "system",
//   colorScheme: getSystemColorScheme(),

//   setMode: async (mode) => {
//     await AsyncStorage.setItem("themeMode", mode);
//     const colorScheme = mode === "system" ? getSystemColorScheme() : mode;
//     set({ mode, colorScheme });
//   },

//   hydrate: async () => {
//     try {
//       const savedMode = (await AsyncStorage.getItem("themeMode")) as ThemeMode;
//       if (savedMode) {
//         const colorScheme =
//           savedMode === "system" ? getSystemColorScheme() : savedMode;
//         set({ mode: savedMode, colorScheme });
//       }
//     } catch (error) {
//       console.error("Failed to hydrate theme:", error);
//     }
//   },
// }));

// // Listen for system theme changes
// Appearance.addChangeListener(({ colorScheme }) => {
//   const state = useThemeStore.getState();
//   if (state.mode === "system") {
//     useThemeStore.setState({
//       colorScheme: colorScheme === "dark" ? "dark" : "light",
//     });
//   }
// });
