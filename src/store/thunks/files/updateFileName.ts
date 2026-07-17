import {createAsyncThunk} from "@reduxjs/toolkit";
import {ServerFile} from "../../types/ServerFile";
import {fetchFilesByEmail} from "./fetchFilesByEmail";
import {optimisticUpdateFileName, revertFileName} from "../../slices/fileServerSlice";
import {findFileById} from "../../utils/file.utils";
import {RootState} from "../../index";
import {apiFetch} from "../../../shared/lib/services/apiFetch";

interface ChangeFileNamePayload {
    id: number;

    name: string;

    viewedUserEmail: string;

    loggedInUserEmail?: string | null;
}

export const updateFileName = createAsyncThunk<
    ServerFile,
    ChangeFileNamePayload,
    {
        state: RootState;
        rejectValue: {
            fileId: number;
            prevName: string
        }
    }
>(
    "file/updateFileName",
    async (
        body,
        {
            dispatch,
            rejectWithValue,
            getState
        }
    ) => {

        const state = getState();

        const file = findFileById(
            state.fileServer.files,
            body.id
        );

        if (!file) {
            return rejectWithValue(
                {
                    fileId: body.id,
                    prevName: ""
                }
            );
        }

        const prevName = file.name;

        dispatch(
            optimisticUpdateFileName(
                {
                    fileId: body.id,
                    newName: body.name,
                }
            )
        );

        try {
            const response = await apiFetch(
                `/files/rename`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(
                        {
                            id: body.id,
                            name: body.name,
                        }
                    ),
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to rename file on server"
                );
            }

            return await response.json();
        } catch (error) {

            dispatch(
                revertFileName(
                    {
                        fileId: body.id,
                        prevName,
                    }
                )
            );

            dispatch(
                fetchFilesByEmail(
                    {
                        viewedUserEmail: body.viewedUserEmail,
                        loggedInUserEmail: body.loggedInUserEmail,
                    }
                )
            );

            return rejectWithValue(
                {
                    fileId: body.id,
                    prevName
                }
            );
        }
    }
);