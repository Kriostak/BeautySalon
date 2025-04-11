import { useContext } from "react";

import { StoreContext } from "@/context/StoreContext";
import localizationData from "@/constants/localizationData";

const useTranslate = () => {
    const { store: { lang } } = useContext(StoreContext);

    const t = (text: string, params?: Record<string, string | number>) => {
        let translateString = localizationData?.[lang]?.[text] ?? text;

        params && Object.keys(params).forEach(key => {
            translateString = translateString.replace(`$\{${key}}`, String(params[key]));
        });

        return translateString;
    }

    return { t };
};

export default useTranslate;