import {createAsyncThunk} from "@reduxjs/toolkit";
import API_BASE_URL from "../../../config/api-config";
import {ServerFile} from "../../types/ServerFile";
import {optimisticUpdateFileContent, revertFileContent} from "../../slices/fileServerSlice";
import {findFileById} from "../../utils/fileTreeActionUtils";
import {RootState} from "../../index";
import {setSaving} from "../../slices/fileUiSlice";

interface ChangeFileContentPayload {
    id: number;
    content: string;
    editor: string | undefined;
}

export const updateFileContent = createAsyncThunk<
    ServerFile,
    ChangeFileContentPayload,
    { state: RootState }
>(
    'fileTree/updateFileContent',
    async ({id, content, editor}, {dispatch, getState, rejectWithValue}) => {
        const state = getState();
        const file = findFileById(state.fileServer.files, id);

        if (!file) return rejectWithValue('File not found');
        if (!editor) return rejectWithValue('Editor is required');

        const prevContent = file.content ?? '';
        const prevLastEditor = file.lastEditor;

        dispatch(setSaving(true));

        dispatch(
            optimisticUpdateFileContent({
                fileId: id,
                newContent: content,
                editor,
            })
        );

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_BASE_URL}/files/content`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({id, content, editor}),
            });

            if (!response.ok) throw new Error('Failed to update file content');

            return await response.json();
        } catch (error) {
            dispatch(
                revertFileContent({
                    fileId: id,
                    prevContent,
                    prevLastEditor,
                })
            );

            return rejectWithValue('Failed to update file content');
        } finally {
            dispatch(setSaving(false));
        }
    }
);