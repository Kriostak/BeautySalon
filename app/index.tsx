
import { useEffect, useState, useContext } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


import { getStoreCustomersList } from "@/actions/actions";
import { customerType, customersSectionType } from "@/constants/types";

import { setStoreData } from "@/actions/AsyncStorage";

import CustomerListHeader from "@/components/CustomerListHeader";
import CustomersList from "@/components/CustomersList";
import CustomerListFooter from "@/components/CustomerListFooter";
import CustomerForm from "@/components/CustomerForm";
import Calendar from "@/components/Calendar";
import { getSalary } from "@/utils/utils";
import SalaryList from "@/components/SalaryList";
import { StoreContext } from "@/context/StoreContext";


export default function Index() {
  const { selectedYear, selectedMonth, customersList, dispatch } = useContext(StoreContext);

  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const [showOnlyDay, setShowOnlyDay] = useState<boolean>(true);
  const [salaryListOpen, setSalaryListOpen] = useState<boolean>(false);

  useEffect(() => {
    getStoreCustomersList({ selectedYear, selectedMonth }).then(customersListResponse => {
      dispatch({ type: 'mutate', payload: { customersList: customersListResponse } });
    });
  }, [selectedYear, selectedMonth]);

  const totalMhSum = customersList?.reduce((partialSum, section) => partialSum + section.mhSum, 0);
  const totalLSum = customersList?.reduce((partialSum, section) => partialSum + section.lSum, 0);

  const salaryObject = getSalary({
    customersList: customersList ?? [],
    totalMhSum: totalMhSum ?? 0,
    totalLSum: totalLSum ?? 0
  });

  const setStoreCustomersList = (newCustomersList: customersSectionType[]) => {
    setStoreData({ dataKey: `${selectedYear}:${selectedMonth}`, dataValue: newCustomersList })
  }

  return (
    <SafeAreaView style={styles.wrapper}>

      <CustomerListHeader
        setCalendarOpen={setCalendarOpen}
        setSalaryListOpen={setSalaryListOpen}
        setFormOpen={setFormOpen}
      />

      <CustomersList
        setFormOpen={setFormOpen}
        setStoreCustomersList={setStoreCustomersList}
        showOnlyDay={showOnlyDay}
      />

      <CustomerForm
        formOpen={formOpen}
        setFormOpen={setFormOpen}
        setStoreCustomersList={setStoreCustomersList}
      />

      <Calendar
        calendarOpen={calendarOpen}
        setCalendarOpen={setCalendarOpen}
      />

      <SalaryList
        salaryObject={salaryObject}
        salaryListOpen={salaryListOpen}
        setSalaryListOpen={setSalaryListOpen}
      />

      <CustomerListFooter
        showOnlyDay={showOnlyDay}
        setShowOnlyDay={setShowOnlyDay}
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