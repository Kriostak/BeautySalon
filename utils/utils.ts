import { customersSectionType, customerType, salaryObjectType, salaryObjectCustomerType } from "@/constants/types";
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

export const increaseDecreaseSectionHeader = (
    { sectionHeader, data, isIncrease }: {
        sectionHeader: customersSectionType,
        data: customerType,
        isIncrease: boolean,
    }) => {
    if (isIncrease) {
        if (data.type === 0) {
            sectionHeader.mhSum += data.price;
            sectionHeader.mhCount++;
        } else {
            sectionHeader.lSum += data.price;
            sectionHeader.lCount++;
        }

        if (data.isNew) {
            sectionHeader.isNewCount++;
            if (data.isClosed) {
                sectionHeader.isClosedCount++;
            }
        }

        if (data.creamSells.length) {
            sectionHeader.creamsSold += data.creamSells.length;
        }

        if (data.isTransferred) {
            sectionHeader.transferredCount++;
        }
    } else {
        if (data.type === 0) {
            sectionHeader.mhSum -= data.price ?? 0;
            sectionHeader.mhCount--;
        } else {
            sectionHeader.lSum -= data.price ?? 0;
            sectionHeader.lCount--;
        }

        if (data.isNew) {
            sectionHeader.isNewCount--;
            if (data.isClosed) {
                sectionHeader.isClosedCount--;
            }
        }

        if (data.creamSells.length) {
            sectionHeader.creamsSold -= data.creamSells.length;
        }

        if (data.isTransferred) {
            sectionHeader.transferredCount--;
        }
    }
};

// mutate sectionObj what you pass
export const recalcSectionSum = (sectionObj: customersSectionType) => {
    const fakeSectionObj: customersSectionType = {
        ...sectionObj,
        mhSum: 0,
        mhCount: 0,
        lSum: 0,
        lCount: 0,
        isNewCount: 0,
        isClosedCount: 0,
        transferredCount: 0,
        creamsSold: 0,
    };

    sectionObj.data.forEach(customerItem => {
        increaseDecreaseSectionHeader({
            sectionHeader: fakeSectionObj,
            data: customerItem,
            isIncrease: true,
        });
    });

    sectionObj.mhSum = fakeSectionObj.mhSum;
    sectionObj.mhCount = fakeSectionObj.mhCount;
    sectionObj.lSum = fakeSectionObj.lSum;
    sectionObj.lCount = fakeSectionObj.lCount;
    sectionObj.isNewCount = fakeSectionObj.isNewCount;
    sectionObj.isClosedCount = fakeSectionObj.isClosedCount;
    sectionObj.transferredCount = fakeSectionObj.transferredCount;
    sectionObj.creamsSold = fakeSectionObj.creamsSold;
}

export const currencyFormat = (num: number): string => {
    return '₴' + num.toFixed(1).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export const getCurrentMonthDaysCount = (year: number, month: number): number[] => {
    return [...Array(new Date(year, (month + 1), 0).getDate()).keys()];
}

export const between = (
    { x, min, max }
        : { x: number; min: number; max: number; }
): boolean => {
    return x >= min && x <= max;
}

export const getMultishapePercent = (closedCustomersPercent: number): number => {
    if (between({ min: 75, max: 100, x: closedCustomersPercent })) {
        return .25;
    } else if (between({ min: 65, max: 74, x: closedCustomersPercent })) {
        return .22;
    }
    return .20;
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
    let isNotClosedCount = 0;
    let isTransferredCount = 0;
    let creamCount = 0;
    let creamSum = 0;
    const creamSells: Array<salaryObjectCustomerType & Pick<customerType, 'creamSells'>> = [];
    const isNewCustomers: Array<salaryObjectCustomerType & Pick<customerType, 'isClosed'>> = [];
    const transferredCustomers: Array<salaryObjectCustomerType & Pick<customerType, 'transferredComment'>> = [];

    customersList.forEach((section) => {
        section.data.forEach(customer => {
            if (customer.isNew) {
                isNewCount++;

                if (customer.isClosed) {
                    isClosedCount++;
                } else {
                    isNotClosedCount++;
                }

                isNewCustomers.push({
                    name: customer.name,
                    isClosed: customer.isClosed,
                    id: customer.id,
                    day: customer.day,
                });
            }
            if (customer.isTransferred) {
                isTransferredCount++;
                transferredCustomers.push({
                    name: customer.name,
                    id: customer.id,
                    day: customer.day,
                    transferredComment: customer.transferredComment,
                });
            }
            if (customer.creamSells.length) {
                creamCount += customer.creamSells.length;
                creamSum += customer.creamSells.reduce((prev, curr) => prev + curr.price, 0);
                creamSells.push({
                    name: customer.name,
                    id: customer.id,
                    day: customer.day,
                    creamSells: customer.creamSells
                })
            }
        });
    });

    const multishapePercentage = isNewCount ? (isClosedCount * 100) / isNewCount : 0;
    const conversionPercentage = getMultishapePercent(multishapePercentage);

    const laserSalary = totalLSum * LASER_PERCENT;
    const multishapeSalary = totalMhSum * conversionPercentage;
    const transferredSalary = isTransferredCount * TRANSFERRED_PERCENT;
    const creamSalary = creamSum * CREAM_PERCENT;

    const totalSalary = laserSalary + multishapeSalary + transferredSalary + creamSalary;

    const laserInfo = {
        salary: laserSalary,
        receipts: totalLSum
    };
    const multishapeInfo = {
        salary: multishapeSalary,
        receipts: totalMhSum
    }

    const isNewInfo = {
        isNewCount,
        isClosedCount,
        isNotClosedCount,
        conversionPercentage,
        customers: isNewCustomers,
    };

    const transferredInfo = {
        transferredSalary,
        isTransferredCount,
        transferredCustomers
    };

    const creamInfo = {
        creamSalary,
        creamCount,
        creamSells
    };

    return {
        laserInfo,
        multishapeInfo,
        isNewInfo,
        transferredInfo,
        creamInfo,
        totalSalary,
    };
}