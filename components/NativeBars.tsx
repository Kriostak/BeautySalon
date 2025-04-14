import { useContext } from "react";
import { StatusBar } from "react-native";
import * as NavigationBar from 'expo-navigation-bar';

import { StoreContext } from "@/context/StoreContext";
import useTheme from "@/hooks/useTheme";

const NativeBars = (): React.ReactElement => {
    const { theme } = useContext(StoreContext);
    const { themeStyles } = useTheme();

    NavigationBar.setBackgroundColorAsync(themeStyles.backgroundTitle);
    NavigationBar.setButtonStyleAsync(theme === 'light' ? 'dark' : 'light');

    return (
        <StatusBar
            backgroundColor={themeStyles.backgroundTitle}
            barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        />
    );
}

export default NativeBars;