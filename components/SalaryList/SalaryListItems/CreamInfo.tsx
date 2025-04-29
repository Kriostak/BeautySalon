import { useContext } from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";

import { salaryObjectCustomerType, themeStylesType, customerType, salaryObjectType } from "@/constants/types";
import { monthsList } from "@/constants/constants";
import useTranslate from "@/hooks/useTranslate";
import useTheme from "@/hooks/useTheme";

import { currencyFormat } from "@/utils/utils";
import { StoreContext } from "@/context/StoreContext";

type CreamCustomerType = salaryObjectCustomerType & Pick<customerType, "creamSells">;

type Props = {
    setShowAdditionalInfo: (display: boolean) => void,
    setAdditionalInfo: (data: CreamCustomerType[]) => void,
    setRenderMethod: (arg: () =>
        ({ item, index }: { item: CreamCustomerType, index: number }) => React.ReactElement
    ) => void;
    value: salaryObjectType['creamInfo'],
}

const CreamInfo = ({
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

    const flatListRenderItem = ({ item, index }: { item: CreamCustomerType, index: number }): React.ReactElement => {
        let creamSum = 0;

        return (
            <View style={[styles.listItem, { flexDirection: 'column', borderBottomWidth: (value.creamSells.length - 1) === index ? 0 : 1 }]}>
                <View style={[styles.row, {
                    borderBottomWidth: 1,
                    borderBottomColor: themeStyles.border
                }]}>
                    <Text
                        style={[styles.salaryText, { maxWidth: '65%', width: '100%' }]}
                    >{item.name}</Text>
                    <Text
                        style={[styles.salaryText, { fontSize: 14, maxWidth: '35%', width: '100%', textAlign: 'right' }]}
                    > {`${item.day}.${selectedMonthNumber < 10 ? '0' + selectedMonthNumber : selectedMonthNumber}`}</Text>
                </View>
                <View>
                    {item.creamSells.map((cream, index) => {
                        creamSum += cream.price;

                        return (
                            <View style={[styles.row, {
                                width: '100%'
                            }]} key={index}>
                                <Text
                                    style={[styles.salaryText, { fontSize: 13 }]}
                                >{cream.name}</Text>
                                <Text
                                    style={[styles.salaryText, { fontSize: 13 }]}
                                >{currencyFormat(cream.price)}</Text>
                            </View>
                        );
                    })}
                </View>
                {item.creamSells.length > 1 &&
                    <View style={[styles.row]}>
                        <Text
                            style={[styles.salaryText, { fontSize: 13, fontWeight: 500 }]}
                        >{`${t('Summary')}:`}</Text>
                        <Text
                            style={[styles.salaryText, { fontSize: 13, fontWeight: 500 }]}
                        >{currencyFormat(creamSum)}</Text>
                    </View>
                }
            </View>
        );
    };

    return (
        <View style={[styles.salaryRow]}>
            <View style={[styles.row, { gap: 15 }]}>
                <View>
                    <Text style={[styles.salaryText, { flex: 1, textAlign: 'center' }]}>{t('Creams sold')}</Text>
                    <Text style={[styles.salaryText, { flex: 1, textAlign: 'center' }]}>{value.creamCount}</Text>
                </View>
                <View>
                    <Text style={[styles.salaryText, { flex: 1, textAlign: 'center' }]}>{t('Salary for Cream')}</Text>
                    <Text style={[styles.salaryText, { flex: 1, textAlign: 'center' }]}>{currencyFormat(value.creamSalary)}</Text>
                </View>
            </View>
            <Pressable onPress={() => {
                setShowAdditionalInfo(true);
                setAdditionalInfo(value.creamSells);
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

export default CreamInfo;