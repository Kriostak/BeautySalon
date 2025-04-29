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
    creamSells: {
        name: string,
        price: number,
    }[];
    day: number;
    weekday: dayType;
}

export type customersSectionType = {
    weekday: dayType;
    day: number;
    mhSum: number;
    mhCount: number;
    lSum: number;
    lCount: number;
    isNewCount: number;
    isClosedCount: number;
    transferredCount: number;
    creamsSold: number;
    data: customerType[];
}
export type salaryObjectCustomerType = Pick<customerType, 'name' | 'id' | 'day'>;

export type salaryObjectType = {
    laserSalary: number,
    multishapeSalary: number,
    isNewInfo: {
        isNewCount: number,
        isClosedCount: number,
        isNotClosedCount: number,
        customers: (salaryObjectCustomerType & Pick<customerType, 'isClosed'>)[]
    },
    transferredInfo: {
        isTransferredCount: number,
        transferredSalary: number,
        transferredCustomers: (salaryObjectCustomerType & Pick<customerType, 'transferredComment'>)[]
    },
    creamInfo: {
        creamCount: number,
        creamSalary: number,
        creamSells: (salaryObjectCustomerType & Pick<customerType, 'creamSells'>)[]
    }
    totalSalary: number,
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

export type creamValType = {
    name: string,
    price: number,
}