import {createAsyncThunk} from "@reduxjs/toolkit";
import {User} from "../../slices/userSlice";
import {apiFetch} from "../../../shared/lib/services/apiFetch";

export const fetchLoggedInUserByEmail = createAsyncThunk<User, string | null>(
    'user/fetchLoggedInUserByEmail',
    async (
        email: string | null
    ) => {

        const response = await apiFetch(
            `/users/findOne?email=${email}`,
            {
                method: 'GET',
            }
        );

        if (!response.ok) {
            throw new Error(
                'Failed to fetch user'
            );
        }

        return await response.json();
    }
)