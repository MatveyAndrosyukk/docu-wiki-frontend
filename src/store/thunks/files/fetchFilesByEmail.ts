import {createAsyncThunk} from "@reduxjs/toolkit";
import API_BASE_URL from "../../../config/api-config";
import {File} from "../../../types/file";

interface GetFilesForUserDto{
    viewedUserEmail: string;
    loggedInUserEmail?: string | null;
}

export const fetchFilesByEmail = createAsyncThunk<
    File[],
    GetFilesForUserDto>(
    'fileTree/fetchFilesByEmail',
    async (dto: GetFilesForUserDto) => {
        const token = localStorage.getItem('token');

        const params = new URLSearchParams({
            viewedUserEmail: dto.viewedUserEmail,
            ...(dto.loggedInUserEmail && { loggedInUserEmail: dto.loggedInUserEmail })
        });

        const response = await fetch(
            `${API_BASE_URL}/files?${params}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );
        if (!response.ok) {
            throw new Error('Failed to fetch files');
        }
        return await response.json();
    }
)