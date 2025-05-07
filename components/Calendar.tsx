import { useState, useEffect, useContext } from "react";
import { Modal, View, StyleSheet, Text, Pressable } from "react-native";
import Octicons from '@expo/vector-icons/Octicons';

import { monthsList, weekDaysList, shortWeekDaysList } from "@/constants/constants";
import { customersSectionType, themeStylesType } from "@/constants/types";

import { getStoreCustomersList } from "@/actions/actions";
import useTranslate from "@/hooks/useTranslate";
import useTheme from "@/hooks/useTheme";
import { StoreContext } from "@/context/StoreContext";
import { getCurrentMonthDaysCount } from "@/utils/utils";
import genericStyles from "@/styles/generic.module";

type Props = {
    calendarOpen: boolean,
    setCalendarOpen: (isOpen: boolean) => void,
};

const Calendar = ({
    calendarOpen,
    setCalendarOpen,
}: Props): React.ReactElement => {
    const {
        selectedYear,
        selectedMonth,
        selectedDate,
        dispatch
    } = useContext(StoreContext);
    const { t } = useTranslate();
    const { themeStyles } = useTheme();

    const [calendarYear, setCalendarYear] = useState<number>(Number(selectedYear));
    const [calendarMonth, setCalendarMonth] = useState<number>(monthsList.indexOf(selectedMonth));
    const [calendarCustomersList, setCalendarCustomersList] = useState<customersSectionType[] | null>();

    useEffect(() => {
        getStoreCustomersList({
            selectedYear: String(calendarYear),
            selectedMonth: monthsList[calendarMonth]
        }).then(customersListResponse => {
            setCalendarCustomersList(customersListResponse);
        });
    }, [calendarYear, calendarMonth, calendarOpen]);

    const daysCount = getCurrentMonthDaysCount(calendarYear, calendarMonth);

    const firstWeekdayIndex = new Date(calendarYear, calendarMonth, 1).getDay();
    const lastWeekdayIndex = new Date(calendarYear, calendarMonth, daysCount.length).getDay();

    if (firstWeekdayIndex !== 0) {
        for (let i = firstWeekdayIndex; i > 0; i--) {
            daysCount.unshift(-1);
        }
    }
    if (lastWeekdayIndex !== weekDaysList.length - 1) {
        for (let i = lastWeekdayIndex; i < weekDaysList.length - 1; i++) {
            daysCount.push(-1);
        }
    }

    const calendarMonthNavigation = (isPlus: boolean) => {
        let newCalendarMonth = isPlus ? calendarMonth + 1 : calendarMonth - 1;
        if (newCalendarMonth < 0) {
            newCalendarMonth = monthsList.length - 1;
            setCalendarYear(calendarYear - 1);
        } else if (newCalendarMonth === monthsList.length) {
            newCalendarMonth = 0;
            setCalendarYear(calendarYear + 1);
        }
        setCalendarMonth(newCalendarMonth);
    }

    const daysWithData = calendarCustomersList?.map(day => day.day);

    const styles = calendarStyles(themeStyles);
    const appStyles = genericStyles(themeStyles);

    return (
        <Modal animationType="slide" transparent={true} visible={calendarOpen}>
            <View style={[appStyles.modal, styles.calendarModal]}>
                <View style={appStyles.closeIcon}>
                    <Pressable testID="closeCalendar" onPress={() => {
                        setCalendarOpen(false);
                    }}>
                        <Octicons name="x" size={24} style={{ color: themeStyles.color }} />
                    </Pressable>
                </View>

                <View style={styles.calendarHeader}>
                    <View style={styles.headerNavigation}>
                        <Pressable testID="setPrevYear" onPress={() => {
                            setCalendarYear(calendarYear - 1);
                        }} style={styles.navigation}>
                            <Octicons name="chevron-left" size={24} style={{ color: themeStyles.color }} />
                        </Pressable>
                        <Text style={styles.headerText}>{calendarYear}</Text>
                        <Pressable testID="setNextYear" onPress={() => {
                            setCalendarYear(calendarYear + 1);
                        }} style={styles.navigation}>
                            <Octicons name="chevron-right" size={24} style={{ color: themeStyles.color }} />
                        </Pressable>
                    </View>
                    <View style={styles.headerNavigation}>
                        <Pressable testID="setPrevMonth" onPress={() => {
                            calendarMonthNavigation(false);
                        }} style={styles.navigation}>
                            <Octicons name="chevron-left" size={24} style={{ color: themeStyles.color }} />
                        </Pressable>
                        <Text style={styles.headerText}>{t(monthsList[calendarMonth])}</Text>
                        <Pressable testID="setNextMonth" onPress={() => {
                            calendarMonthNavigation(true);
                        }} style={styles.navigation}>
                            <Octicons name="chevron-right" size={24} style={{ color: themeStyles.color }} />
                        </Pressable>
                    </View>
                </View>

                <View style={styles.calendarWeekdays}>
                    {shortWeekDaysList.map((shortWeekday, index) => (
                        <Text style={[styles.cellWidth, styles.textCenter]} key={index}>
                            {t(shortWeekday)}
                        </Text>
                    ))}
                </View>

                <View style={styles.calendarDays}>
                    {daysCount.map((dayItem, index) => {
                        const emptyCell = dayItem === (-1);

                        const selectedDay = selectedYear === String(calendarYear)
                            && selectedMonth === monthsList[calendarMonth]
                            // selectedDate starts from 1, but dayItems from 0
                            && selectedDate === (dayItem + 1);

                        const aditionalStyles = !emptyCell
                            ? selectedDay
                                ? {
                                    backgroundColor: 'rgb(1, 123, 223)',
                                }
                                : daysWithData?.includes(dayItem + 1)
                                    ? {
                                        backgroundColor: 'rgb(0, 219, 110)',
                                    }
                                    : null
                            : null;

                        return (
                            !emptyCell
                                ? <View style={[styles.cellWidth, { padding: 2 }]} key={index}>
                                    <Pressable onPress={() => {
                                        dispatch({
                                            type: 'mutate',
                                            payload: {
                                                selectedYear: String(calendarYear),
                                                selectedMonth: monthsList[calendarMonth],
                                                selectedDate: dayItem + 1
                                            }
                                        });
                                        setCalendarOpen(false);
                                    }} style={[styles.calendarDay, {
                                        backgroundColor: aditionalStyles?.backgroundColor
                                    }]} testID={`day-${dayItem + 1}`}>
                                        <Text style={[styles.textCenter]}>{dayItem + 1}</Text>
                                    </Pressable>
                                </View>
                                : <Text style={styles.cellWidth} key={index}></Text>
                        )
                    })}
                </View>
            </View>
        </Modal>
    )
};

const calendarStyles = (themeStyles: themeStylesType) => StyleSheet.create({
    calendarModal: {
        top: 150,
        transform: 'translate(-50%, 0)',
    },
    calendarHeader: {
        paddingBottom: 15,
        alignItems: 'center'
    },
    headerNavigation: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    navigation: {
        width: 35,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerText: {
        fontSize: 20,
        fontWeight: 500,
        paddingVertical: 5,
        paddingHorizontal: 15,
        width: 150,
        textAlign: 'center',
        color: themeStyles.color
    },
    calendarWeekdays: {
        flexDirection: 'row',
        paddingBottom: 5
    },
    calendarDays: {
        paddingTop: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        borderTopWidth: 1,
        borderColor: themeStyles.border
    },
    cellWidth: {
        width: `${(100 / 7.15)}%`,
    },
    textCenter: {
        textAlign: 'center',
        color: themeStyles.color,
    },
    calendarDay: {
        paddingVertical: 10,
        borderRadius: '50%',
        borderWidth: 1,
        borderColor: themeStyles.border
    }
});

export default Calendar;