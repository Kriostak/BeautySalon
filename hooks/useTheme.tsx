import { useContext } from "react";

import { StoreContext } from "@/context/StoreContext";
import themeStyles from "@/constants/themeStyles";

const useTheme = () => {
    const { theme } = useContext(StoreContext);

    return {
        theme,
        themeStyles: themeStyles[theme]
    };
}

export default useTheme;