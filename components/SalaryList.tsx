import { Modal, View, Pressable, StyleSheet, Text } from "react-native"
import Octicons from '@expo/vector-icons/Octicons';

import { salaryObjectType, themeStylesType } from "@/constants/types"
import useTranslate from "@/hooks/useTranslate";
import { currencyFormat } from "@/utils/utils";
import useTheme from "@/hooks/useTheme";

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

    const salaryListOrder:
        Record<keyof typeof salaryObject, { text: string; isCurrency: boolean }>
        = {
        laserSalary: {
            text: t('Salary for Laser'),
            isCurrency: true,
        },
        multishapeSalary: {
            text: t('Salary for Multishape'),
            isCurrency: true,
        },
        isNewCount: {
            text: t('Newcomers'),
            isCurrency: false,
        },
        isClosedCount: {
            text: t('Closed Newcomers'),
            isCurrency: false,
        },
        isTransferredCount: {
            text: t('Transferred customers'),
            isCurrency: false,
        },
        transferredSalary: {
            text: t('Salary for Transfers'),
            isCurrency: true,
        },
        creamCount: {
            text: t('Creams sold'),
            isCurrency: false,
        },
        creamSalary: {
            text: t('Salary for Cream'),
            isCurrency: true
        },
        totalSalary: {
            text: t('Salary'),
            isCurrency: true,
        }
    }

    const styles = salaryListStyles(themeStyles);

    return (
        <Modal animationType="slide" transparent={true} visible={salaryListOpen}>
            <View style={styles.container}>
                <View style={styles.closeIcon}>
                    <Pressable onPress={() => {
                        setSalaryListOpen(false);
                    }}>
                        <Octicons name="x" size={24} style={{ color: themeStyles.color }} />
                    </Pressable>
                </View>
                {Object.entries(salaryListOrder).map(([key, rules]) => {
                    const typedKey = key as keyof salaryObjectType;

                    return <View key={key} style={[
                        styles.salaryRow,
                        {
                            borderBottomWidth: typedKey === 'totalSalary' ? 0 : 1
                        }
                    ]}>
                        <Text style={[
                            styles.salaryText,
                            { fontWeight: typedKey === 'totalSalary' ? 600 : 400 }
                        ]}>{`${rules.text}:`}</Text>
                        <Text style={[
                            styles.salaryText,
                            { fontWeight: typedKey === 'totalSalary' ? 600 : 400 }
                        ]}>{rules.isCurrency ? currencyFormat(salaryObject[typedKey]) : salaryObject[typedKey]}</Text>
                    </View>;
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
        gap: 10
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
        borderColor: themeStyles.border
    },
    salaryText: {
        fontSize: 16,
        color: themeStyles.color
    }
});

export default SalaryList;