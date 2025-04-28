import { useContext } from 'react';

import { StoreContext } from '@/context/StoreContext';
import { customerType, creamValType, customersSectionType } from "@/constants/types";

import { removeCustomerFromList, recalcSectionSum } from '@/utils/utils';

type Props = {
    formElements: customerType,
    creamValue: creamValType,
    setIsValid: (valid: boolean) => void,
    setStoreCustomersList: (newCustomersList: customersSectionType[]) => void,
    setFormOpen: (isOpen: boolean) => void,
}

const useSubmitForm = ({
    formElements,
    creamValue,
    setIsValid,
    setStoreCustomersList,
    setFormOpen,
}: Props) => {
    const {
        customersList,
        customer,
        dispatch,
    } = useContext(StoreContext);

    return () => {
        const formValid = formElements.day !== 0
            && !!formElements.weekday
            && formElements.name.trim().length > 0
            && creamValue.name === '' && creamValue.price === 0;

        setIsValid(formValid);

        if (!formValid) return;

        const isMh = formElements.type === 0;

        // durring submit remove 'transferred comment' if transferred checkbox is unchecked
        // it prevent to saving data what will be not visible to user
        formElements.transferredComment =
            formElements.isTransferred
                ? formElements.transferredComment : '';

        // customers list empty. Just adding first customer and it first section in list
        if (!customersList || !customersList.length) {
            const sectionObj = {
                weekday: formElements.weekday,
                day: formElements.day,
                mhSum: isMh ? formElements.price : 0,
                mhCount: isMh ? 1 : 0,
                lSum: !isMh ? formElements.price : 0,
                lCount: !isMh ? 1 : 0,
                isNewCount: formElements.isNew ? 1 : 0,
                isClosedCount: formElements.isClosed ? 1 : 0,
                transferredCount: formElements.isTransferred ? 1 : 0,
                creamsSold: formElements.creamSells.length > 0 ? 1 : 0,
                data: [
                    formElements
                ]
            };

            setStoreCustomersList([sectionObj]);
            dispatch({ type: 'mutate', payload: { customersList: [sectionObj] } });
        } else {
            const customersListCopy = [...customersList];
            const sectionIndex = customersListCopy?.findIndex(section => section.day === formElements.day);

            // section doesn't exist. Add section with customer and sort it
            if (sectionIndex === -1) {
                const sectionObj = {
                    weekday: formElements.weekday,
                    day: formElements.day,
                    mhSum: isMh ? formElements.price : 0,
                    mhCount: isMh ? 1 : 0,
                    lSum: !isMh ? formElements.price : 0,
                    lCount: !isMh ? 1 : 0,
                    isNewCount: formElements.isNew ? 1 : 0,
                    isClosedCount: formElements.isClosed ? 1 : 0,
                    transferredCount: formElements.isTransferred ? 1 : 0,
                    creamsSold: formElements.creamSells.length > 0 ? 1 : 0,
                    data: [
                        formElements
                    ]
                };

                customersListCopy.push(sectionObj);
                customersListCopy.sort((a, b) => {
                    return a.day - b.day;
                });
            } else {
                const sectionObj = customersListCopy[sectionIndex];

                // edit mode
                if (customer?.id) {
                    // section of customer was changed - remove customer of old section
                    // check if old section is empty, if so, remove it too
                    if (customer?.day !== formElements.day) {
                        const oldSectionIndex = customersListCopy?.findIndex(section => section.day === customer?.day);
                        const oldCustomerIndex = customersListCopy[oldSectionIndex].data.findIndex(customerItem => customerItem.id === customer?.id);
                        const oldCustomerItem = customersListCopy[oldSectionIndex].data[oldCustomerIndex];
                        const oldIsMh = oldCustomerItem.type === 0;

                        if (oldIsMh) {
                            customersListCopy[oldSectionIndex].mhSum -= oldCustomerItem.price;
                            customersListCopy[oldSectionIndex].mhCount--;
                        } else {
                            customersListCopy[oldSectionIndex].lSum -= oldCustomerItem.price;
                            customersListCopy[oldSectionIndex].lCount--;
                        }

                        // it mutate list what you pass
                        removeCustomerFromList({
                            list: customersListCopy,
                            customerIndex: oldCustomerIndex,
                            sectionIndex: oldSectionIndex
                        });

                        sectionObj.data.unshift(formElements);

                        recalcSectionSum(sectionObj);
                    }
                    // editing customer without change of section
                    else {
                        const customerIndex = sectionObj.data.findIndex(customerItem => customerItem.id === customer.id);
                        sectionObj.data[customerIndex] = formElements;

                        recalcSectionSum(sectionObj);
                    }
                }
                // adding new customer to existing section
                else {
                    if (isMh) {
                        sectionObj.mhSum += formElements.price;
                        sectionObj.mhCount++;
                    } else {
                        sectionObj.lSum += formElements.price;
                        sectionObj.lCount++;
                    }
                    sectionObj.data.unshift(formElements);
                }
            }

            setStoreCustomersList(customersListCopy);
            dispatch({ type: 'mutate', payload: { customersList: customersListCopy } });
        }

        setFormOpen(false);
    }
}

export default useSubmitForm;
