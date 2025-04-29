import { useContext } from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";

import { salaryObjectCustomerType, themeStylesType, customerType, salaryObjectType } from "@/constants/types";
import { monthsList } from "@/constants/constants";
import useTranslate from "@/hooks/useTranslate";
import useTheme from "@/hooks/useTheme";
import { StoreContext } from "@/context/StoreContext";

type isNewCustomerType = salaryObjectCustomerType & Pick<customerType, "isClosed">;

type Props = {
    setShowAdditionalInfo: (display: boolean) => void,
    setAdditionalInfo: (data: isNewCustomerType[]) => void,
    setRenderMethod: (arg: () =>
        ({ item, index }: { item: isNewCustomerType, index: number }) => React.ReactElement
    ) => void;
    value: salaryObjectType['isNewInfo'],
}

const IsNewInfo = ({
    setShowAdditionalInfo,
    setAdditionalInfo,
    setRenderMethod,
    value,
}: Props) => {
    const { selectedMonth } = useContext(StoreContext);
    const { t } = useTranslate();
    const { themeStyles } = useTheme();

    const selectedMonthNumber = monthsList.indexOf(selectedMonth) + 1;

    const styles = salaryListStyles(themeStyles);

    const flatListRenderItem = ({ item, index }: { item: isNewCustomerType, index: number }): React.ReactElement => {
        return (
            <View style={[styles.listItem, styles.row, {
                borderBottomWidth: (value.customers.length - 1) === index ? 0 : 1,
                backgroundColor: item.isClosed
                    ? 'rgba(6, 182, 0, 0.35)'
                    : 'rgba(177, 0, 0, 0.35)',
            }]}>
                <Text
                    style={[styles.salaryText, { maxWidth: '65%' }]}
                >{item.name}</Text>
                <Text
                    style={[styles.salaryText, { fontSize: 14 }]}
                > {`${item.day}.${selectedMonthNumber < 10 ? '0' + selectedMonthNumber : selectedMonthNumber}`}</Text>
            </View >
        );
    };

    return (
        <View style={[styles.salaryRow]}>
            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.salaryText, { flex: 1, textAlign: 'center' }]}>{t('New')}</Text>
                    <Text style={[styles.salaryText, { flex: 1, textAlign: 'center' }]}>{value.isNewCount}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.salaryText, { flex: 1, textAlign: 'center' }]}>{t('Closed')}</Text>
                    <Text style={[styles.salaryText, { flex: 1, textAlign: 'center' }]}>{value.isClosedCount}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.salaryText, { flex: 1, textAlign: 'center' }]}>{t('Failed')}</Text>
                    <Text style={[styles.salaryText, { flex: 1, textAlign: 'center' }]}>{value.isNotClosedCount}</Text>
                </View>
            </View>
            <View style={[styles.row, { flex: 1, justifyContent: 'center', gap: 5 }]}>
                <Text style={[styles.salaryText, { fontWeight: 500 }]}>{`${t('Conversion')}:`}</Text>
                <Text style={[styles.salaryText, { fontWeight: 500 }]}>{`${value.conversionPercentage * 100}%`}</Text>
            </View>
            <Pressable onPress={() => {
                setShowAdditionalInfo(true);
                setAdditionalInfo(value.customers);
                setRenderMethod(() => flatListRenderItem);
            }}
                style={[styles.button]}
            >
                <Text style={[styles.salaryText]}>{t('Detail')}</Text>
            </Pressable>
        </View>
    )
}

const salaryListStyles = (themeStyles: themeStylesType) => StyleSheet.create({
    listItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderStyle: "dashed",
        borderBottomColor: themeStyles.border,
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
    button: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: themeStyles.border,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginVertical: 10,
    },
});

export default IsNewInfo;