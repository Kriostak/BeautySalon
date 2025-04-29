import { useState } from "react";
import { Modal, View, Pressable, StyleSheet, Text, FlatList } from "react-native";
import Octicons from '@expo/vector-icons/Octicons';

import { salaryObjectType, themeStylesType } from "@/constants/types"
import useTranslate from "@/hooks/useTranslate";
import { currencyFormat } from "@/utils/utils";
import useTheme from "@/hooks/useTheme";

import DefaultInfo from "./SalaryListItems/DefaultInfo";
import IsNewInfo from "./SalaryListItems/IsNewInfo";
import TransferredInfo from "./SalaryListItems/TransferredInfo";
import CreamInfo from "./SalaryListItems/CreamInfo";

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

    const salaryListOrder:
        Record<keyof salaryObjectType, (args: any) => React.ReactElement>
        = {
        laserInfo: (value: typeof salaryObject['laserInfo']) =>
            <DefaultInfo
                label={`${t('Laser')}:`}
                value={value}
                key='laserSalary'
            />,
        multishapeInfo: (value: typeof salaryObject['multishapeInfo']) =>
            <DefaultInfo
                label={`${t('Multishape')}:`}
                value={value}
                key='multishapeSalary'
            />,
        isNewInfo: (value: salaryObjectType['isNewInfo']) =>
            <IsNewInfo
                setAdditionalInfo={setAdditionalInfo}
                setRenderMethod={setRenderMethod}
                setShowAdditionalInfo={setShowAdditionalInfo}
                value={value}
                key='isNewInfo'
            />,
        transferredInfo: (value: salaryObjectType['transferredInfo']) =>
            <TransferredInfo
                setAdditionalInfo={setAdditionalInfo}
                setRenderMethod={setRenderMethod}
                setShowAdditionalInfo={setShowAdditionalInfo}
                value={value}
                key='transferredInfo'
            />,
        creamInfo: (value: salaryObjectType['creamInfo']) =>
            <CreamInfo
                setAdditionalInfo={setAdditionalInfo}
                setRenderMethod={setRenderMethod}
                setShowAdditionalInfo={setShowAdditionalInfo}
                value={value}
                key='creamInfo'
            />,
        totalSalary: (value: typeof salaryObject['totalSalary']) =>
            <View style={[styles.salaryRow, { borderBottomWidth: 0 }]} key='totalSalary'>
                <Text style={[styles.salaryText, { fontWeight: 600 }]}>
                    {`${t('Salary')}:`}
                </Text>
                <Text style={[styles.salaryText, { fontWeight: 600 }]}>
                    {currencyFormat(value)}
                </Text>
            </View>,
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
                                }}>
                                    {t('No Data')}
                                </Text>
                        }
                    </View>
                    : Object.entries(salaryListOrder).map(([key, render]) => {
                        const typedKey = key as keyof salaryObjectType;

                        return render(salaryObject[typedKey]);
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default SalaryList;