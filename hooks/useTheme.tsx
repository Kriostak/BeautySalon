import { useContext } from "react";

import { StoreContext } from "@/context/StoreContext";
import themeStyles from "@/constants/themeStyles";

const useTheme = () => {
    const { store: { theme } } = useContext(StoreContext);

    return {
        theme,
        themeStyles: themeStyles[theme]
    };
}

export default useTheme;