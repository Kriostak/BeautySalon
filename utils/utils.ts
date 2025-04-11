import { customersSectionType, salaryObjectType } from "@/constants/types";
import { CREAM_PERCENT, LASER_PERCENT, TRANSFERRED_PERCENT } from "@/constants/constants";

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
    let isNewCount = 0;
    let isClosedCount = 0;
    let transferredCount = 0;
    let creamsSold = 0;

    sectionObj.data.forEach(customerItem => {
        if (customerItem.type === 0) {
            newMhSum += customerItem.price;
        } else {
            newLSum += customerItem.price;
        }
        if (customerItem.isNew) {
            isNewCount++;
        }
        if (customerItem.isClosed) {
            isClosedCount++;
        }
        if (customerItem.isTransferred) {
            transferredCount++;
        }
        if (customerItem.creamPrice > 0) {
            creamsSold++;
        }
    });

    sectionObj.mhSum = newMhSum;
    sectionObj.lSum = newLSum;
    sectionObj.isNewCount = isNewCount;
    sectionObj.isClosedCount = isClosedCount;
    sectionObj.transferredCount = transferredCount;
    sectionObj.creamsSold = creamsSold;
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

export const getSalary = ({
    customersList,
    totalMhSum,
    totalLSum
}: {
    customersList: customersSectionType[],
    totalMhSum: number,
    totalLSum: number,
}): salaryObjectType => {
    let isNewCount = 0;
    let isClosedCount = 0;
    let isTransferredCount = 0;
    let creamCount = 0;
    let creamSum = 0;

    customersList.forEach((section) => {
        section.data.forEach(customer => {
            if (customer.isNew) {
                isNewCount++;
            }
            if (customer.isNew && customer.isClosed) {
                isClosedCount++;
            }
            if (customer.isTransferred) {
                isTransferredCount++;
            }
            if (customer.creamPrice !== 0) {
                creamCount++;
                creamSum += customer.creamPrice;
            }
        });
    });

    const multishapePercentage = isNewCount ? (isClosedCount / isNewCount) * 100 : 0;

    const laserSalary = totalLSum * LASER_PERCENT;
    const multishapeSalary = totalMhSum * multishapePercentage;
    const transferredSalary = isTransferredCount * TRANSFERRED_PERCENT;
    const creamSalary = creamSum * CREAM_PERCENT;

    const totalSalary = laserSalary + multishapeSalary + transferredSalary;

    return {
        laserSalary,
        isNewCount,
        isClosedCount,
        multishapeSalary,
        isTransferredCount,
        transferredSalary,
        creamCount,
        creamSalary,
        totalSalary
    };
}