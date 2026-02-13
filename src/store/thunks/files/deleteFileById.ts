import {createAsyncThunk} from "@reduxjs/toolkit";
import API_BASE_URL from "../../../config/api-config";
import {removeFileOptimistic, restoreFile} from "../../slices/fileServerSlice";
import {mapUiFileToServerFile} from "../../mappers/mapUiFileToServerFile";
import {AppDispatch, RootState} from "../../index";
import {UiFile} from "../../types/UiFile";

interface DeleteFilePayload {
    file: UiFile;
    email: string | undefined;
}

export const deleteFileById = createAsyncThunk<
    number,
    DeleteFilePayload,
    { dispatch: AppDispatch; state: RootState }
>(
    'fileTree/deleteFileById',
    async ({file, email}, {dispatch}) => {
        const token = localStorage.getItem('token');

        dispatch(removeFileOptimistic(file.id));

        try {
            const response = await fetch(`${API_BASE_URL}/files`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({id: file.id, email}),
            });

            if (!response.ok) throw new Error('Failed to delete file on server');

            return await response.json();
        } catch (error) {
            dispatch(restoreFile(mapUiFileToServerFile(file)));
            throw error;
        }
    }
);