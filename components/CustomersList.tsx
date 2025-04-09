import { useContext } from "react";
import { View, Text, SectionList, Pressable, StyleSheet } from "react-native";
import Octicons from '@expo/vector-icons/Octicons';

import { customersSectionType, customerType, dayType } from "@/constants/types";
import { removeCustomerFromList, currencyFormat } from "@/utils/utils";
import { LangContext } from "@/context/localizationContext";
import localizationData from "@/constants/localizationData";

type Props = {
    customersList: customersSectionType[] | [];
    setCustomersList: (customersList: customersSectionType[]) => void;
    setFormOpen: (isOpen: boolean) => void;
    setCustomer: (customer: customerType) => void;
    setStoreCustomersList: (newCustomersList: customersSectionType[]) => void;
    selectedMonth: string;
    selectedDate: number;
    showOnlyDay: boolean;
}

const CustomersList = ({
    customersList,
    setCustomersList,
    setCustomer,
    setFormOpen,
    setStoreCustomersList,
    selectedMonth,
    selectedDate,
    showOnlyDay
}: Props): React.ReactElement => {
    const { lang } = useContext(LangContext);

    const removeCustomer = (
        { item, index, section }
            : {
                item: customerType;
                index: number;
                section: customersSectionType;
            }
    ) => {
        const customersListCopy = [...customersList];

        const sectionIndex = customersListCopy.findIndex((sectionItem: customersSectionType) => {
            return sectionItem.day === section.day && sectionItem.weekday === section.weekday
        });

        if (item.type === 0) {
            customersListCopy[sectionIndex].mhSum -= item.price ?? 0;
        } else {
            customersListCopy[sectionIndex].lSum -= item.price ?? 0;
        }

        // it mutate list what you pass
        removeCustomerFromList({
            list: customersListCopy,
            customerIndex: index,
            sectionIndex
        });

        setStoreCustomersList(customersListCopy);
        setCustomersList(customersListCopy);
    }

    const renderCustomerItem = (
        { item, index, section }
            : {
                item: customerType,
                index: number;
                section: customersSectionType
            }
    ): React.ReactElement => {
        const isMh = item.type === 0;
        const isClosed = item.isNew ?
            item.isClosed ? {
                color: 'rgba(6, 182, 0, 0.75)',
                textShadowColor: 'rgba(6, 182, 0, 0.75)',
                textShadowOffset: { width: -1, height: 1 },
                textShadowRadius: 10
            } : {
                color: 'rgba(177, 0, 0, 0.75)',
                textShadowColor: 'rgba(177, 0, 0, 0.75)',
                textShadowOffset: { width: -1, height: 1 },
                textShadowRadius: 10
            }
            : {};

        return (
            <View style={styles.customerContainer}>
                <Pressable onPress={() => {
                    setCustomer(item);
                    setFormOpen(true);
                }}>
                    <Octicons name="pencil" size={20} style={[styles.customerButton, { backgroundColor: 'lightgreen' }]} />
                </Pressable>
                <View style={styles.customerMain}>
                    <Text style={[styles.customerName, isClosed]}>{item.name}</Text>
                    <View style={styles.customerInfo}>
                        <Text style={[styles.customerType, { color: isMh ? 'brown' : 'purple' }]}>{isMh ? localizationData[lang].Mh : localizationData[lang].L}</Text>
                        <Text style={[styles.customerPrice, { color: isMh ? 'brown' : 'purple' }]}>{currencyFormat(item.price)}</Text>
                    </View>
                </View>
                <Pressable onPress={() => {
                    removeCustomer({ item, index, section });
                }}>
                    <Octicons name="trash" size={20} style={[styles.customerButton, { backgroundColor: 'red' }]} />
                </Pressable>
            </View>
        )
    }

    const filteredCustomersList = showOnlyDay
        ? customersList.filter(section => section.day === selectedDate)
        : customersList;

    return (
        <View style={styles.container}>
            {filteredCustomersList?.length
                ? <SectionList
                    sections={filteredCustomersList}
                    renderSectionHeader={({ section }) => {
                        return (
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionText}>{`${(localizationData[lang] as Record<dayType, string>)[section.weekday]} ${section.day}`}</Text>

                                <View style={styles.sectionSumContainer}>
                                    <View>
                                        <Text style={[styles.sectionText, { textAlign: 'right', marginRight: 5 }]}>{localizationData[lang].Mh}:</Text>
                                        <Text style={[styles.sectionText, { textAlign: 'right', marginRight: 5 }]}>{localizationData[lang].L}:</Text>
                                    </View>
                                    <View>
                                        <Text style={[styles.sectionText, { color: 'brown' }]}>{currencyFormat(section.mhSum)}</Text>
                                        <Text style={[styles.sectionText, { color: 'purple' }]}>{currencyFormat(section.lSum)}</Text>
                                    </View>
                                </View>
                            </View>
                        );
                    }}
                    renderItem={renderCustomerItem}
                    stickySectionHeadersEnabled={true}
                    keyExtractor={(item) => String(item.id)}
                />
                : showOnlyDay
                    ? <Text style={styles.emptyList}>Please, add customer for {selectedDate} of {selectedMonth}.</Text>
                    : <Text style={styles.emptyList}>Please, add customer.</Text>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    emptyList: {
        textAlign: 'center',
        fontSize: 24,
        color: 'red',
        maxWidth: '70%',
        marginHorizontal: 'auto'
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        backgroundColor: 'white'
    },
    sectionSumContainer: {
        flexDirection: 'row'
    },
    sectionText: {
        fontWeight: 500,
        fontSize: 16,
    },

    customerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderStyle: 'dashed',
    },
    customerMain: {
        flex: 1,
        paddingHorizontal: 10,
    },
    customerInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    customerName: {
        textAlign: 'center',
        fontSize: 16,
    },
    customerType: {
        fontSize: 16,
        fontWeight: 500,
    },
    customerPrice: {
        fontSize: 16,
        fontWeight: 500,
    },
    customerButtons: {
        flexDirection: 'row'
    },
    customerButton: {
        borderWidth: 1,
        borderRadius: 5,
        width: 30,
        height: 30,
        textAlign: 'center',
        paddingTop: 4
    }
});

export default CustomersList;