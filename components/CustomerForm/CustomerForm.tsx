import { useState, useEffect, useContext } from 'react';
import { Modal, View, TextInput, Text, Pressable, StyleSheet } from "react-native";
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import Octicons from '@expo/vector-icons/Octicons';

import { customersSectionType, customerType, themeStylesType, creamValType } from "@/constants/types";

import { weekDaysList, monthsList } from '@/constants/constants';
import useTranslate from '@/hooks/useTranslate';
import useTheme from '@/hooks/useTheme';
import { StoreContext } from '@/context/StoreContext';

import CreamFields from './CustomerFormFields/CreamFields';
import IsNewCheckboxes from './CustomerFormFields/IsNewCheckboxes';
import IsTransferredField from './CustomerFormFields/IsTransferedField';
import useSubmitForm from '@/hooks/useSubmitForm';

type Props = {
    formOpen: boolean;
    setFormOpen: (isOpen: boolean) => void;
    setStoreCustomersList: (newCustomersList: customersSectionType[]) => void;
}

const CustomerForm = (
    {
        formOpen,
        setFormOpen,
        setStoreCustomersList,
    }: Props): React.ReactElement => {
    const {
        customersList,
        customer,
        selectedYear,
        selectedMonth,
        selectedDate,
        dispatch,
    } = useContext(StoreContext);
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
        creamSells: [],
        id: new Date().getTime(),
    }
    const [formElements, setFormElements] = useState<customerType>(basicFormValues);
    const [creamValue, setCreamValue] = useState<creamValType>({ name: '', price: 0 });

    useEffect(() => {
        setFormElements(customer ?? basicFormValues);
        setCreamValue({ name: '', price: 0 });
    }, [formOpen]);

    const [isValid, setIsValid] = useState<boolean>(true);

    const submitForm = useSubmitForm({
        formElements,
        creamValue,
        setIsValid,
        setStoreCustomersList,
        setFormOpen,
    })

    const toggleCheckbox = ({ val, key, isNewToggle }: { val: boolean, key: string, isNewToggle?: boolean }) => {
        setFormElements(old => ({
            ...old,
            [key]: val
        }))
        // only for 'isClosed' checkbox. It related to 'isNew'
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

                    <IsNewCheckboxes
                        formElements={formElements}
                        toggleCheckbox={toggleCheckbox}
                    />

                    <IsTransferredField
                        formElements={formElements}
                        setFormElements={setFormElements}
                        toggleCheckbox={toggleCheckbox}
                    />

                    <CreamFields
                        formElements={formElements}
                        setFormElements={setFormElements}
                        creamValue={creamValue}
                        setCreamValue={setCreamValue}
                        isValid={isValid}
                    />

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
        borderColor: themeStyles.border,
        color: themeStyles.color,
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