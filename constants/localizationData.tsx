
const UA: any = {
    Salary: 'Зарплатня',
    Mh: 'Мш',
    L: 'Л',
    January: "Січень",
    February: "Лютий",
    March: "Березень",
    April: "Квітень",
    May: "Травень",
    June: "Червень",
    July: "Липень",
    August: "Серпень",
    September: "Вересень",
    October: "Жовтень",
    November: "Листопад",
    December: "Грудень",
    Sunday: 'Неділя',
    Monday: 'Понеділок',
    Tuesday: 'Вівторок',
    Wednesday: 'Середа',
    Thursday: 'Четвер',
    Friday: 'Пятниця',
    Saturday: 'Субота',
    Sun: 'Нед',
    Mon: 'Пон',
    Tue: 'Вів',
    Wed: 'Сер',
    Thu: 'Чет',
    Fri: 'Пят',
    Sat: 'Суб',
    EditCustomer: 'Редагувати Клієнта',
    AddCustomer: 'Додати Клієнта',
    CustomerName: 'Ім\'я Клієнта',
    Price: 'Ціна',
    Multishape: 'Мультішейп',
    Laser: 'Лазер',
    IsNew: 'Новий',
    IsClosed: 'Закрився',
    SubmitForm: 'Відправити Форму',
    PleaseAddCustomer: 'Будь ласка, додайте клієнта.',
    PleaseAddCustomerFor: (
        { selectedDate, selectedMonth }:
            { selectedDate: number, selectedMonth: keyof typeof UA }
    ): string => (`Будь ласка, додайте клієнта на ${UA[selectedMonth]} ${selectedDate}.`)
};

const EN: any = {
    Salary: 'Salary',
    Mh: 'Mh',
    L: 'L',
    January: "January",
    February: "February",
    March: "March",
    April: "April",
    May: "May",
    June: "June",
    July: "July",
    August: "August",
    September: "September",
    October: "October",
    November: "November",
    December: "December",
    Sunday: 'Sunday',
    Monday: 'Monday',
    Tuesday: 'Tuesday',
    Wednesday: 'Wednesday',
    Thursday: 'Thursday',
    Friday: 'Friday',
    Saturday: 'Saturday',
    Sun: 'Sun',
    Mon: 'Mon',
    Tue: 'Tue',
    Wed: 'Wed',
    Thu: 'Thu',
    Fri: 'Fri',
    Sat: 'Sat',
    EditCustomer: 'Edit Customer',
    AddCustomer: 'Add Customer',
    CustomerName: 'Customer Name',
    Price: 'Price',
    Multishape: 'Multishape',
    Laser: 'Laser',
    IsNew: 'Is New',
    IsClosed: 'Is Closed',
    SubmitForm: 'Submit Form',
    PleaseAddCustomer: 'Please, add customer.',
    PleaseAddCustomerFor: (
        { selectedDate, selectedMonth }:
            { selectedDate: number, selectedMonth: keyof typeof EN }
    ): string => (`Please, add customer for ${selectedDate} of ${EN[selectedMonth]}.`)
}

const localizationData = {
    UA, EN
}

export default localizationData;