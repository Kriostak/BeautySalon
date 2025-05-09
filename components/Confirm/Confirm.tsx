import { Modal, View, Text, Pressable, StyleSheet } from "react-native";

import Octicons from '@expo/vector-icons/Octicons';

import useTranslate from "@/hooks/useTranslate";
import useTheme from '@/hooks/useTheme';
import { themeStylesType } from "@/constants/types";
import genericStyles from "@/styles/generic.module";

type Props = {
    confirmOpen: boolean;
    setConfirmOpen: (isOpen: boolean) => void;
    confirmText: string;
    confirmCallback: () => void;
}

const Confirm = ({ confirmOpen, setConfirmOpen, confirmText, confirmCallback }: Props) => {
    const { t } = useTranslate();
    const { themeStyles } = useTheme();

    const styles = confirmStyles(themeStyles);
    const appStyles = genericStyles(themeStyles);

    return (
        <Modal animationType="slide" transparent={true} visible={confirmOpen}>
            <View style={appStyles.modal}>
                <View style={appStyles.closeIcon}>
                    <Pressable onPress={() => {
                        setConfirmOpen(false);
                    }}>
                        <Octicons name="x" size={24} style={{ color: themeStyles.color }} />
                    </Pressable>
                </View>

                <Text style={styles.text}>{confirmText}</Text>
                <View style={styles.buttonsContainer}>
                    <Pressable onPress={() => {
                        setConfirmOpen(false);
                    }}>
                        <Text style={[styles.button, { backgroundColor: 'rgba(237,8,0, .75)' }]}>{t('No')}</Text>
                    </Pressable>
                    <Pressable onPress={() => {
                        confirmCallback();
                        setConfirmOpen(false);
                    }}>
                        <Text style={[styles.button, { backgroundColor: 'rgba(51,178,73, .75)' }]}>{t('Yes')}</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

const confirmStyles = (themeStyles: themeStylesType) => StyleSheet.create({
    text: {
        color: themeStyles.color,
        textAlign: 'center',
        fontSize: 18,
        paddingHorizontal: 25
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 25,
        paddingVertical: 10
    },
    button: {
        borderWidth: 1,
        borderRadius: 5,
        width: 60,
        textAlign: 'center',
        paddingVertical: 5,
        fontSize: 16,
        fontWeight: 500,
    }
});

export default Confirm;