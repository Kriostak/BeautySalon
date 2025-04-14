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
    isTransferred: boolean;
    transferredComment: string;
    creamPrice: number;
    day: number;
    weekday: dayType;
}

export type customersSectionType = {
    weekday: dayType;
    day: number;
    mhSum: number;
    lSum: number;
    isNewCount: number;
    isClosedCount: number;
    transferredCount: number;
    creamsSold: number;
    data: customerType[];
}

export type salaryObjectType = {
    laserSalary: number,
    multishapeSalary: number,
    isNewCount: number,
    isClosedCount: number,
    isTransferredCount: number,
    transferredSalary: number,
    creamCount: number,
    creamSalary: number,
    totalSalary: number
}

export type themeType = 'light' | 'dark';

export type themeStylesType = {
    border: string,
    backgroundTitle: string,
    backgroundSection: string,
    backgroundList: string,
    backgroundModal: string,
    backgroundSegmentControl: string,
    tintSegmentControl: string,
    color: string
};