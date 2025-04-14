import { useContext } from "react";

import { StoreContext } from "@/context/StoreContext";
import localizationData, { localizationType } from "@/constants/localizationData";

const useTranslate = () => {
    const { lang } = useContext(StoreContext);

    const t = (text: keyof localizationType, params?: Record<string, string | number>) => {
        let translateString = localizationData?.[lang]?.[text] ?? text;

        params && Object.keys(params).forEach(key => {
            translateString = translateString.replace(`$\{${key}}`, String(params[key]));
        });

        return translateString;
    }

    return { t };
};

export default useTranslate;