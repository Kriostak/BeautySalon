import { useContext, useState } from 'react';
import { render, screen, userEvent, waitFor } from '@testing-library/react-native';

import StoreProvider, { initialValues, StoreContext } from '@/context/StoreContext';
import { monthsList, shortWeekDaysList } from '@/constants/constants';
import localizationData, { localizationType } from '@/constants/localizationData';
import { getCurrentMonthDaysCount } from '@/utils/utils';

import Calendar from '../Calendar';

const testYear = 2025;
const testMonth = 3;
const testDate = 24;

jest.mock('@expo/vector-icons/Octicons');
jest.mock('expo-font');

jest.mock('@/actions/actions', () => ({
    getStoreCustomersList: (
        { selectedYear, selectedMonth }: { selectedYear: string; selectedMonth: string; }
    ): Promise<Array<{ day: number }>> => {
        return new Promise((response) => response(
            selectedYear === String(testYear) && selectedMonth === 'April'
                ? [{ day: 22 }, { day: 24 }, { day: 26 }]
                : []
        ));
    }
}));

const CalendarComponent = ({ customInitialValues, callback, customIsOpen }: {
    customInitialValues?: Partial<typeof initialValues>,
    customIsOpen?: boolean,
    callback?: (args: unknown) => void,
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(customIsOpen ?? true);

    const testInitialValues = {
        ...initialValues,
        ...{
            selectedYear: String(testYear),
            selectedMonth: monthsList[testMonth],
            selectedDate: testDate,
        },
        ...customInitialValues
    }

    return (
        <StoreProvider testProps={{ initialValues: testInitialValues, callback }}>
            <Calendar calendarOpen={isOpen} setCalendarOpen={setIsOpen} />
        </StoreProvider>
    );
}

const calendarRender = async ({ expectedYear, expectedMonth, lang }
    : {
        expectedYear: number,
        expectedMonth: number,
        lang?: 'UA' | 'EN'
    }) => {
    expect(await screen.findByText(String(expectedYear))).toBeOnTheScreen();
    expect(await screen.findByText(localizationData[lang ?? 'UA'][monthsList[expectedMonth]])).toBeOnTheScreen();

    getCurrentMonthDaysCount(expectedYear, expectedMonth).forEach(async (indx) => {
        const dayNumber = indx + 1;
        expect(await screen.findByText(`${dayNumber}`)).toBeOnTheScreen();
    });
};

describe('Calendar - unit test', () => {
    afterAll(() => {
        jest.restoreAllMocks();
    });

    test('UA localization', async () => {
        await waitFor(() => {
            render(<CalendarComponent />);
        });

        expect(await screen.findByText('Квітень')).toBeOnTheScreen();

        shortWeekDaysList.forEach(async (weekDay: Partial<keyof localizationType>) => {
            expect(await screen.findByText(localizationData['UA'][weekDay])).toBeOnTheScreen();
        });
    });

    test('EN localization', async () => {
        await waitFor(() => {
            render(<CalendarComponent customInitialValues={{ lang: 'EN' }} />);
        });

        expect(await screen.findByText('April')).toBeOnTheScreen();

        shortWeekDaysList.forEach(async (weekDay: Partial<keyof localizationType>) => {
            expect(await screen.findByText(localizationData['EN'][weekDay])).toBeOnTheScreen();
        });
    });

    test('Change year and month', async () => {
        await waitFor(() => {
            render(<CalendarComponent customInitialValues={{ lang: 'EN' }} />);
        });

        // default render
        await calendarRender({ expectedYear: testYear, expectedMonth: testMonth, lang: 'EN' });

        expect(await screen.findByTestId(`day-${testDate}`)).toHaveStyle({ backgroundColor: 'rgb(1, 123, 223)' });
        expect(await screen.findByTestId(`day-22`)).toHaveStyle({ backgroundColor: 'rgb(0, 219, 110)' });
        expect(await screen.findByTestId(`day-26`)).toHaveStyle({ backgroundColor: 'rgb(0, 219, 110)' });

        // change year
        await userEvent.press(await screen.findByTestId('setPrevYear'));

        await calendarRender({ expectedYear: testYear - 1, expectedMonth: testMonth, lang: 'EN' });

        expect(await screen.findByTestId(`day-${testDate}`)).not.toHaveStyle({ backgroundColor: 'rgb(1, 123, 223)' });
        expect(await screen.findByTestId(`day-22`)).not.toHaveStyle({ backgroundColor: 'rgb(0, 219, 110)' });
        expect(await screen.findByTestId(`day-26`)).not.toHaveStyle({ backgroundColor: 'rgb(0, 219, 110)' });

        // change month
        await userEvent.press(await screen.findByTestId('setNextMonth'));

        await calendarRender({ expectedYear: testYear - 1, expectedMonth: testMonth + 1, lang: 'EN' });

        expect(await screen.findByTestId(`day-${testDate}`)).not.toHaveStyle({ backgroundColor: 'rgb(1, 123, 223)' });
        expect(await screen.findByTestId(`day-22`)).not.toHaveStyle({ backgroundColor: 'rgb(0, 219, 110)' });
        expect(await screen.findByTestId(`day-26`)).not.toHaveStyle({ backgroundColor: 'rgb(0, 219, 110)' });

        // return to default state
        await userEvent.press(await screen.findByTestId('setPrevMonth'));
        await userEvent.press(await screen.findByTestId('setNextYear'));

        await calendarRender({ expectedYear: testYear, expectedMonth: testMonth, lang: 'EN' });

        expect(await screen.findByTestId(`day-${testDate}`)).toHaveStyle({ backgroundColor: 'rgb(1, 123, 223)' });
        expect(await screen.findByTestId(`day-22`)).toHaveStyle({ backgroundColor: 'rgb(0, 219, 110)' });
        expect(await screen.findByTestId(`day-26`)).toHaveStyle({ backgroundColor: 'rgb(0, 219, 110)' });
    });


    test('Date select', async () => {
        const callbackFn = jest.fn();

        await waitFor(() => {
            render(<CalendarComponent callback={callbackFn} />);
        });

        await userEvent.press(await screen.findByTestId('day-23'));

        expect(callbackFn).toHaveBeenCalledWith({
            type: 'mutate',
            payload: {
                selectedYear: '2025',
                selectedMonth: 'April',
                selectedDate: 23
            }
        });
    })
})