import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {fetchViewedUserByEmail} from "../thunks/user/fetchViewedUserByEmail";
import {addUserWhoCanEdit} from "../thunks/user/addUserWhoCanEdit";
import {deleteUserWhoCanEdit} from "../thunks/user/deleteUserWhoCanEdit";
import {changeUserName} from "../thunks/user/changeUserName";
import {toggleUserIsViewBlocked} from "../thunks/user/toggleUserIsViewBlocked";
import {fetchLoggedInUserByEmail} from "../thunks/user/fetchLoggedInUserByEmail";

export interface Role {
    id: number,
    value: string,
    description: string,
}

export interface User {
    id: number | null,
    email: string,
    name: string,
    banned: boolean,
    banReason: boolean,
    bannedAt: Date,
    roles: Role[],
    whoCanEdit: User[],
    isPremium: boolean,
    isViewBlocked: boolean,
    amountOfFiles: number,
}

interface UserState {
    viewedUser: User | null;
    loggedInUser: User | null;
    isViewedUserLoading: boolean;
}

const initialState: UserState = {
    viewedUser: null,
    loggedInUser: null,
    isViewedUserLoading: false,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearViewedUser(state) {
            state.viewedUser = null;
        },
        clearLoggedInUser(state) {
            state.loggedInUser = null;
        },
        updateUserFilesCount: (
            state,
            action: PayloadAction<{ email: string; delta: number }>
        ) => {
            if (!state.viewedUser) return;
            if (state.viewedUser.email !== action.payload.email) return;

            state.viewedUser.amountOfFiles += action.payload.delta;

            if (state.viewedUser.amountOfFiles < 0) {
                state.viewedUser.amountOfFiles = 0;
            }
        },
        updateUserFilesBlock: (
            state,
            action: PayloadAction<{ email: string;}>
        ) => {
            if (!state.viewedUser) return;
            if (state.viewedUser.email !== action.payload.email) return;

            const prev = state.viewedUser.isViewBlocked;

            state.viewedUser.isViewBlocked = !prev;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchViewedUserByEmail.pending, (state) => {
                state.isViewedUserLoading = true;
            })
            .addCase(fetchViewedUserByEmail.fulfilled, (state, action) => {
                state.isViewedUserLoading = false;
                state.viewedUser = action.payload;
            })
            .addCase(fetchViewedUserByEmail.rejected, (state) => {
                state.isViewedUserLoading = false;
                state.viewedUser = null;
            })
            .addCase(fetchLoggedInUserByEmail.fulfilled, (state, action) => {
                state.loggedInUser = action.payload;
            })
            .addCase(fetchLoggedInUserByEmail.rejected, (state) => {
                state.loggedInUser = null;
            })
            .addCase(addUserWhoCanEdit.fulfilled, (state, action) => {
                state.loggedInUser = action.payload;
            })
            .addCase(deleteUserWhoCanEdit.fulfilled, (state, action) => {
                state.loggedInUser = action.payload
            })
            .addCase(changeUserName.fulfilled, (state, action) => {
                state.loggedInUser = action.payload;
            })
            .addCase(toggleUserIsViewBlocked.pending, (state, action) => {
                if (!state.viewedUser) return;
                if (state.viewedUser.email !== action.meta.arg) return;

                state.viewedUser.isViewBlocked = !state.viewedUser.isViewBlocked;
            })
            .addCase(toggleUserIsViewBlocked.rejected, (state, action) => {
                if (!state.viewedUser) return;
                if (state.viewedUser.email !== action.meta.arg) return;

                state.viewedUser.isViewBlocked = !state.viewedUser.isViewBlocked;
            })
    }
})

export const {
    clearViewedUser,
    clearLoggedInUser,
    updateUserFilesCount
} = userSlice.actions;

export default userSlice.reducer;