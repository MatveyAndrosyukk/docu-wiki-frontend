import {useCallback, useReducer} from "react";
import {useDispatch, useSelector} from "react-redux";

import {AppDispatch, RootState} from "../../../../../../store";
import {toggleFileLikes} from "../../../../../../store/thunks/files/toggleFileLikes";
import {selectOpenedFile} from "../../../../../../store/selectors/selectOpenedFile";

import {
    FileLikesActionsState,
    initialState,
} from "./file-likes.types";
import {fileLikesReducer} from "./file-likes.reducer";

export const useFileLikesHandler = (): FileLikesActionsState => {

    const file = useSelector(selectOpenedFile);

    const reduxDispatch = useDispatch<AppDispatch>();

    const loggedInUserEmail = useSelector(
        (state: RootState) => state.user.loggedInUser?.email
    );

    const [state, dispatch] = useReducer(
        fileLikesReducer,
        initialState
    );

    const setIsLiking = useCallback(
        (value: boolean) => {
            dispatch(
                {
                    type: "SET_IS_LIKING",
                    payload: value,
                }
            );
        },
        []
    );

    const toggleLike = useCallback(
        async () => {

            if (
                !file ||
                !loggedInUserEmail ||
                state.isLiking
            ) {
                return;
            }

            setIsLiking(true);

            try {
                await reduxDispatch(
                    toggleFileLikes(
                        {
                            id: file.id,
                            email: loggedInUserEmail,
                        }
                    )
                ).unwrap();
            } finally {

                setIsLiking(false);
            }
        },
        [
            reduxDispatch,
            file,
            loggedInUserEmail,
            state.isLiking,
            setIsLiking,
        ]
    );

    return {
        state,
        actions: {
            toggleLike,
            setIsLiking,
        },
    };
};