import {useDispatch} from "react-redux";
import {EditFileActionsState, initialState} from "./edit-file.types";
import {AppDispatch} from "../../../../store";
import {useCallback, useReducer} from "react";
import {editFileReducer} from "./edit-file.reducer";
import {openFile} from "../../../../store/slices/fileUiSlice";
import {updateFileContent} from "../../../../store/thunks/files/updateFileContent";
import extractImagesName from "../../utils/extractImageNames";
import {deleteExtraImagesAsync} from "../../services/deleteExtraImagesAsync";

export default function useEditFileHandler(): EditFileActionsState {

    const reduxDispatch = useDispatch<AppDispatch>();

    const [state, dispatch] = useReducer(
        editFileReducer,
        initialState
    );

    const setIsEditing = useCallback(
        (value: boolean) => {

            dispatch(
                {
                    type: "SET_IS_EDITING",
                    payload: value,
                }
            );
        },
        []);

    const setIsFileContentChanged = useCallback(
        (value: boolean) => {

            dispatch(
                {
                    type: "SET_IS_FILE_CONTENT_CHANGED",
                    payload: value,
                }
            );
        },
        []);

    const setIsTryToSwitchWhileEditing = useCallback(
        (value: boolean) => {

            dispatch(
                {
                    type: "SET_IS_TRY_TO_SWITCH_WHILE_EDITING",
                    payload: value,
                }
            );
        },
        []);

    const setSwitchedFileId = useCallback(
        (value: number | null) => {

            dispatch(
                {
                    type: "SET_SWITCHED_FILE_ID",
                    payload: value,
                }
            );
        },
        []);

    const setContentError = useCallback(
        (value: string) => {

            dispatch(
                {
                    type: "SET_CONTENT_ERROR",
                    payload: value,
                });
        }, []);

    const reset = useCallback(
        () => {

            dispatch(
                {
                    type: "RESET",
                });
        }, []);

    const tryToOpenFile = useCallback(
        (targetFileId: number) => {

            if (
                state.isEditing &&
                state.isFileContentChanged
            ) {

                setIsTryToSwitchWhileEditing(true);

                setSwitchedFileId(targetFileId);

                return;
            }

            reset();

            reduxDispatch(
                openFile(
                    targetFileId
                )
            );

        },
        [
            state.isEditing,
            state.isFileContentChanged,
            reduxDispatch,
            reset,
            setIsTryToSwitchWhileEditing,
            setSwitchedFileId,
        ]
    );

    const confirmSwitch = useCallback(
        () => {

            if (state.switchedFileId === null) {

                return;
            }

            reduxDispatch(
                openFile(
                    state.switchedFileId
                )
            );

            reset();

        }, [
            reduxDispatch,
            state.switchedFileId,
            reset,
        ]);

    const rejectSwitch = useCallback(
        () => {

            setIsTryToSwitchWhileEditing(false);

            setSwitchedFileId(null);

        },
        [
            setIsTryToSwitchWhileEditing,
            setSwitchedFileId,
        ]
    );

    const saveChanges = useCallback(
        (
            fileId: number,
            newContent: string,
            addedImages: string[],
            editorUsername?: string
        ) => {

            if (
                !editorUsername ||
                state.contentError
            ) {

                return;
            }

            setIsEditing(false);

            setIsFileContentChanged(false);

            reduxDispatch(
                updateFileContent(
                    {
                        id: fileId,
                        content: newContent,
                        editor: editorUsername,
                    }
                )
            )
                .unwrap()
                .then(
                    () => {

                        const savedImages = extractImagesName(
                            newContent
                        );

                        const extraImages = addedImages.filter(
                            image => !savedImages.includes(
                                image
                            )
                        );

                        if (!extraImages.length) {

                            return;
                        }

                        deleteExtraImagesAsync(
                            extraImages
                        ).catch(
                            err => {
                                console.error("Failed to delete images:", err);
                            }
                        );

                    }
                ).catch(
                err => {
                    console.error("Save failed:", err);
                }
            );

        },
        [
            reduxDispatch,
            state.contentError,
            setIsEditing,
            setIsFileContentChanged,
        ]
    );

    const cancelChanges = useCallback(
        async (
            contentBeforeEdition: string,
            addedImages: string[],
        ) => {

            if (addedImages.length > 0) {

                const savedImages = extractImagesName(
                    contentBeforeEdition
                );

                const extraImages = addedImages.filter(
                    image => !savedImages.includes(
                        image
                    )
                );

                await deleteExtraImagesAsync(
                    extraImages
                );

            }

            setIsEditing(false);

            setIsFileContentChanged(false);

        },
        [
            setIsEditing,
            setIsFileContentChanged,
        ]
    );

    return {

        state,

        actions: {

            setIsEditing,

            setIsFileContentChanged,

            setIsTryToSwitchWhileEditing,

            setSwitchedFileId,

            setContentError,

            reset,

            tryToOpenFile,

            rejectSwitch,

            confirmSwitch,

            saveChanges,

            cancelChanges,

        },

    };

}