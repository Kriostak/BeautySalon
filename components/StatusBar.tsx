import { useContext } from "react";
import { StatusBar } from "react-native";

import { StoreContext } from "@/context/StoreContext";
import useTheme from "@/hooks/useTheme";

const StatusBarComponent = (): React.ReactElement => {
    const { theme } = useContext(StoreContext);
    const { themeStyles } = useTheme();

    return (
        <StatusBar
            backgroundColor={themeStyles.backgroundTitle}
            barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        />
    );
}

export default StatusBarComponent;