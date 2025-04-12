import { useContext } from "react";
import { View, Text, SectionList, Pressable, StyleSheet } from "react-native";
import Octicons from '@expo/vector-icons/Octicons';

import { customersSectionType, customerType, themeStylesType } from "@/constants/types";
import { removeCustomerFromList, currencyFormat } from "@/utils/utils";
import useTranslate from "@/hooks/useTranslate";
import { monthsList } from "@/constants/constants";
import useTheme from "@/hooks/useTheme";


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
    const { t } = useTranslate();
    const { themeStyles } = useTheme();

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

    const styles = listStyles(themeStyles);

    const renderCustomerItem = (
        { item, index, section }
            : {
                item: customerType,
                index: number;
                section: customersSectionType
            }
    ): React.ReactElement => {
        const isMh = item.type === 0;
        const isClosedStyles = item.isNew ?
            item.isClosed ? {
                backgroundColor: 'rgba(6, 182, 0, 0.35)',
            } : {
                backgroundColor: 'rgba(177, 0, 0, 0.35)',
            }
            : {};

        return (
            <View style={[styles.customerContainer, isClosedStyles, {
                opacity: section.day !== selectedDate ? .65 : 1,
                borderStyle: index !== section.data.length - 1 ? 'dashed' : 'solid'
            }]}>
                <Text style={styles.customerName}>{item.name}</Text>
                <View style={styles.customerMain}>
                    <Pressable onPress={() => {
                        setCustomer(item);
                        setFormOpen(true);
                    }}>
                        <Octicons name="pencil" size={20} style={[styles.customerButton, { backgroundColor: 'rgba(51,178,73, .75)' }]} />
                    </Pressable>


                    <View style={styles.customerInfo}>
                        <Text style={styles.customerType}>{isMh ? t('Mh') : t('L')}</Text>
                        <Pressable onPress={() => {

                        }}>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ width: 100, color: themeStyles.color }}>{item.transferredComment}</Text>
                        </Pressable>
                        <Text style={styles.customerPrice}>{currencyFormat(item.price)}</Text>
                    </View>

                    <Pressable onPress={() => {
                        removeCustomer({ item, index, section });
                    }}>
                        <Octicons name="trash" size={20} style={[styles.customerButton, { backgroundColor: 'rgba(237,8,0, .75)' }]} />
                    </Pressable>
                </View>
            </View>
        )
    }

    const filteredCustomersList = showOnlyDay
        ? customersList.filter(section => section.day === selectedDate)
        : customersList;

    const monthNumber = monthsList.indexOf(selectedMonth) + 1;

    return (
        <View style={styles.container}>
            {filteredCustomersList?.length
                ? <SectionList
                    sections={filteredCustomersList}
                    renderSectionHeader={({ section }) => {
                        return (
                            <View style={[styles.sectionHeader, { opacity: section.day !== selectedDate ? .65 : 1 }]}>
                                <Text style={[styles.sectionText, {
                                    fontSize: 16,
                                    fontWeight: 500,
                                    borderBottomWidth: 1,
                                    borderColor: themeStyles.border
                                }]}>{`${t(section.weekday)} ${section.day}`}</Text>

                                <View style={styles.sectionInfo}>
                                    <View style={styles.sectionSumContainer}>
                                        <View>
                                            <Text style={[styles.sectionText, { textAlign: 'left', marginRight: 5, }]}>{t('Nw')}:</Text>
                                            <Text style={[styles.sectionText, { textAlign: 'left', marginRight: 5 }]}>{t('Cl')}:</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.sectionText]}>{section.isNewCount}</Text>
                                            <Text style={[styles.sectionText]}>{section.isClosedCount}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.sectionSumContainer}>
                                        <View>
                                            <Text style={[styles.sectionText, { textAlign: 'right', marginRight: 5, fontWeight: 500 }]}>{t('Mh')}:</Text>
                                            <Text style={[styles.sectionText, { textAlign: 'right', marginRight: 5, fontWeight: 500 }]}>{t('L')}:</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.sectionText, { fontWeight: 500 }]}>{currencyFormat(section.mhSum)}</Text>
                                            <Text style={[styles.sectionText, { fontWeight: 500 }]}>{currencyFormat(section.lSum)}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.sectionSumContainer}>
                                        <View>
                                            <Text style={[styles.sectionText, { textAlign: 'left', marginRight: 5 }]}>{t('Cr')}:</Text>
                                            <Text style={[styles.sectionText, { textAlign: 'left', marginRight: 5 }]}>{t('Tr')}:</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.sectionText]}>{section.creamsSold}</Text>
                                            <Text style={[styles.sectionText]}>{section.transferredCount}</Text>
                                        </View>
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
                    ? <Text style={styles.emptyList}>{t(
                        'Please, add customer for ${selectedDate}.${selectedMonth}.', {
                        selectedDate,
                        selectedMonth: monthNumber < 10 ? '0' + monthNumber : monthNumber
                    })}</Text>
                    : <Text style={styles.emptyList}>{t('Please add customer')}</Text>
            }
        </View>
    )
}

const listStyles = (themeStyles: themeStylesType) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: themeStyles.backgroundList
    },
    emptyList: {
        textAlign: 'center',
        fontSize: 24,
        color: 'red',
        maxWidth: '70%',
        marginHorizontal: 'auto'
    },
    sectionHeader: {
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        backgroundColor: themeStyles.backgroundSection,
        borderColor: themeStyles.border
    },
    sectionInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%'
    },
    sectionSumContainer: {
        flexDirection: 'row'
    },
    sectionText: {
        fontSize: 14,
        color: themeStyles.color
    },
    customerContainer: {
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: themeStyles.border,
        flex: 1,
    },
    customerMain: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    customerInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        paddingHorizontal: 7
    },
    customerName: {
        textAlign: 'center',
        fontSize: 16,
        color: themeStyles.color
    },
    customerType: {
        fontSize: 16,
        fontWeight: 500,
        color: themeStyles.color
    },
    customerPrice: {
        fontSize: 16,
        fontWeight: 500,
        color: themeStyles.color
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