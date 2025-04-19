import AsyncStorage from '@react-native-async-storage/async-storage';

import { asyncStoreType } from '@/constants/types';

// get data from local storage
export const getStoreData = async (dataKey: string): Promise<unknown | null> => {
    let data = null;

    try {
        const dataValue = await AsyncStorage.getItem(dataKey);
        data = dataValue !== null ? JSON.parse(dataValue) : null;
    } catch (e) {
        console.error('Error during local storage get method: ', e);
    };

    return data;
};

// set data to local storage
export const setStoreData = async (
    { dataKey, dataValue }: asyncStoreType
): Promise<void> => {
    try {
        const jsonValue = JSON.stringify(dataValue);
        await AsyncStorage.setItem(dataKey, jsonValue);
    } catch (error) {
        console.error('Error during local storage set method: ', error);
    };
};

export const mergeStoreData = async (
    { dataKey, dataValue }: asyncStoreType
) => {
    try {
        const jsonValue = JSON.stringify(dataValue);
        await AsyncStorage.mergeItem(dataKey, jsonValue);
    } catch (error) {
        console.error('Error during local storage set method: ', error);
    };
}

export const deleteStoreData = async (dataKey: string) => {
    try {
        await AsyncStorage.removeItem(dataKey);
    } catch (error) {
        console.error('Error during local storage remove method: ', error);
    };
}
