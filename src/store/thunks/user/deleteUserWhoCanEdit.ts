import {createAsyncThunk} from "@reduxjs/toolkit";
import {User} from "../../slices/userSlice";
import {UserWhoCanEditPayload} from "./addUserWhoCanEdit";
import API_BASE_URL from "../../../shared/assets/config/api-config";

export const deleteUserWhoCanEdit = createAsyncThunk<User, UserWhoCanEditPayload>(
    'user/deleteUserWhoCanEdit',
    async (body) => {
        const token = localStorage.getItem('token');

        const response = await fetch(
            `${API_BASE_URL}/users/whoCanEdit`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            }
        );
        if (!response.ok) {
            throw new Error(`Failed to delete user from editors!`);
        }
        return await response.json();
    }
)