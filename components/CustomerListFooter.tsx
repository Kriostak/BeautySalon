import { View, StyleSheet, Pressable, Text } from "react-native";
import Octicons from '@expo/vector-icons/Octicons';

import { useContext } from "react";
import { StoreContext } from "@/context/StoreContext";
import { themeStylesType } from "@/constants/types";
import useTheme from "@/hooks/useTheme";

type Props = {
    showOnlyDay: boolean;
    setShowOnlyDay: (showOnlySelectedDay: boolean) => void;
};

const CustomerListFooter = ({
    showOnlyDay,
    setShowOnlyDay,
}: Props): React.ReactElement => {
    const { lang, dispatch } = useContext(StoreContext);
    const { themeStyles, theme } = useTheme();

    const styles = footerStyles(themeStyles);

    return (
        <View style={styles.customerListFooter}>

            <Pressable
                onPress={() => dispatch({ type: 'switchLocalization' })}
                style={styles.footerButton}>
                <Text style={{ color: themeStyles.color }}>{lang === 'UA' ? 'EN' : 'UA'}</Text>
            </Pressable>

            <Pressable
                onPress={() => dispatch({ type: 'switchTheme' })}
                style={styles.footerButton}>
                <Octicons name={theme === 'light' ? 'moon' : 'sun'} size={20} style={{ color: themeStyles.color }} />
            </Pressable>


            <Pressable
                onPress={() => setShowOnlyDay(!showOnlyDay)}
                style={styles.footerButton}
            >
                <Octicons name={showOnlyDay ? 'fold-down' : 'fold'} size={20} style={{ color: themeStyles.color }} />
            </Pressable>
        </View>
    );
};

const footerStyles = (themeStyles: themeStylesType) => StyleSheet.create({
    customerListFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderTopWidth: 1,
        backgroundColor: themeStyles.backgroundTitle,
        borderTopColor: themeStyles.border
    },
    footerButtons: {
        flexDirection: 'row',
        gap: 5
    },
    footerButton: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: themeStyles.border
    },
    salaryContainer: {
        marginLeft: 0,
        alignItems: 'center'
    },
    salaryText: {
        fontSize: 20,
        fontWeight: 500
    },
    salaryValue: {
        color: 'rgb(224, 134, 0)',

    }
});

export default CustomerListFooter;