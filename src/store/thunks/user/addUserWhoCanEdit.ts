import {createAsyncThunk} from "@reduxjs/toolkit";
import {User} from "../../slices/userSlice";
import {apiFetch} from "../../../shared/lib/services/apiFetch";

export interface UserWhoCanEditPayload {
    userEmail: string;
    whoCanEditEmail: string;
}

export const addUserWhoCanEdit = createAsyncThunk<User, UserWhoCanEditPayload>(
    'user/addUserWhoCanEdit',
    async (body) => {
        const response = await apiFetch(`/users/whoCanEdit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const errorData = await response.json();

            if (errorData.message.includes('User with email')) {
                throw new Error('User does not exists');
            } else {
                throw new Error(errorData.message || JSON.stringify(errorData));
            }

        }
        return await response.json();
    }
)