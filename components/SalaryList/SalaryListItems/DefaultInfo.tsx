import { View, StyleSheet, Text } from "react-native";

import { themeStylesType } from "@/constants/types";
import useTheme from "@/hooks/useTheme";
import useTranslate from "@/hooks/useTranslate";
import { currencyFormat } from "@/utils/utils";

type Props = {
    label: string,
    value: {
        salary: number,
        receipts: number,
    }
};

const DefaultInfo = ({ label, value }: Props) => {
    const { t } = useTranslate()
    const { themeStyles } = useTheme();
    const styles = salaryListStyles(themeStyles);

    return (
        <View style={[styles.salaryRow]}>
            <Text style={[styles.salaryText]}>{`${t('Receipts for')} ${label}`}</Text>
            <Text style={[styles.salaryText]}>{currencyFormat(value.receipts)}</Text>
            <Text style={[styles.salaryText]}>{`${t('Salary for')} ${label}`}</Text>
            <Text style={[styles.salaryText]}>{currencyFormat(value.salary)}</Text>
        </View>
    )
}

const salaryListStyles = (themeStyles: themeStylesType) => StyleSheet.create({
    salaryRow: {
        alignItems: 'center',
        borderStyle: 'dashed',
        borderColor: themeStyles.border,
        borderBottomWidth: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    salaryText: {
        fontSize: 16,
        color: themeStyles.color,
    },
});

export default DefaultInfo;