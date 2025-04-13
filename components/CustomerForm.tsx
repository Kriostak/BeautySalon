import { useState, useEffect } from 'react';
import { Modal, View, TextInput, Text, Pressable, StyleSheet } from "react-native";
import Checkbox from 'expo-checkbox';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import Octicons from '@expo/vector-icons/Octicons';

import { customersSectionType, customerType, themeStylesType } from "@/constants/types";
import { removeCustomerFromList, recalcSectionSum } from '@/utils/utils';
import { weekDaysList, monthsList } from '@/constants/constants';
import useTranslate from '@/hooks/useTranslate';
import useTheme from '@/hooks/useTheme';

type Props = {
    formOpen: boolean;
    setFormOpen: (isOpen: boolean) => void;
    customersList?: customersSectionType[] | null;
    setCustomersList: (customersList: customersSectionType[]) => void;
    customer?: customerType;
    setStoreCustomersList: (newCustomersList: customersSectionType[]) => void;
    selectedYear: string;
    selectedMonth: string;
    selectedDate: number;
}

const CustomerForm = (
    {
        formOpen,
        setFormOpen,
        customersList,
        setCustomersList,
        customer,
        setStoreCustomersList,
        selectedYear,
        selectedMonth,
        selectedDate
    }: Props): React.ReactElement => {
    const { t } = useTranslate();
    const { themeStyles } = useTheme();

    const basicFormValues: customerType = {
        day: selectedDate,
        weekday: weekDaysList[
            new Date(
                Number(selectedYear),
                monthsList.indexOf(selectedMonth),
                selectedDate
            ).getDay()
        ],
        name: '',
        price: 0,
        type: 0,
        isNew: false,
        isClosed: false,
        isTransferred: false,
        transferredComment: '',
        creamPrice: 0,
        id: new Date().getTime(),
    }
    const [formElements, setFormElements] = useState<typeof basicFormValues>(basicFormValues);

    useEffect(() => {
        setFormElements(customer ?? basicFormValues);
    }, [formOpen]);

    const [isValid, setIsValid] = useState<boolean>(true);

    const submitForm = () => {
        const formValid = formElements.day !== 0
            && !!formElements.weekday
            && formElements.name.trim().length > 0;

        setIsValid(formValid);

        if (!formValid) return;

        const isMh = formElements.type === 0;

        // durring submit remove 'transferred comment' if transferred checkbox is unchecked
        // it prevent to saving data what will be not visible to user
        formElements.transferredComment =
            formElements.isTransferred
                ? formElements.transferredComment : '';

        // customers list empty. Just adding first customer and it first section in list
        if (!customersList) {
            const sectionObj = {
                weekday: formElements.weekday,
                day: formElements.day,
                mhSum: isMh ? formElements.price : 0,
                lSum: !isMh ? formElements.price : 0,
                isNewCount: formElements.isNew ? 1 : 0,
                isClosedCount: formElements.isClosed ? 1 : 0,
                transferredCount: formElements.isTransferred ? 1 : 0,
                creamsSold: formElements.creamPrice > 0 ? 1 : 0,
                data: [
                    formElements
                ]
            };
            setStoreCustomersList([sectionObj]);
            setCustomersList([sectionObj]);
        } else {
            const customersListCopy = [...customersList];
            const sectionIndex = customersListCopy?.findIndex(section => section.day === formElements.day);

            // section doesn't exist. Add section with customer and sort it
            if (sectionIndex === -1) {
                const sectionObj = {
                    weekday: formElements.weekday,
                    day: formElements.day,
                    mhSum: isMh ? formElements.price : 0,
                    lSum: !isMh ? formElements.price : 0,
                    isNewCount: formElements.isNew ? 1 : 0,
                    isClosedCount: formElements.isClosed ? 1 : 0,
                    transferredCount: formElements.isTransferred ? 1 : 0,
                    creamsSold: formElements.creamPrice > 0 ? 1 : 0,
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
                        } else {
                            customersListCopy[oldSectionIndex].lSum -= oldCustomerItem.price;
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
                    } else {
                        sectionObj.lSum += formElements.price;
                    }
                    sectionObj.data.unshift(formElements);
                }
            }

            setStoreCustomersList(customersListCopy);
            setCustomersList(customersListCopy);
        }

        setFormOpen(false);
    }

    const toggleCheckbox = ({ val, key, isNewToggle }: { val: boolean, key: string, isNewToggle?: boolean }) => {
        setFormElements(old => ({
            ...old,
            [key]: val
        }))
        // only for isClosed checkbox. It related to isNew
        if (isNewToggle && !val) {
            setFormElements(old => ({
                ...old,
                isClosed: false
            }))
        }
    }

    const styles = formStyles(themeStyles);

    return (
        <Modal animationType="slide" transparent={true} visible={formOpen}>
            <View style={styles.container}>
                <View style={styles.closeIcon}>
                    <Pressable onPress={() => {
                        setFormOpen(false);
                    }}>
                        <Octicons name="x" size={24} style={{ color: themeStyles.color }} />
                    </Pressable>
                </View>
                <Text style={styles.title}>{customer?.id ? t('Edit Customer') : t('Add Customer')}</Text>
                <View>
                    <View style={styles.formItem}>
                        <TextInput
                            value={formElements.name}
                            onChangeText={(val) => setFormElements(old => ({
                                ...old,
                                name: val
                            }))}
                            placeholder={t('Customer Name')}
                            placeholderTextColor={themeStyles.color}
                            style={[styles.textInput, {
                                borderColor: !isValid && formElements.name.trim().length < 3 ? 'rgba(255, 0, 0, .5)' : themeStyles.border,
                            }]}
                        />
                    </View>

                    <View style={styles.formItem}>
                        <TextInput
                            inputMode='decimal'
                            placeholder={t('Price')}
                            placeholderTextColor={themeStyles.color}
                            value={formElements.price === 0 ? '' : String(formElements.price)}
                            onChangeText={(val) => {
                                setFormElements(old => ({
                                    ...old,
                                    price: Number(val)
                                }))
                            }}
                            style={styles.textInput}
                        />
                    </View>

                    <View style={styles.formItem}>
                        <SegmentedControl
                            values={[t('Multishape'), t('Laser')]}
                            selectedIndex={formElements.type}
                            onChange={(event) => {
                                setFormElements(old => ({
                                    ...old,
                                    type: event.nativeEvent.selectedSegmentIndex
                                }))
                            }}
                            backgroundColor={themeStyles.backgroundSegmentControl}
                            fontStyle={{ color: themeStyles.color }}
                            tintColor={themeStyles.tintSegmentControl}
                        />
                    </View>

                    <View style={[styles.formItem, {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }]}>
                        <Pressable onPress={() => {
                            toggleCheckbox({ val: !formElements.isNew, key: 'isNew', isNewToggle: true });
                        }}>
                            <View style={styles.checkboxWrapper}>
                                <Checkbox
                                    style={{ borderColor: themeStyles.border }}
                                    value={formElements.isNew}
                                    onValueChange={(val) => {
                                        toggleCheckbox({ val, key: 'isNew', isNewToggle: true });
                                    }}
                                />
                                <Text style={styles.checkboxText}>{t('Is New')}</Text>
                            </View>
                        </Pressable>

                        <Pressable onPress={() => {
                            formElements.isNew && toggleCheckbox({ val: !formElements.isClosed, key: 'isClosed' });
                        }}>
                            <View style={styles.checkboxWrapper}>
                                <Checkbox
                                    style={{
                                        borderColor: themeStyles.border,
                                        opacity: !formElements.isNew ? .5 : 1
                                    }}
                                    value={formElements.isClosed}
                                    onValueChange={(val) => {
                                        toggleCheckbox({ val, key: 'isClosed' });
                                    }}
                                    disabled={!formElements.isNew}
                                />
                                <Text style={[styles.checkboxText, { opacity: formElements.isNew ? 1 : .5 }]}>{t('Is Closed')}</Text>
                            </View>
                        </Pressable>
                    </View>

                    <View style={styles.formItem}>
                        <Pressable onPress={() => {
                            toggleCheckbox({ val: !formElements.isTransferred, key: 'isTransferred' });
                        }}>
                            <View style={styles.checkboxWrapper}>
                                <Checkbox
                                    style={{ borderColor: themeStyles.border }}
                                    value={formElements.isTransferred}
                                    onValueChange={(val) => {
                                        toggleCheckbox({ val, key: 'isTransferred' });
                                    }}
                                />
                                <Text style={styles.checkboxText}>{t('Is Transferred')}</Text>
                            </View>
                        </Pressable>
                        {formElements.isTransferred && <TextInput
                            multiline
                            numberOfLines={4}
                            maxLength={255}
                            onChangeText={(val) => setFormElements(old => ({
                                ...old,
                                transferredComment: val
                            }))}
                            value={formElements.transferredComment}
                            style={styles.textInput}
                        />}
                    </View>

                    <View style={styles.formItem}>
                        <TextInput
                            inputMode='decimal'
                            placeholder={t('Cream Price')}
                            placeholderTextColor={themeStyles.color}
                            value={formElements.creamPrice === 0 ? '' : String(formElements.creamPrice)}
                            onChangeText={(val) => {
                                setFormElements(old => ({
                                    ...old,
                                    creamPrice: Number(val)
                                }))
                            }}
                            style={styles.textInput}
                        />
                    </View>

                </View>
                <View style={styles.submitContainer}>
                    <Pressable onPress={submitForm}>
                        <Text style={styles.submit}>{t('Submit Form')}</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

const formStyles = (themeStyles: themeStylesType) => StyleSheet.create({
    container: {
        width: '90%',
        maxWidth: 1000,
        backgroundColor: themeStyles.backgroundModal,
        borderRadius: 18,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
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
        borderColor: themeStyles.border,
    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '500',
        zIndex: 1,
        color: themeStyles.color
    },
    closeIcon: {
        position: 'absolute',
        right: 15,
        top: 10,
        zIndex: 2
    },
    formItem: {
        paddingVertical: 15
    },
    textInput: {
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: themeStyles.border
    },
    checkboxWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    checkboxText: {
        paddingLeft: 5,
        color: themeStyles.color
    },
    submitContainer: {
        alignItems: 'center'
    },
    submit: {
        width: '100%',
        maxWidth: 300,
        marginHorizontal: 'auto',
        backgroundColor: 'rgba(51,178,73, .75)',
        borderWidth: 1,
        borderColor: themeStyles.border,
        textAlign: 'center',
        fontSize: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
    }
});

export default CustomerForm;