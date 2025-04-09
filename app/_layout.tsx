import { Stack } from "expo-router";
import { LangProvider } from "@/context/localizationContext";

export default function RootLayout() {
  return (
    <LangProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </LangProvider>
  );
}
