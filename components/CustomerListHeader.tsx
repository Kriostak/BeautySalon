import { useContext } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import Octicons from '@expo/vector-icons/Octicons';
import { customerType, monthType } from "@/constants/types";

import { currencyFormat } from "@/utils/utils";
import useTranslate from "@/hooks/useTranslate";

type Props = {
    setCalendarOpen: (isOpen: boolean) => void;
    selectedYear: string;
    selectedMonth: monthType;
    setCustomer: (customer?: customerType) => void;
    setFormOpen: (isOpen: boolean) => void;
    totalMhSum: number;
    totalLSum: number;
};

const CustomerListHeader = ({
    setCalendarOpen,
    selectedYear,
    selectedMonth,
    setCustomer,
    setFormOpen,
    totalMhSum,
    totalLSum
}: Props) => {
    const { t } = useTranslate();

    return (
        <View style={styles.customersListHeader}>
            <Pressable onPress={() => {
                setCalendarOpen(true);
            }}>
                <View style={styles.backLink}>
                    <Octicons name="calendar" size={20} />
                    <View>
                        <Text style={styles.backText}>{selectedYear}</Text>
                        <Text style={styles.backText}>{t(selectedMonth)}</Text>
                    </View>
                </View>
            </Pressable>

            <View style={styles.totalSum}>
                <View style={styles.sumCol}>
                    <Text style={styles.sumType}>{t('Mh')}:</Text>
                    <Text style={styles.sumType}>{t('L')}:</Text>
                </View>
                <View style={styles.sumCol}>
                    <Text style={[styles.sumValue, { color: 'brown' }]}>{currencyFormat(totalMhSum ?? 0)}</Text>
                    <Text style={[styles.sumValue, { color: 'purple' }]}>{currencyFormat(totalLSum ?? 0)}</Text>
                </View>
            </View>

            <Pressable onPress={() => {
                setCustomer(undefined);
                setFormOpen(true);
            }}>
                <Octicons name="person-add" size={20} style={styles.addCustomerButton} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    customersListHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        backgroundColor: 'lightgray'
    },
    backLink: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        paddingLeft: 5,
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 500
    },
    totalSum: {
        paddingHorizontal: 10,
        flexDirection: 'row'
    },
    sumCol: {

    },
    sumType: {
        width: 35,
        textAlign: 'right',
        marginRight: 5,
        fontStyle: 'italic',
        fontSize: 16
    },
    sumValue: {
        fontWeight: 500,
        fontSize: 16
    },
    addCustomerButton: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'black',
        paddingTop: 8,
        paddingLeft: 8,
        paddingRight: 6,
        paddingBottom: 5,
        backgroundColor: 'lightblue'
    }
});

export default CustomerListHeader;