import { useState, useEffect, useContext } from 'react';
import { Modal, View, TextInput, Text, Pressable, StyleSheet } from "react-native";
import Checkbox from 'expo-checkbox';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import Octicons from '@expo/vector-icons/Octicons';

import { customersSectionType, customerType } from "@/constants/types";
import { removeCustomerFromList, recalcSectionSum } from '@/utils/utils';
import { weekDaysList, monthsList } from '@/constants/constants';
import { LangContext } from "@/context/localizationContext";
import localizationData from "@/constants/localizationData";

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
    const basicFormValues = {
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
        id: new Date().getTime(),
    }
    const { lang } = useContext(LangContext);
    const [formElements, setFormElements] = useState(basicFormValues);

    useEffect(() => {
        setFormElements(customer ?? basicFormValues);
    }, [formOpen]);

    const [isValid, setIsValid] = useState<boolean>(true);

    const submitForm = () => {
        const formValid = formElements.day !== 0
            && !!formElements.weekday
            && formElements.name.trim().length > 0
            && Number(formElements.price) > 0;

        setIsValid(formValid);

        if (!formValid) return;

        const isMh = formElements.type === 0;

        // customers list empty. Just adding first customer and it first section in list
        if (!customersList) {
            const sectionObj = {
                weekday: formElements.weekday,
                day: formElements.day,
                mhSum: isMh ? formElements.price : 0,
                lSum: !isMh ? formElements.price : 0,
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

    const toggleCheckbox = ({ val, key, isNewToggle }: { val: boolean, key: string, isNewToggle: boolean }) => {
        setFormElements(old => ({
            ...old,
            [key]: val //!formElements.isNew
        }))
        if (isNewToggle && !val) {
            setFormElements(old => ({
                ...old,
                isClosed: false
            }))
        }
    }

    return (
        <Modal animationType="slide" transparent={true} visible={formOpen}>
            <View style={styles.container}>
                <View style={styles.closeIcon}>
                    <Pressable onPress={() => {
                        setFormOpen(false);
                    }}>
                        <Octicons name="x" size={24} />
                    </Pressable>
                </View>
                <Text style={styles.title}>{customer?.id ? localizationData[lang].EditCustomer : localizationData[lang].AddCustomer}</Text>
                <View>
                    <View style={styles.formItem}>
                        <TextInput
                            value={formElements.name}
                            onChangeText={(val) => setFormElements(old => ({
                                ...old,
                                name: val
                            }))}
                            placeholder={localizationData[lang].CustomerName}
                            style={{
                                borderColor: !isValid && formElements.name.trim().length < 3 ? 'rgba(255, 0, 0, .5)' : 'rgba(0, 0, 0, .5)',
                                borderWidth: 1,
                                borderRadius: 5,
                            }}
                        />
                    </View>

                    <View style={styles.formItem}>
                        <TextInput
                            inputMode='decimal'
                            placeholder={localizationData[lang].Price}
                            value={formElements.price === 0 ? '' : String(formElements.price)}
                            onChangeText={(val) => setFormElements(old => ({
                                ...old,
                                price: Number(val)
                            }))}
                            style={{
                                borderColor: !isValid && formElements.name.trim().length < 3 ? 'rgba(255, 0, 0, .5)' : 'rgba(0, 0, 0, .5)',
                                borderWidth: 1,
                                borderRadius: 5,
                            }}
                        />
                    </View>

                    <View style={styles.formItem}>
                        <SegmentedControl
                            values={[localizationData[lang].Multishape, localizationData[lang].Laser]}
                            selectedIndex={formElements.type}
                            onChange={(event) => {
                                setFormElements(old => ({
                                    ...old,
                                    type: event.nativeEvent.selectedSegmentIndex
                                }))
                            }}
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
                                <Checkbox value={formElements.isNew} onValueChange={(val) => {
                                    toggleCheckbox({ val, key: 'isNew', isNewToggle: true });
                                }} />
                                <Text style={styles.checkboxText}>{localizationData[lang].IsNew}</Text>
                            </View>
                        </Pressable>
                        <Pressable onPress={() => {
                            formElements.isNew && toggleCheckbox({ val: !formElements.isClosed, key: 'isClosed', isNewToggle: false });
                        }}>
                            <View style={styles.checkboxWrapper}>
                                <Checkbox value={formElements.isClosed} onValueChange={(val) => {
                                    toggleCheckbox({ val, key: 'isClosed', isNewToggle: false });
                                }} disabled={!formElements.isNew} />
                                <Text style={[styles.checkboxText, { opacity: formElements.isNew ? 1 : .5 }]}>{localizationData[lang].IsClosed}</Text>
                            </View>
                        </Pressable>
                    </View>
                </View>
                <View style={styles.submitContainer}>
                    <Pressable onPress={submitForm}>
                        <Text style={styles.submit}>{localizationData[lang].SubmitForm}</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '90%',
        maxWidth: 1000,
        backgroundColor: 'white',
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
        borderColor: 'rgba(0, 0, 0, .25)',
    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '500',
        zIndex: 1,
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
    checkboxWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    checkboxText: {
        paddingLeft: 5
    },
    submitContainer: {
        alignItems: 'center'
    },
    submit: {
        width: '100%',
        maxWidth: 300,
        marginHorizontal: 'auto',
        backgroundColor: 'lightgreen',
        textAlign: 'center',
        fontSize: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
    }
});

export default CustomerForm;