import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
    visible: boolean;
    message: string;
}

const initialState: NotificationState = {
    visible: false,
    message: '',
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        showNotification: (
            state,
            action: PayloadAction<string>
        ) => {
            state.visible = true;
            state.message = action.payload;
        },

        hideNotification: (state) => {
            state.visible = false;
            state.message = '';
        },
    },
});

export const {
    showNotification,
    hideNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;