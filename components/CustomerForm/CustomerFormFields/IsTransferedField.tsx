import { View, TextInput, Text, Pressable, StyleSheet } from "react-native";
import Checkbox from 'expo-checkbox';

import useTranslate from '@/hooks/useTranslate';
import useTheme from '@/hooks/useTheme';
import { customerType, themeStylesType } from "@/constants/types";

type Props = {
    formElements: customerType,
    setFormElements: (updateFn: (prevState: customerType) => customerType) => void,
    toggleCheckbox: (toggleArg: { val: boolean, key: string, isNewToggle?: boolean }) => void,
};

const IsTransferredField = ({ formElements, setFormElements, toggleCheckbox }: Props): React.ReactElement => {
    const { t } = useTranslate();
    const { themeStyles } = useTheme();

    const styles = formStyles(themeStyles);

    return (
        <View style={styles.formItem}>
            <Pressable onPress={() => {
                toggleCheckbox({ val: !formElements.isTransferred, key: 'isTransferred' });
            }}>
                <View style={styles.checkboxWrapper}>
                    <Checkbox
                        style={{ borderColor: themeStyles.border }}
                        value={formElements.isTransferred}
                        onValueChange={(val) => {
                            toggleCheckbox({ val, key: 'isTransferred' });
                        }}
                    />
                    <Text style={styles.checkboxText}>{t('Is Transferred')}</Text>
                </View>
            </Pressable>
            {formElements.isTransferred && <TextInput
                multiline
                numberOfLines={4}
                maxLength={255}
                onChangeText={(val) => setFormElements(old => ({
                    ...old,
                    transferredComment: val
                }))}
                value={formElements.transferredComment}
                style={styles.textInput}
            />}
        </View>
    )
}

const formStyles = (themeStyles: themeStylesType) => StyleSheet.create({
    formItem: {
        paddingVertical: 15
    },
    textInput: {
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: themeStyles.border,
        color: themeStyles.color,
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

export default IsTransferredField;