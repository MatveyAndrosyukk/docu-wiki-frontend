import {User} from "../../../store/slices/userSlice";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../store";
import {useEffect, useRef} from "react";
import {clearServerFiles} from "../../../store/slices/fileServerSlice";
import {clearUiState} from "../../../store/slices/fileUiSlice";
import {fetchFilesByEmail} from "../../../store/thunks/files/fetchFilesByEmail";

interface Params {
    viewedUser: User | null;
    loggedInUser: User | null;
}

export const useFetchFilesForViewedUser = (
    {
        viewedUser,
        loggedInUser,
    }: Params) => {

    const reduxDispatch = useDispatch<AppDispatch>();

    const prevViewedUserRef = useRef<User | null>(null);

    const prevLoggedInUserRef = useRef<User | null>(
        loggedInUser
    );

    useEffect(
        () => {

            if (!viewedUser) return;

            const prevViewedUser = prevViewedUserRef.current;

            const prevLoggedInUser = prevLoggedInUserRef.current;

            const isSameUser =
                prevViewedUser?.email === viewedUser.email;

            const isSameUserWithoutDynamicFields =
                JSON.stringify({
                    ...prevViewedUser,
                    isViewBlocked: undefined,
                    amountOfFiles: undefined,
                }) ===
                JSON.stringify({
                    ...viewedUser,
                    isViewBlocked: undefined,
                    amountOfFiles: undefined,
                });

            const isViewBlockedChanged =
                prevViewedUser?.isViewBlocked !== viewedUser.isViewBlocked;

            const isFilesCountChanged =
                prevViewedUser?.amountOfFiles !== viewedUser.amountOfFiles;

            const isOnlyCounterOrViewBlockedChanged =
                !!prevViewedUser &&
                isSameUser &&
                isSameUserWithoutDynamicFields &&
                (isViewBlockedChanged || isFilesCountChanged);

            if (!isOnlyCounterOrViewBlockedChanged) {

                const isUserEditor = viewedUser.whoCanEdit.some(
                    user => user.email === loggedInUser?.email
                );

                const isOwner =
                    viewedUser.email === loggedInUser?.email;

                const isBlockedForCurrentUser =
                    viewedUser.isViewBlocked &&
                    !isOwner &&
                    !isUserEditor;

                const isJustLoggedOutFromOwnPage =
                    !loggedInUser &&
                    !!prevLoggedInUser &&
                    prevLoggedInUser.email === viewedUser.email;

                const shouldClearFiles =
                    isBlockedForCurrentUser ||
                    (isJustLoggedOutFromOwnPage && viewedUser.isViewBlocked);

                if (shouldClearFiles) {

                    reduxDispatch(clearServerFiles());

                    reduxDispatch(clearUiState());
                } else {

                    reduxDispatch(
                        fetchFilesByEmail(
                            {
                                viewedUserEmail: viewedUser.email,
                                loggedInUserEmail: loggedInUser?.email,
                            }
                        )
                    );
                }
            }

            prevViewedUserRef.current = viewedUser;

            prevLoggedInUserRef.current = loggedInUser;
        },
        [
            viewedUser,
            loggedInUser,
            reduxDispatch
        ]
    );
};