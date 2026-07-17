import {createAsyncThunk} from "@reduxjs/toolkit";
import {User} from "../../slices/userSlice";
import {apiFetch} from "../../../shared/lib/services/apiFetch";

export interface UserNamePayload {
    email: string;

    name: string;
}

export const changeUserName = createAsyncThunk<
    User,
    UserNamePayload
>(
    'user/changeUserName',
    async (
        body
    ) => {

        const response = await apiFetch(
            `/users/name`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    body
                ),
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