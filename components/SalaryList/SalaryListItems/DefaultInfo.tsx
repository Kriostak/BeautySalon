import { View, StyleSheet, Text } from "react-native";

import { themeStylesType } from "@/constants/types";
import useTheme from "@/hooks/useTheme";

type Props = {
    label: string,
    last?: boolean,
    children: React.ReactElement,
};

const DefaultInfo = ({ label, last, children }: Props) => {
    const { themeStyles } = useTheme();
    const styles = salaryListStyles(themeStyles);

    return (
        <View style={[styles.salaryRow, { borderBottomWidth: last ? 0 : 1 }]}>
            <Text style={[styles.salaryText, { fontWeight: last ? 600 : 400 }]}>
                {label}
            </Text>
            {children}
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
    salaryText: {
        fontSize: 16,
        color: themeStyles.color,
    },
});

export default DefaultInfo;