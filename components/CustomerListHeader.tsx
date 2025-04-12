import { View, StyleSheet, Pressable, Text } from "react-native";
import Octicons from '@expo/vector-icons/Octicons';

import { customerType, monthType, themeType, themeStylesType } from "@/constants/types";

import useTranslate from "@/hooks/useTranslate";
import useTheme from "@/hooks/useTheme";

type Props = {
    setCalendarOpen: (isOpen: boolean) => void;
    selectedYear: string;
    selectedMonth: monthType;
    setCustomer: (customer?: customerType) => void;
    setFormOpen: (isOpen: boolean) => void;
    setSalaryListOpen: (isOpen: boolean) => void;
    totalMhSum: number;
    totalLSum: number;
};

const CustomerListHeader = ({
    setCalendarOpen,
    selectedYear,
    selectedMonth,
    setCustomer,
    setFormOpen,
    setSalaryListOpen,

}: Props) => {
    const { t } = useTranslate();
    const { themeStyles } = useTheme();

    const styles = headerStyles(themeStyles);

    return (
        <View style={styles.customersListHeader}>
            <Pressable onPress={() => {
                setCalendarOpen(true);
            }}>
                <Octicons name="calendar" size={20} style={styles.button} />
            </Pressable>

            <View style={{
                marginRight: -35
            }}>
                <Text style={styles.monthText}>{selectedYear}</Text>
                <Text style={styles.monthText}>{t(selectedMonth)}</Text>
            </View>

            <View style={styles.buttonContainer}>
                <Pressable onPress={() => {
                    setCustomer(undefined);
                    setFormOpen(true);
                }}>
                    <Octicons name="person-add" size={20} style={styles.button} />
                </Pressable>
                <Pressable onPress={() => {
                    setSalaryListOpen(true);
                }}>
                    <Octicons name="checklist" size={20} style={styles.button} />
                </Pressable>
            </View>
        </View>
    );
}

const headerStyles = (themeStyles: themeStylesType) => StyleSheet.create({
    customersListHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: themeStyles.border,
        backgroundColor: themeStyles.backgroundTitle
    },
    monthText: {
        paddingLeft: 5,
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 500,
        color: themeStyles.color
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
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    button: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: themeStyles.border,
        paddingTop: 6,
        paddingLeft: 7,
        paddingRight: 6,
        paddingBottom: 6,
        color: themeStyles.color
    }
});

export default CustomerListHeader;