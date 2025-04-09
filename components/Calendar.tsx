import { useState, useEffect, useMemo, useContext } from "react";
import { Modal, View, StyleSheet, Text, Pressable } from "react-native";
import Octicons from '@expo/vector-icons/Octicons';

import { monthsList, weekDaysList, shortWeekDaysList } from "@/constants/constants";
import { customersSectionType, monthType, shortDayType } from "@/constants/types";

import { getStoreCustomersList } from "@/actions/actions";
import { LangContext } from "@/context/localizationContext";
import localizationData from "@/constants/localizationData";

type Props = {
    calendarOpen: boolean,
    setCalendarOpen: (isOpen: boolean) => void,
    selectedYear: string;
    setSelectedYear: (year: string) => void;
    selectedMonth: monthType;
    setSelectedMonth: (month: string) => void;
    selectedDate: number;
    setSelectedDate: (date: number) => void;
};

const Calendar = ({
    calendarOpen,
    setCalendarOpen,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    selectedDate,
    setSelectedDate
}: Props): React.ReactElement => {
    const [calendarYear, setCalendarYear] = useState<number>(Number(selectedYear));
    const [calendarMonth, setCalendarMonth] = useState<number>(monthsList.indexOf(selectedMonth));
    const [calendarCustomersList, setCalendarCustomersList] = useState<customersSectionType[] | null>();
    const { lang } = useContext(LangContext);

    useEffect(() => {
        getStoreCustomersList({
            selectedYear: String(calendarYear),
            selectedMonth: monthsList[calendarMonth]
        }).then(customersListResponse => {
            setCalendarCustomersList(customersListResponse);
        });
    }, [calendarYear, calendarMonth]);

    const calendarDate = new Date(calendarYear, (calendarMonth + 1), 0);
    const daysCount = [...Array(calendarDate.getDate()).keys()];

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

    const daysWithData = useMemo(() => {
        return calendarCustomersList?.map(day => day.day);
    }, [calendarCustomersList]);

    return (
        <Modal animationType="slide" transparent={true} visible={calendarOpen}>
            <View style={styles.calendarContainer}>
                <View style={styles.closeIcon}>
                    <Pressable onPress={() => {
                        setCalendarOpen(false);
                    }}>
                        <Octicons name="x" size={24} />
                    </Pressable>
                </View>

                <View style={styles.calendarHeader}>
                    <View style={styles.headerNavigation}>
                        <Pressable onPress={() => {
                            setCalendarYear(calendarYear - 1);
                        }} style={styles.navigation}>
                            <Octicons name="chevron-left" size={24} />
                        </Pressable>
                        <Text style={styles.headerText}>{calendarYear}</Text>
                        <Pressable onPress={() => {
                            setCalendarYear(calendarYear + 1);
                        }} style={styles.navigation}>
                            <Octicons name="chevron-right" size={24} />
                        </Pressable>
                    </View>
                    <View style={styles.headerNavigation}>
                        <Pressable onPress={() => {
                            calendarMonthNavigation(false);
                        }} style={styles.navigation}>
                            <Octicons name="chevron-left" size={24} />
                        </Pressable>
                        <Text style={styles.headerText}>{(localizationData[lang] as Record<monthType, string>)[monthsList[calendarMonth]]}</Text>
                        <Pressable onPress={() => {
                            calendarMonthNavigation(true);
                        }} style={styles.navigation}>
                            <Octicons name="chevron-right" size={24} />
                        </Pressable>
                    </View>
                </View>

                <View style={styles.calendarWeekdays}>
                    {shortWeekDaysList.map((shortWeekday, index) => (
                        <Text style={[styles.cellWidth, styles.textCenter]} key={index}>
                            {(localizationData[lang] as Record<shortDayType, string>)[shortWeekday]}
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
                                    backgroundColor: 'blue',
                                    color: 'white'
                                }
                                : daysWithData?.includes(dayItem + 1)
                                    ? {
                                        backgroundColor: 'green',
                                        color: 'white'
                                    }
                                    : null
                            : null;

                        return (
                            !emptyCell
                                ? <View style={[styles.cellWidth, { padding: 2 }]} key={index}>
                                    <Pressable onPress={() => {
                                        setSelectedYear(String(calendarYear));
                                        setSelectedMonth(monthsList[calendarMonth]);
                                        setSelectedDate(dayItem + 1);
                                        setCalendarOpen(false);
                                    }} style={[styles.calendarDay, {
                                        backgroundColor: aditionalStyles?.backgroundColor
                                    }]}>
                                        <Text style={[styles.textCenter, {
                                            color: aditionalStyles?.color
                                        }]}>{dayItem + 1}</Text>
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

const styles = StyleSheet.create({
    calendarContainer: {
        width: '95%',
        maxWidth: 1000,
        backgroundColor: 'white',
        borderRadius: 18,
        position: 'absolute',
        top: 150,
        left: '50%',
        transform: 'translate(-50%, 0)',
        paddingHorizontal: 10,
        paddingVertical: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,
        elevation: 14,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, .25)',
    },
    closeIcon: {
        position: 'absolute',
        right: 15,
        top: 10,
        zIndex: 2
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
        textAlign: 'center'
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
        borderTopWidth: 1
    },
    cellWidth: {
        width: `${(100 / 7)}%`,
    },
    textCenter: {
        textAlign: 'center'
    },
    calendarDay: {
        paddingVertical: 10,
        borderRadius: '50%',
        borderWidth: 1
    }
});

export default Calendar;