import { createContext, useReducer } from "react";

import { monthType, customerType, customersSectionType } from "@/constants/types";
import { monthsList } from "@/constants/constants";

export const initialValues = {
    lang: 'UA' as 'UA' | 'EN',
    theme: 'light' as 'light' | 'dark',
    selectedYear: String(new Date().getFullYear()),
    selectedMonth: monthsList[new Date().getMonth()] as monthType,
    selectedDate: new Date().getDate(),
    customer: undefined as customerType | undefined,
    customersList: [] as customersSectionType[] | [] | null,
};

const reducerActions = ['switchLocalization', 'switchTheme', 'mutate'] as const;

type dispatchActionType = {
    type: typeof reducerActions[number];
    payload?: Partial<typeof initialValues>;
};

type storeContextType = {
    dispatch: React.Dispatch<dispatchActionType>;
} & typeof initialValues;

export const StoreContext = createContext<storeContextType>({
    ...initialValues,
    dispatch: () => { },
});

// prop 'testProps' added for testing
const StoreProvider = ({ testProps, children }: {
    testProps?: {
        initialValues?: typeof initialValues,
        callback?: (args: unknown) => void,
    },
    children: React.ReactElement
}): React.ReactElement => {
    const reducer = (
        store: typeof initialValues,
        action: dispatchActionType
    ): typeof initialValues => {
        testProps?.callback?.(action);

        switch (action.type) {
            case 'switchLocalization': {
                return {
                    ...store,
                    lang: store.lang === 'UA' ? 'EN' : 'UA'
                }
            }
            case 'switchTheme': {
                return {
                    ...store,
                    theme: store.theme === 'light' ? 'dark' : 'light'
                }
            }
            case 'mutate': {
                return {
                    ...store,
                    ...action.payload
                }
            }
            default: {
                return store;
            }
        }
    }

    const [store, dispatch] = useReducer(reducer, testProps?.initialValues ?? initialValues);

    return <StoreContext.Provider value={{ ...store, dispatch }}>{children}</StoreContext.Provider>
}

export default StoreProvider;