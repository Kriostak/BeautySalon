import { useRef } from 'react';
import { View, TextInput, Pressable, StyleSheet, FlatList } from "react-native";
import Octicons from '@expo/vector-icons/Octicons';

import useTranslate from '@/hooks/useTranslate';
import useTheme from '@/hooks/useTheme';

import { customerType, themeStylesType, creamValType } from '@/constants/types';

type Props = {
    formElements: customerType,
    setFormElements: (updateFn: (prevState: customerType) => customerType) => void,
    creamValue: creamValType,
    setCreamValue: (updateFn: (prevState: creamValType) => creamValType) => void,
    isValid: boolean,
};

const CreamFields = ({ formElements, setFormElements, creamValue, setCreamValue, isValid }: Props): React.ReactElement => {
    const { t } = useTranslate();
    const { themeStyles } = useTheme();

    const refCreamName = useRef<TextInput>(null);

    const styles = formStyles(themeStyles);

    return (
        <View style={{ paddingBottom: 10 }}>
            <View style={[styles.creamField]}>
                <Pressable onPress={() => {
                    if (creamValue.name.trim() !== '' && creamValue.price !== 0) {
                        setFormElements((old: customerType) => {
                            const newCreamData = [...old.creamSells];
                            newCreamData.push({
                                name: creamValue.name.trim(),
                                price: creamValue.price,
                            })

                            return {
                                ...old,
                                creamSells: newCreamData,
                            }
                        });
                        setCreamValue(() => ({
                            name: '',
                            price: 0
                        }));
                        refCreamName.current?.focus();
                    }
                }}>
                    <Octicons name='plus' size={24} style={styles.button} />
                </Pressable>
                <TextInput
                    inputMode='text'
                    placeholder={t('Cream Name')}
                    placeholderTextColor={themeStyles.color}
                    value={creamValue.name}
                    onChangeText={(val) => {
                        setCreamValue(old => ({
                            ...old,
                            name: val
                        }))
                    }}
                    style={[styles.textInput, {
                        flex: 1,
                        maxWidth: '50%',
                        borderColor: !isValid && creamValue.name.trim().length > 3 ? 'rgba(255, 0, 0, .5)' : themeStyles.border
                    }]}

                    ref={refCreamName}
                />
                <TextInput
                    inputMode='decimal'
                    placeholder={t('Cream Price')}
                    placeholderTextColor={themeStyles.color}
                    value={creamValue.price === 0 ? '' : String(creamValue.price)}
                    onChangeText={(val) => {
                        setCreamValue(old => ({
                            ...old,
                            price: Number(val)
                        }))
                    }}
                    style={[styles.textInput, {
                        flex: 1,
                        maxWidth: '35%',
                        borderColor: !isValid && creamValue.price > 0 ? 'rgba(255, 0, 0, .5)' : themeStyles.border
                    }]}
                />
            </View>
            <FlatList
                data={formElements.creamSells}
                renderItem={({ item: creamItem, index }) => {
                    return (
                        <View style={[styles.creamField]} key={index}>
                            <Pressable onPress={() => {
                                setFormElements(old => {
                                    const newCreamData = old.creamSells.toSpliced(index, 1);

                                    return {
                                        ...old,
                                        creamSells: newCreamData,
                                    }
                                });
                            }}>
                                <Octicons name='dash' size={24} style={styles.button} />
                            </Pressable>
                            <TextInput
                                inputMode='text'
                                placeholder={t('Cream Name')}
                                placeholderTextColor={themeStyles.color}
                                value={creamItem.name}
                                onChangeText={(val) => {
                                    setFormElements(old => {
                                        const newCreamSells = [...old.creamSells];
                                        newCreamSells[index].name = val;
                                        return {
                                            ...old,
                                            creamSells: newCreamSells,
                                        }
                                    })
                                }}
                                style={[styles.textInput, { flex: 1, maxWidth: '50%' }]}
                            />
                            <TextInput
                                inputMode='decimal'
                                placeholder={t('Cream Price')}
                                placeholderTextColor={themeStyles.color}
                                value={creamItem.price === 0 ? '' : String(creamItem.price)}
                                onChangeText={(val) => {
                                    setFormElements(old => {
                                        const newCreamSells = [...old.creamSells];
                                        newCreamSells[index].price = Number(val);
                                        return {
                                            ...old,
                                            creamSells: newCreamSells,
                                        }
                                    })
                                }}
                                style={[styles.textInput, { flex: 1, maxWidth: '35%' }]}
                            />
                        </View>
                    )
                }}
                style={{ maxHeight: 280 }}
            />
        </View>
    );
};

const formStyles = (themeStyles: themeStylesType) => StyleSheet.create({
    creamField: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    button: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: themeStyles.border,
        color: themeStyles.color,
        paddingTop: 4,
        paddingLeft: 7,
        paddingRight: 6,
        paddingBottom: 3,
    },
    textInput: {
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: themeStyles.border,
        color: themeStyles.color,
    },
});

export default CreamFields;