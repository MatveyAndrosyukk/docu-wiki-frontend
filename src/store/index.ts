import {configureStore} from "@reduxjs/toolkit";
import fileServerReducer from './slices/fileServerSlice';
import fileUiReducer from './slices/fileUiSlice';
import userReducer from "./slices/userSlice";
import notificationReducer from "./slices/notificationSlice";

export const store = configureStore({
    reducer: {
        fileServer: fileServerReducer,
        fileUi: fileUiReducer,
        user: userReducer,
        notification: notificationReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;