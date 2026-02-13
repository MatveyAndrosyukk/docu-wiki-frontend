import {createAsyncThunk} from "@reduxjs/toolkit";
import API_BASE_URL from "../../../config/api-config";
import {ServerFile} from "../../types/ServerFile";
import {CreateFilePayload} from "../../../types/CreateFilePayload";

const delay = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

export const createFile = createAsyncThunk<
    ServerFile,
    CreateFilePayload
>(
    'fileTree/createFile',
    async (body) => {
        const token = localStorage.getItem('token');

        await delay(3000);

        console.log(JSON.stringify(body))

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