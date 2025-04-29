import { View, StyleSheet, Pressable, Text } from "react-native";
import { useContext, useState } from "react";
import Octicons from '@expo/vector-icons/Octicons';

import { StoreContext } from "@/context/StoreContext";
import { themeStylesType } from "@/constants/types";

import useTranslate from "@/hooks/useTranslate";
import useTheme from "@/hooks/useTheme";
import { getSalary } from "@/utils/utils";
import { deleteStoreData } from "@/actions/AsyncStorage";

import SalaryList from "@/components/SalaryList/SalaryList";
import Calendar from "@/components/Calendar";
import Confirm from "@/components/Confirm";

type Props = {
    setFormOpen: (isOpen: boolean) => void;
};

const CustomerListHeader = ({
    setFormOpen,
}: Props) => {
    const {
        selectedYear,
        selectedMonth,
        customersList,
        dispatch
    } = useContext(StoreContext);
    const { t } = useTranslate();
    const { themeStyles } = useTheme();
    const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
    const [salaryListOpen, setSalaryListOpen] = useState<boolean>(false);
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

    const totalMhSum = customersList?.reduce((partialSum, section) => partialSum + section.mhSum, 0);
    const totalLSum = customersList?.reduce((partialSum, section) => partialSum + section.lSum, 0);

    const salaryObject = getSalary({
        customersList: customersList ?? [],
        totalMhSum: totalMhSum ?? 0,
        totalLSum: totalLSum ?? 0
    });

    const clearMonth = () => {
        dispatch({ type: 'mutate', payload: { customersList: [] } })
        deleteStoreData(`${selectedYear}:${selectedMonth}`);
    }

    const styles = headerStyles(themeStyles);

    return (
        <View style={styles.customersListHeader}>
            <View style={styles.buttonContainer}>
                <Pressable onPress={() => {
                    setCalendarOpen(true);
                }}>
                    <Octicons name="calendar" size={20} style={styles.button} />
                </Pressable>

                <Pressable onPress={() => {
                    dispatch({ type: 'mutate', payload: { customer: undefined } });
                    setConfirmOpen(true);
                }}>
                    <Octicons name="trash" size={20} style={[styles.button, { paddingLeft: 8, paddingRight: 8 }]} />
                </Pressable>
            </View>

            <View style={{
                marginRight: 0
            }}>
                <Text style={styles.monthText}>{selectedYear}</Text>
                <Text style={styles.monthText}>{t(selectedMonth)}</Text>
            </View>

            <View style={styles.buttonContainer}>
                <Pressable onPress={() => {
                    dispatch({ type: 'mutate', payload: { customer: undefined } });
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

            <Calendar
                calendarOpen={calendarOpen}
                setCalendarOpen={setCalendarOpen}
            />

            <SalaryList
                salaryObject={salaryObject}
                salaryListOpen={salaryListOpen}
                setSalaryListOpen={setSalaryListOpen}
            />

            <Confirm
                confirmOpen={confirmOpen}
                setConfirmOpen={setConfirmOpen}
                confirmText={t("Are you sure that you want to clear selected month?")}
                confirmCallback={clearMonth}
            />
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