import {createAsyncThunk} from "@reduxjs/toolkit";
import {ServerFile} from "../../types/ServerFile";
import {CreateFilePayload} from "../../../types/CreateFilePayload";
import {apiFetch} from "../../../shared/lib/services/apiFetch";

export const createFile = createAsyncThunk<
    ServerFile,
    CreateFilePayload
>(
    'fileTree/createFile',
    async (
        body
    ) => {

        const response = await apiFetch(
            `/files`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    body
                )
            }
        );

        if (!response.ok) {

            throw new Error(
                'Failed to create file on server'
            );
        }

        const data = await response.json();

        return {
            ...data,
            tempId: body.tempId
        };
    }
);