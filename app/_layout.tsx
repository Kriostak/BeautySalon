import { Stack } from "expo-router";
import StoreProvider from "@/context/StoreContext";

export default function RootLayout() {
  return (
    <StoreProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </StoreProvider>
  );
}
