import { View, Text, Pressable, StyleSheet } from "react-native";
import Checkbox from 'expo-checkbox';

import useTranslate from '@/hooks/useTranslate';
import useTheme from '@/hooks/useTheme';
import { customerType, themeStylesType } from "@/constants/types";

type Props = {
    formElements: customerType,
    toggleCheckbox: (toggleArg: { val: boolean, key: string, isNewToggle?: boolean }) => void,
}

const IsNewCheckboxes = ({
    formElements,
    toggleCheckbox,
}: Props): React.ReactElement => {
    const { t } = useTranslate();
    const { themeStyles } = useTheme();

    const styles = formStyles(themeStyles);

    return (
        <View style={[styles.formItem, {
            flexDirection: 'row',
            justifyContent: 'space-between',
        }]}>
            <Pressable onPress={() => {
                toggleCheckbox({ val: !formElements.isNew, key: 'isNew', isNewToggle: true });
            }}>
                <View style={styles.checkboxWrapper}>
                    <Checkbox
                        style={{ borderColor: themeStyles.border }}
                        value={formElements.isNew}
                        onValueChange={(val) => {
                            toggleCheckbox({ val, key: 'isNew', isNewToggle: true });
                        }}
                    />
                    <Text style={styles.checkboxText}>{t('Is New')}</Text>
                </View>
            </Pressable>

            <Pressable onPress={() => {
                formElements.isNew && toggleCheckbox({ val: !formElements.isClosed, key: 'isClosed' });
            }}>
                <View style={styles.checkboxWrapper}>
                    <Checkbox
                        style={{
                            borderColor: themeStyles.border,
                            opacity: !formElements.isNew ? .5 : 1
                        }}
                        value={formElements.isClosed}
                        onValueChange={(val) => {
                            toggleCheckbox({ val, key: 'isClosed' });
                        }}
                        disabled={!formElements.isNew}
                    />
                    <Text style={[styles.checkboxText, { opacity: formElements.isNew ? 1 : .5 }]}>{t('Is Closed')}</Text>
                </View>
            </Pressable>
        </View>
    );
}

const formStyles = (themeStyles: themeStylesType) => StyleSheet.create({
    formItem: {
        paddingVertical: 15
    },
    checkboxWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    checkboxText: {
        paddingLeft: 5,
        color: themeStyles.color
    },
});

export default IsNewCheckboxes;