import { getStoreData } from "@/actions/AsyncStorage";

import { customersSectionType } from '@/constants/types';

export const getStoreCustomersList = async (
    { selectedYear, selectedMonth }: { selectedYear: string; selectedMonth: string; }
): Promise<customersSectionType[] | null> => {
    return await getStoreData(`${selectedYear}:${selectedMonth}`) as (customersSectionType[] | null);
}