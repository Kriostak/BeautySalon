import { customersSectionType } from "@/constants/types";

// it mutate list what you pass
export const removeCustomerFromList = ({
    list,
    sectionIndex,
    customerIndex
}: {
    list: customersSectionType[];
    sectionIndex: number;
    customerIndex: number;
}): void => {
    list[sectionIndex].data.splice(customerIndex, 1);
    if (list[sectionIndex].data.length === 0) {
        list.splice(sectionIndex, 1);
    }
};

// mutate sectionObj what you pass
export const recalcSectionSum = (sectionObj: customersSectionType) => {
    let newMhSum = 0;
    let newLSum = 0;
    sectionObj.data.forEach(customerItem => {
        if (customerItem.type === 0) {
            newMhSum += customerItem.price;
        } else {
            newLSum += customerItem.price;
        }
    });
    sectionObj.mhSum = newMhSum;
    sectionObj.lSum = newLSum;
}

export const currencyFormat = (num: number): string => {
    return '₴' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export const between = (
    { x, min, max }
        : { x: number; min: number; max: number; }
): boolean => {
    return x >= min && x <= max;
}

export const getMultishapePercent = (closedCustomersPercent: number): number => {
    if (between({ min: 80, max: 100, x: closedCustomersPercent })) {
        return .25;
    } else if (between({ min: 70, max: 79, x: closedCustomersPercent })) {
        return .22;
    } else if (between({ min: 60, max: 69, x: closedCustomersPercent })) {
        return .20;
    } else if (between({ min: 50, max: 59, x: closedCustomersPercent })) {
        return .17
    }
    return .15;
}

export const getClosedCustomersPercent = (customerList: customersSectionType[]): number => {
    let isNewCount = 0;
    let isClosedCount = 0;

    customerList.forEach((section) => {
        section.data.forEach(customer => {
            if (customer.isNew) {
                isNewCount++;
            }
            if (customer.isNew && customer.isClosed) {
                isClosedCount++;
            }
        });
    });

    return isNewCount ? (isClosedCount / isNewCount) * 100 : 0;
}