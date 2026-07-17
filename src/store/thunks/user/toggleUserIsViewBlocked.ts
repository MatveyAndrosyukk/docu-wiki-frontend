import {createAsyncThunk} from "@reduxjs/toolkit";
import {User} from "../../slices/userSlice";
import {apiFetch} from "../../../shared/lib/services/apiFetch";

export const toggleUserIsViewBlocked = createAsyncThunk<
    User,
    string
>(
    'user/toggleUserIsViewBlocked',
    async (
        email
    ) => {

        const response = await apiFetch(
            `/users/isViewBlocked?email=${email}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {

            const errorData = await response.json();

            throw new Error(
                errorData.message ||
                JSON.stringify(
                    errorData
                )
            );
        }

        return await response.json();
    }
)