import { View, StyleSheet, Pressable, Text } from "react-native";
import Octicons from '@expo/vector-icons/Octicons';

import { useContext } from "react";
import { StoreContext } from "@/context/StoreContext";

type Props = {
    showOnlyDay: boolean;
    setShowOnlyDay: (showOnlySelectedDay: boolean) => void;
};

const CustomerListFooter = ({
    showOnlyDay,
    setShowOnlyDay,
}: Props): React.ReactElement => {
    const { store: { lang }, dispatch } = useContext(StoreContext);

    return (
        <View style={styles.customerListFooter}>
            <View style={styles.footerButtons}>
                <Pressable
                    onPress={() => dispatch({ type: 'switchLocalization' })}
                    style={styles.footerButton}>
                    <Text>{lang === 'UA' ? 'EN' : 'UA'}</Text>
                </Pressable>
                {/* <Pressable style={styles.footerButton}>
                    <Octicons name={lightTheme ? 'moon' : 'sun'} size={20} />
                </Pressable> */}
            </View>

            <Pressable
                onPress={() => setShowOnlyDay(!showOnlyDay)}
                style={styles.footerButton}
            >
                <Octicons name={showOnlyDay ? 'fold-down' : 'fold'} size={20} />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    customerListFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderTopWidth: 1,
        backgroundColor: 'lightgray'
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