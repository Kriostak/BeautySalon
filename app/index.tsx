
import { useEffect, useState, } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


import { getStoreCustomersList } from "@/actions/actions";
import { customerType, customersSectionType } from "@/constants/types";
import { monthsList } from "@/constants/constants";

import { setStoreData } from "@/actions/AsyncStorage";

import CustomerListHeader from "@/components/CustomerListHeader";
import CustomersList from "@/components/CustomersList";
import CustomerListFooter from "@/components/CustomerListFooter";
import CustomerForm from "@/components/CustomerForm";
import Calendar from "@/components/Calendar";
import { getClosedCustomersPercent } from "@/utils/utils";


export default function Index() {
  const [selectedYear, setSelectedYear] = useState<string>(String(new Date().getFullYear()));
  const [selectedMonth, setSelectedMonth] = useState<string>(monthsList[new Date().getMonth()]);
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());
  const [customersList, setCustomersList] = useState<customersSectionType[] | null>();
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [customer, setCustomer] = useState<customerType | undefined>();
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const [showOnlyDay, setShowOnlyDay] = useState<boolean>(true);

  useEffect(() => {
    getStoreCustomersList({ selectedYear, selectedMonth }).then(customersListResponse => {
      setCustomersList(customersListResponse);
    });
  }, [selectedYear, selectedMonth]);

  const totalMhSum = customersList?.reduce((partialSum, section) => partialSum + section.mhSum, 0);
  const totalLSum = customersList?.reduce((partialSum, section) => partialSum + section.lSum, 0);

  const closedCustomersPercent = getClosedCustomersPercent(customersList ?? []);

  const setStoreCustomersList = (newCustomersList: customersSectionType[]) => {
    setStoreData({ dataKey: `${selectedYear}:${selectedMonth}`, dataValue: newCustomersList })
  }

  return (
    <SafeAreaView style={styles.wrapper}>

      <CustomerListHeader
        setCalendarOpen={setCalendarOpen}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        setCustomer={setCustomer}
        setFormOpen={setFormOpen}
        totalMhSum={totalMhSum ?? 0}
        totalLSum={totalLSum ?? 0}
      />

      <CustomersList
        customersList={customersList ?? []}
        setCustomersList={setCustomersList}
        setCustomer={setCustomer}
        setFormOpen={setFormOpen}
        setStoreCustomersList={setStoreCustomersList}
        selectedMonth={selectedMonth}
        selectedDate={selectedDate}
        showOnlyDay={showOnlyDay}
      />

      <CustomerForm
        formOpen={formOpen}
        setFormOpen={setFormOpen}
        customersList={customersList}
        setCustomersList={setCustomersList}
        customer={customer}
        setStoreCustomersList={setStoreCustomersList}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        selectedDate={selectedDate}
      />

      <Calendar
        calendarOpen={calendarOpen}
        setCalendarOpen={setCalendarOpen}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <CustomerListFooter
        showOnlyDay={showOnlyDay}
        setShowOnlyDay={setShowOnlyDay}
        totalMhSum={totalMhSum ?? 0}
        totalLSum={totalLSum ?? 0}
        closedCustomersPercent={closedCustomersPercent}
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