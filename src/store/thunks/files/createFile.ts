import {createAsyncThunk} from "@reduxjs/toolkit";
import {ServerFile} from "../../types/ServerFile";
import {CreateFilePayload} from "../../../types/CreateFilePayload";
import API_BASE_URL from "../../../shared/assets/config/api-config";

export const createFile = createAsyncThunk<
    ServerFile,
    CreateFilePayload
>(
    'fileTree/createFile',
    async (body) => {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/files`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error('Failed to create file on server');
        }

        const data = await response.json();

        return { ...data, tempId: body.tempId };
    }
);