import {configureStore} from "@reduxjs/toolkit";
import fileServerReducer from './slices/fileServerSlice';
import fileUiReducer from './slices/fileUiSlice';
import userReducer from "./slices/userSlice";

export const store = configureStore({
    reducer: {
        fileServer: fileServerReducer,
        fileUi: fileUiReducer,
        user: userReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;