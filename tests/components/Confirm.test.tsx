import { render, screen, userEvent, waitFor } from '@testing-library/react-native';

import Confirm from "@/components/Confirm";

jest.mock('@expo/vector-icons/Octicons');
jest.mock('expo-font');

describe('Confirm - unit tests', () => {
    const setConfirmOpenFn = jest.fn();
    const confirmCallbackFn = jest.fn();

    afterAll(() => {
        jest.restoreAllMocks();
    })

    test('Default render', async () => {
        await waitFor(() => {
            render(<Confirm
                confirmOpen={true}
                setConfirmOpen={setConfirmOpenFn}
                confirmText='Confirm Text'
                confirmCallback={confirmCallbackFn}
            />);
        });

        const yesButton = await screen.findByText('Так');
        const noButton = await screen.findByText('Ні');

        expect(yesButton).toBeOnTheScreen();
        expect(noButton).toBeOnTheScreen();
        expect(await screen.findByText('Confirm Text')).toBeOnTheScreen();

        await userEvent.press(yesButton);

        expect(setConfirmOpenFn).toHaveBeenCalledWith(false);
        expect(confirmCallbackFn).toHaveBeenCalled();

        jest.resetAllMocks();

        await userEvent.press(noButton);

        expect(setConfirmOpenFn).toHaveBeenCalledWith(false);
        expect(confirmCallbackFn).not.toHaveBeenCalled();
    });
});