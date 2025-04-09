import { View, StyleSheet, Pressable, Text } from "react-native";
import Octicons from '@expo/vector-icons/Octicons';

import { currencyFormat, getMultishapePercent } from "@/utils/utils";
import { useContext } from "react";
import { LangContext } from "@/context/localizationContext";
import localizationData from "@/constants/localizationData";

type Props = {
    showOnlyDay: boolean;
    setShowOnlyDay: (showOnlySelectedDay: boolean) => void;
    totalMhSum: number;
    totalLSum: number;
    closedCustomersPercent: number;
};

const CustomerListFooter = ({
    showOnlyDay,
    setShowOnlyDay,
    totalMhSum,
    totalLSum,
    closedCustomersPercent
}: Props): React.ReactElement => {
    const { lang, localization, setLocalization } = useContext(LangContext);

    const laserPercent = 0.17;
    const salaryForLaser = totalLSum * laserPercent;
    const multishapePercent = getMultishapePercent(closedCustomersPercent);
    const salaryForMultishape = totalMhSum * multishapePercent;
    const salary = salaryForLaser + salaryForMultishape;

    return (
        <View style={styles.customerListFooter}>
            <View style={styles.footerButtons}>
                <Pressable
                    onPress={() => setLocalization(!localization)}
                    style={styles.footerButton}>
                    <Text>{localization ? 'EN' : 'UA'}</Text>
                </Pressable>
                {/* <Pressable style={styles.footerButton}>
                    <Octicons name={lightTheme ? 'moon' : 'sun'} size={20} />
                </Pressable> */}
            </View>

            <View style={styles.salaryContainer}>
                <Text style={styles.salaryText}>{localizationData[lang].Salary}</Text>
                <Text style={[styles.salaryText, styles.salaryValue]}>{currencyFormat(salary ?? 0)}</Text>
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