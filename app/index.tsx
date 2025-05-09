
import { useEffect, useState, useContext } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


import { getStoreCustomersList } from "@/actions/actions";
import { customersSectionType } from "@/constants/types";

import { setStoreData } from "@/actions/AsyncStorage";

import CustomerListHeader from "@/components/CustomerListHeader/CustomerListHeader";
import CustomersList from "@/components/CustomersList/CustomersList";
import CustomerListFooter from "@/components/CustomerListFooter/CustomerListFooter";
import CustomerForm from "@/components/CustomerForm/CustomerForm";

import { StoreContext } from "@/context/StoreContext";


export default function Index() {
  const { selectedYear, selectedMonth, customersList, dispatch } = useContext(StoreContext);

  const [formOpen, setFormOpen] = useState<boolean>(false);

  const [showOnlyDay, setShowOnlyDay] = useState<boolean>(true);


  useEffect(() => {
    getStoreCustomersList({ selectedYear, selectedMonth }).then(customersListResponse => {
      dispatch({ type: 'mutate', payload: { customersList: customersListResponse } });
    });
  }, [selectedYear, selectedMonth]);

  const setStoreCustomersList = (newCustomersList: customersSectionType[]) => {
    setStoreData({ dataKey: `${selectedYear}:${selectedMonth}`, dataValue: newCustomersList })
  }

  return (
    <SafeAreaView style={styles.wrapper}>

      <CustomerListHeader
        setFormOpen={setFormOpen}
      />

      <CustomersList
        setFormOpen={setFormOpen}
        setStoreCustomersList={setStoreCustomersList}
        showOnlyDay={showOnlyDay}
      />

      <CustomerListFooter
        showOnlyDay={showOnlyDay}
        setShowOnlyDay={setShowOnlyDay}
      />

      <CustomerForm
        formOpen={formOpen}
        setFormOpen={setFormOpen}
        setStoreCustomersList={setStoreCustomersList}
      />
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 1024,
    marginHorizontal: 'auto',
  },
});