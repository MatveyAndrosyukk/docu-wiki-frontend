import {createAsyncThunk} from "@reduxjs/toolkit";
import {File} from "../../../types/file";
import {revertFileLike, toggleFileLikeOptimistic} from "../../slices/fileServerSlice";
import {findFileById} from "../../utils/fileTreeActionUtils";
import {RootState} from "../../index";
import API_BASE_URL from "../../../shared/assets/config/api-config";

export interface ChangeFileLikesPayload {
    id: number;
    email: string;
}

export const toggleFileLikes = createAsyncThunk<
    File,
    ChangeFileLikesPayload,
    { state: RootState }
>(
    'fileLikes/toggle',
    async ({id, email}, {dispatch, getState, rejectWithValue}) => {
        const state = getState();
        const file = findFileById(state.fileServer.files, id);

        if (!file) {
            return rejectWithValue('File not found');
        }

        const prevIsLiked = Boolean(file.isLiked);
        const prevLikes = file.likes ?? 0;

        dispatch(toggleFileLikeOptimistic({fileId: id}));

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_BASE_URL}/files/like`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({id, email}),
            });

            if (!response.ok) {
                throw new Error('Failed to like file on server');
            }

            return await response.json();
        } catch (error) {
            dispatch(
                revertFileLike({
                    fileId: id,
                    prevIsLiked,
                    prevLikes,
                })
            );

            return rejectWithValue('Failed to toggle like');
        }
    }
);