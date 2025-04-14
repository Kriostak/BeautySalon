import { Stack } from "expo-router";

import StoreProvider from "@/context/StoreContext";
import StatusBar from "@/components/StatusBar";

export default function RootLayout() {

  return (
    <StoreProvider>
      <>
        <StatusBar />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </>
    </StoreProvider>
  );
}
