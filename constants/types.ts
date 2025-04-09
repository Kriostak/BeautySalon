import {
    monthsList,
    weekDaysList,
    shortWeekDaysList
} from "./constants";

// create a union types of const arrays
export type monthType = typeof monthsList[number];
export type dayType = typeof weekDaysList[number];
export type shortDayType = typeof shortWeekDaysList[number];

export type lastSelectedReturnType = { year?: string; month?: string; day?: string; };

export type asyncStoreType = { dataKey: string, dataValue: unknown };

export type customerType = {
    id: number;
    name: string;
    price: number;
    type: number; // 0 - massage, 1 - multishape
    isNew: boolean;
    isClosed: boolean;
    day: number;
    weekday: dayType;
}

export type customersSectionType = {
    weekday: dayType;
    day: number;
    mhSum: number;
    lSum: number;
    data: customerType[];
}