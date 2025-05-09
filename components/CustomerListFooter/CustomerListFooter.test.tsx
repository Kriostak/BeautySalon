import { render, screen, userEvent, waitFor } from '@testing-library/react-native';

import StoreProvider, { initialValues } from '@/context/StoreContext';

import CustomerListFooter from '@/components/CustomerListFooter/CustomerListFooter';

jest.mock('@expo/vector-icons/Octicons');
jest.mock('expo-font');

const setShowOnlyDayFn = jest.fn();
const callbackFn = jest.fn();

const CustomerListFooterComponent = ({ callback }: {
    callback?: (args: unknown) => void,
}) => {
    return (
        <StoreProvider testProps={{ callback }}>
            <CustomerListFooter showOnlyDay={false} setShowOnlyDay={setShowOnlyDayFn} />
        </StoreProvider>
    );
}

describe('CustomerListFooter - unit tests', () => {
    afterAll(() => {
        jest.restoreAllMocks();
    });

    test('Default render', async () => {
        await waitFor(() => {
            render(<CustomerListFooterComponent callback={callbackFn} />);
        });

        const footer = await screen.findByTestId('customerListFooter');
        const switchLocalizationButton = await screen.findByTestId('switchLocalizationButton');
        const switchThemeButton = await screen.findByTestId('switchThemeButton');
        const showOnlyDayButton = await screen.findByTestId('showOnlyDayButton');

        expect(footer).toBeOnTheScreen();
        expect(switchLocalizationButton).toBeOnTheScreen();
        expect(switchThemeButton).toBeOnTheScreen();
        expect(showOnlyDayButton).toBeOnTheScreen();

        await userEvent.press(switchLocalizationButton);

        expect(callbackFn).toHaveBeenCalledWith({ type: 'switchLocalization' });

        jest.resetAllMocks();

        await userEvent.press(switchThemeButton);

        expect(callbackFn).toHaveBeenCalledWith({ type: 'switchTheme' });

        jest.resetAllMocks();

        await userEvent.press(showOnlyDayButton);

        expect(setShowOnlyDayFn).toHaveBeenCalledWith(true);
    });

});