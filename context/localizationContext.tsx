import { createContext, useState } from "react";

type langContextType = {
    lang: 'UA' | 'EN';
    localization: boolean;
    setLocalization: (localization: boolean) => void;
}

export const LangContext = createContext<langContextType>({ lang: 'UA', localization: true, setLocalization: () => { } });

export const LangProvider = ({ children }: { children: React.ReactElement }) => {
    const [localization, setLocalization] = useState(true);

    const lang = localization ? 'UA' : 'EN';
    const themeContextValue: langContextType = { lang, localization, setLocalization };

    return <LangContext.Provider value={themeContextValue}>{children}</LangContext.Provider>
}