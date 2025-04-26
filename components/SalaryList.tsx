import { Modal, View, Pressable, StyleSheet, Text, FlatList } from "react-native"
import Octicons from '@expo/vector-icons/Octicons';

import { salaryObjectType, themeStylesType } from "@/constants/types"
import useTranslate from "@/hooks/useTranslate";
import { currencyFormat } from "@/utils/utils";
import useTheme from "@/hooks/useTheme";
import { useState } from "react";

type Props = {
    salaryObject: salaryObjectType,
    salaryListOpen: boolean,
    setSalaryListOpen: (isOpen: boolean) => void,
}

const SalaryList = ({
    salaryObject,
    salaryListOpen,
    setSalaryListOpen,
}: Props) => {
    const { t } = useTranslate();
    const { themeStyles } = useTheme();
    const [showAdditionalInfo, setShowAdditionalInfo] = useState<boolean>(false);
    const [additionalInfo, setAdditionalInfo] = useState<any[]>([]);
    const [renderMethod, setRenderMethod] = useState<(({ item }: any) => React.ReactElement) | null>(null);

    const styles = salaryListStyles(themeStyles);

    const InfoWrapper = ({ label, last, children }: {
        label: string,
        last?: boolean,
        children: React.ReactElement
    }): React.ReactElement => {
        return <View style={[styles.salaryRow, { borderBottomWidth: last ? 0 : 1 }]}>
            <Text style={[styles.salaryText, { fontWeight: last ? 600 : 400 }]}>
                {label}
            </Text>
            {children}
        </View>
    }

    const salaryListOrder:
        Record<keyof typeof salaryObject, {
            info: (args: any) => React.ReactElement,
            listItem?: (args: any) => any,
        }>
        = {
        laserSalary: {
            info: (value: typeof salaryObject['laserSalary']) =>
                <InfoWrapper label={`${t('Salary for Laser')}:`} key='laserSalary'>
                    <Text style={[styles.salaryText]}>
                        {currencyFormat(value)}
                    </Text>
                </InfoWrapper>
        },
        multishapeSalary: {
            info: (value: typeof salaryObject['multishapeSalary']) =>
                <InfoWrapper label={`${t('Salary for Multishape')}:`} key='multishapeSalary'>
                    <Text style={[styles.salaryText]}>
                        {currencyFormat(value)}
                    </Text>
                </InfoWrapper>
        },
        isNewInfo: {
            info: (value: typeof salaryObject['isNewInfo']) =>
                <View style={[styles.salaryRow, { flexDirection: 'row', gap: 5 }]} key='isNewInfo'>
                    <View style={{ flex: 1 }}>
                        <Pressable onPress={() => {
                            setShowAdditionalInfo(true);
                            setAdditionalInfo(value.customers);
                            setRenderMethod(() => salaryListOrder.isNewInfo.listItem?.(
                                { showAll: true, itemsLength: value.customers.length }
                            ));
                        }}>
                            <Text style={[styles.salaryText, { flex: 1, textAlign: 'center' }]}>{t('New')}</Text>
                            <Text style={[styles.salaryText, { flex: 1, textAlign: 'center' }]}>{value.isNewCount}</Text>
                        </Pressable>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Pressable onPress={() => {
                            const list = value.customers.filter(customer => customer.isClosed);

                            setShowAdditionalInfo(true);
                            setAdditionalInfo(list);
                            setRenderMethod(() => salaryListOrder.isNewInfo.listItem?.(
                                { showAll: false, itemsLength: list.length }
                            ));
                        }}>
                            <Text style={[styles.salaryText, { flex: 1, textAlign: 'center' }]}>{t('Closed')}</Text>
                            <Text style={[styles.salaryText, { flex: 1, textAlign: 'center' }]}>{value.isClosedCount}</Text>
                        </Pressable>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Pressable onPress={() => {
                            const list = value.customers.filter(customer => !customer.isClosed);

                            setShowAdditionalInfo(true);
                            setAdditionalInfo(list);
                            setRenderMethod(() => salaryListOrder.isNewInfo.listItem?.(
                                { showAll: false, itemsLength: list.length }
                            ));
                        }}>
                            <Text style={[styles.salaryText, { flex: 1, textAlign: 'center' }]}>{t('Failed')}</Text>
                            <Text style={[styles.salaryText, { flex: 1, textAlign: 'center' }]}>{value.isNotClosedCount}</Text>
                        </Pressable>
                    </View>
                </View>,
            listItem: ({ showAll, itemsLength }: { showAll: boolean, itemsLength: number }) => {
                return ({ item, index }: {
                    item: typeof salaryObject['isNewInfo']['customers'][number],
                    index: number
                }) => {
                    return (
                        <View style={[styles.listItem, {
                            borderBottomWidth: (itemsLength - 1) === index ? 0 : 1,
                            backgroundColor:
                                showAll
                                    ? item.isClosed
                                        ? 'rgba(6, 182, 0, 0.35)'
                                        : 'rgba(177, 0, 0, 0.35)'
                                    : 'transparent',
                        }]}>
                            <Text
                                style={[styles.salaryText, { maxWidth: '65%' }]}
                            >{item.name}</Text>
                            <Text
                                style={[styles.salaryText, { fontSize: 14 }]}
                            > {`${t(item.weekday)} ${item.day}`}</Text>
                        </View >
                    );
                }
            }
        },
        isTransferredCount: {
            info: (value: typeof salaryObject['isTransferredCount']) =>
                <InfoWrapper label={`${t('Transferred customers')}:`} key='isTransferredCount'>
                    <Text style={[styles.salaryText]}>
                        {value}
                    </Text>
                </InfoWrapper>
        },
        transferredSalary: {
            info: (value: typeof salaryObject['transferredSalary']) =>
                <InfoWrapper label={`${t('Salary for Transfers')}:`} key='transferredSalary'>
                    <Text style={[styles.salaryText]}>
                        {currencyFormat(value)}
                    </Text>
                </InfoWrapper>
        },
        creamCount: {
            info: (value: typeof salaryObject['creamCount']) =>
                <InfoWrapper label={`${t('Creams sold')}:`} key='creamCount'>
                    <Text style={[styles.salaryText]}>
                        {value}
                    </Text>
                </InfoWrapper>
        },
        creamSalary: {
            info: (value: typeof salaryObject['creamSalary']) =>
                <InfoWrapper label={`${t('Salary for Cream')}:`} key='creamSalary'>
                    <Text style={[styles.salaryText]}>
                        {currencyFormat(value)}
                    </Text>
                </InfoWrapper>
        },
        totalSalary: {
            info: (value: typeof salaryObject['totalSalary']) =>
                <InfoWrapper label={`${t('Salary')}:`} key='totalSalary' last>
                    <Text style={[styles.salaryText, { fontWeight: 600 }]}>
                        {currencyFormat(value)}
                    </Text>
                </InfoWrapper>
        },
    }

    return (
        <Modal animationType="slide" transparent={true} visible={salaryListOpen}>
            <View style={styles.container}>
                <View style={styles.closeIcon}>
                    <Pressable onPress={() => {
                        if (showAdditionalInfo) {
                            setShowAdditionalInfo(false);
                            setRenderMethod(null);
                            setAdditionalInfo([]);
                        } else {
                            setSalaryListOpen(false);
                            setShowAdditionalInfo(false);
                        }
                    }}>
                        <Octicons name="x" size={24} style={{ color: themeStyles.color }} />
                    </Pressable>
                </View>
                {showAdditionalInfo
                    ? <View style={{ paddingTop: additionalInfo.length && renderMethod !== null ? 25 : 0, maxHeight: 600 }}>
                        {
                            additionalInfo.length && renderMethod !== null
                                ? <FlatList
                                    data={additionalInfo}
                                    renderItem={renderMethod}
                                    keyExtractor={item => item.id}
                                    style={{
                                        borderRadius: 10
                                    }}
                                />
                                : <Text style={{
                                    textAlign: 'center',
                                    color: themeStyles.color,
                                    fontSize: 20,
                                    paddingVertical: 25,
                                }}>{t('No Data')}</Text>
                        }
                    </View>
                    : Object.entries(salaryListOrder).map(([key, render]) => {
                        const typedKey = key as keyof salaryObjectType;

                        return render.info(salaryObject[typedKey]);
                    })}
            </View>
        </Modal>
    );
}

const salaryListStyles = (themeStyles: themeStylesType) => StyleSheet.create({
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
        gap: 10,
    },
    closeIcon: {
        position: 'absolute',
        right: 15,
        top: 10,
        zIndex: 2
    },
    salaryRow: {
        alignItems: 'center',
        borderStyle: 'dashed',
        borderColor: themeStyles.border,
        borderBottomWidth: 1,
    },
    salaryText: {
        fontSize: 16,
        color: themeStyles.color,
    },
    listItem: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderStyle: "dashed",
        borderBottomColor: themeStyles.border
    },
});

export default SalaryList;