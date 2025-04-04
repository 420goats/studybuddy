import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
    screenOptions={{
      headerTitle: "",
      headerBackTitleVisible: false,
    }}
    />
  );
}
