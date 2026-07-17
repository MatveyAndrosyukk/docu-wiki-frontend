import {createAsyncThunk} from "@reduxjs/toolkit";
import {ServerFile} from "../../types/ServerFile";
import API_BASE_URL from "../../../shared/assets/config/api-config";

interface GetFilesForUserDto {
    viewedUserEmail: string;

    loggedInUserEmail?: string | null;
}

export const fetchFilesByEmail = createAsyncThunk<
    ServerFile[],
    GetFilesForUserDto
>(
    'fileTree/fetchFilesByEmail',
    async (
        dto: GetFilesForUserDto
    ) => {

        const params = new URLSearchParams(
            {
                viewedUserEmail: dto.viewedUserEmail,
                ...(dto.loggedInUserEmail &&
                    {
                        loggedInUserEmail: dto.loggedInUserEmail
                    }
                )
            }
        );

        const response = await fetch(
            `${API_BASE_URL}/files?${params}`,
            {
                method: 'GET',
            }
        );

        if (!response.ok) {

            throw new Error(
                'Failed to fetch files'
            );
        }

        return await response.json();
    }
)