import { useContext } from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";

import { salaryObjectCustomerType, themeStylesType, customerType, salaryObjectType } from "@/constants/types";
import { monthsList } from "@/constants/constants";
import useTranslate from "@/hooks/useTranslate";
import useTheme from "@/hooks/useTheme";

import { currencyFormat } from "@/utils/utils";
import { StoreContext } from "@/context/StoreContext";

type TransferredCustomerType = salaryObjectCustomerType & Pick<customerType, "transferredComment">;

type Props = {
    setShowAdditionalInfo: (display: boolean) => void,
    setAdditionalInfo: (data: TransferredCustomerType[]) => void,
    setRenderMethod: (arg: () =>
        ({ item, index }: { item: TransferredCustomerType, index: number }) => React.ReactElement
    ) => void;
    value: salaryObjectType['transferredInfo'],
}

const TransferredInfo = ({
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

    const flatListRenderItem = ({ item, index }: { item: TransferredCustomerType, index: number }): React.ReactElement => {
        return (
            <View style={[styles.listItem, {
                borderBottomWidth: (value.transferredCustomers.length - 1) === index ? 0 : 1,
            }]}>
                <View style={[styles.row]}>
                    <Text
                        style={[styles.salaryText, { maxWidth: '65%' }]}
                    >{item.name}</Text>
                    <Text
                        style={[styles.salaryText, { fontSize: 14 }]}
                    > {`${item.day}.${selectedMonthNumber < 10 ? '0' + selectedMonthNumber : selectedMonthNumber}`}</Text>
                </View>
                <Text style={[styles.salaryText, { textAlign: 'center' }]}>{item.transferredComment}</Text>
            </View>
        );
    };

    return (
        <View style={[styles.salaryRow]}>
            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.salaryText, { flex: 1, textAlign: 'center' }]}>{t('Transferred customers')}</Text>
                    <Text style={[styles.salaryText, { flex: 1, textAlign: 'center' }]}>{value.isTransferredCount}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.salaryText, { flex: 1, textAlign: 'center' }]}>{t('Salary for Transfers')}</Text>
                    <Text style={[styles.salaryText, { flex: 1, textAlign: 'center' }]}>{currencyFormat(value.transferredSalary)}</Text>
                </View>
            </View>
            <Pressable onPress={() => {
                setShowAdditionalInfo(true);
                setAdditionalInfo(value.transferredCustomers);
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

export default TransferredInfo;