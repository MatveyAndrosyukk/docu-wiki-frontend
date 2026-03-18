import {createAsyncThunk} from "@reduxjs/toolkit";
import {User} from "../../slices/userSlice";
import {UserWhoCanEditPayload} from "./addUserWhoCanEdit";
import {apiFetch} from "../../../shared/lib/services/apiFetch";

export const deleteUserWhoCanEdit = createAsyncThunk<User, UserWhoCanEditPayload>(
    'user/deleteUserWhoCanEdit',
    async (body) => {
        const response = await apiFetch(`/users/whoCanEdit`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`Failed to delete user from editors!`);
        }
        return await response.json();
    }
)