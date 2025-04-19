import { Modal, View, Text, Pressable, StyleSheet } from "react-native";

import Octicons from '@expo/vector-icons/Octicons';

import useTranslate from "@/hooks/useTranslate";
import useTheme from '@/hooks/useTheme';
import { themeStylesType } from "@/constants/types";

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

    return (
        <Modal animationType="slide" transparent={true} visible={confirmOpen}>
            <View style={styles.container}>
                <View style={styles.closeIcon}>
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
    },
    closeIcon: {
        position: 'absolute',
        right: 15,
        top: 10,
        zIndex: 2
    },
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