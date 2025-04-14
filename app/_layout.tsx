import { Stack } from "expo-router";

import StoreProvider from "@/context/StoreContext";
import NativeBars from "@/components/NativeBars";

export default function RootLayout() {

  return (
    <StoreProvider>
      <>
        <NativeBars />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </>
    </StoreProvider>
  );
}
