import {useCallback, useReducer} from "react";
import {deleteFileById} from "../../../../store/thunks/files/deleteFileById";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../../store";
import {updateUserFilesCount, User} from "../../../../store/slices/userSlice";
import {UiFile} from "../../../../store/types/UiFile";
import {FileType} from "../../../../types/file";
import {countFilesRecursively} from "../../utils/modalUtils";
import {DeleteModalActionsState, initialState} from "./delete-file.types";
import {deleteFileReducer} from "./delete-file.reducer";

export default function useDeleteModalActions(): DeleteModalActionsState {
    const [state, dispatch] = useReducer(
        deleteFileReducer,
        initialState
    );

    const reduxDispatch = useDispatch<AppDispatch>();

    const viewedUser = useSelector(
        (state: RootState) => state.user.viewedUser
    );

    const open = useCallback(
        (
            file: UiFile,
            user: User | null
        ) => {

            dispatch(
                {
                    type: "OPEN",
                    payload: {
                        file,
                        user,
                    },
                }
            );
        },
        []
    );

    const confirm = useCallback(
        async () => {

            if (!state.file) return;

            const deletedFile = state.file;

            const userEmail = state.user?.email;

            let filesToSubtract = 0;

            if (deletedFile.type === FileType.File) {

                filesToSubtract = 1;

            } else {

                filesToSubtract = countFilesRecursively(deletedFile);

            }

            reduxDispatch(
                updateUserFilesCount(
                    {
                        email: viewedUser?.email ?? 'unknown',
                        delta: -filesToSubtract
                    }
                )
            );

            dispatch(
                {
                    type: "SET_DELETING",
                    payload: true,
                }
            );

            reduxDispatch(
                deleteFileById(
                    {
                        file: deletedFile,
                        email: userEmail
                    }
                )
            )
                .unwrap()
                .catch(
                    () => {

                        reduxDispatch(
                            updateUserFilesCount(
                                {
                                    email: viewedUser?.email ?? 'unknown',
                                    delta: +filesToSubtract
                                }
                            )
                        );
                    }
                );

            dispatch(
                {
                    type: "CLOSE",
                }
            );
        },
        [
            state.file,
            state.user?.email,
            reduxDispatch,
            viewedUser?.email
        ]
    );

    const close = useCallback(
        () => {

            dispatch(
                {
                    type: "CLOSE",
                }
            );
        },
        []
    );

    return {
        state,
        actions: {
            open,
            confirm,
            close,
        },
    };
}