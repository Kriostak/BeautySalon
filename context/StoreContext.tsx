import { Context, createContext, useReducer } from "react";

const initialValues = {
    lang: 'UA' as 'UA' | 'EN',
    theme: 'light' as 'light' | 'dark',
};

type dispatchActionType = Record<string, string | number | boolean>;


type storeContextType = {
    store: typeof initialValues;
    dispatch: React.Dispatch<{ type: string; payload?: dispatchActionType }>;
};

export const StoreContext = createContext<storeContextType>({
    store: { ...initialValues },
    dispatch: () => { },
});

const StoreProvider = ({ children }: { children: React.ReactElement }): React.ReactElement => {
    const reducer = (
        store: typeof initialValues,
        action: { type: string; payload?: dispatchActionType }
    ): typeof initialValues => {

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
            default: {
                return store;
            }
        }
    }

    const [store, dispatch] = useReducer(reducer, initialValues);

    return <StoreContext.Provider value={{ store, dispatch }}>{children}</StoreContext.Provider>
}

export default StoreProvider;