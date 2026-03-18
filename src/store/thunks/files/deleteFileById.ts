import {createAsyncThunk} from "@reduxjs/toolkit";
import {removeFileOptimistic, restoreFile} from "../../slices/fileServerSlice";
import {mapUiFileToServerFile} from "../../mappers/mapUiFileToServerFile";
import {AppDispatch, RootState} from "../../index";
import {UiFile} from "../../types/UiFile";
import {apiFetch} from "../../../shared/lib/services/apiFetch";

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
        dispatch(removeFileOptimistic(file.id));

        try {
            const response = await apiFetch(`/files`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({id: file.id, email}),
            });

            if (!response.ok) {
                throw new Error('Failed to delete file on server');
            }

            return await response.json();
        } catch (error) {
            dispatch(restoreFile(mapUiFileToServerFile(file)));
            throw error;
        }
    }
);