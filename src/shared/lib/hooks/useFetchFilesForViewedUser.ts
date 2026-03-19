import {User} from "../../../store/slices/userSlice";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../store";
import {useEffect, useRef} from "react";
import {clearServerFiles} from "../../../store/slices/fileServerSlice";
import {clearUiState} from "../../../store/slices/fileUiSlice";
import {fetchFilesByEmail} from "../../../store/thunks/files/fetchFilesByEmail";

export const useFetchFilesForViewedUser = (
    viewedUser: User | null,
    loggedInUser: User | null
) => {
    const dispatch = useDispatch<AppDispatch>();

    const prevViewedUserRef = useRef<User | null>(null);
    const prevLoggedInUserRef = useRef<User | null>(loggedInUser);

    useEffect(() => {
        if (!viewedUser) return;

        const prevViewedUser = prevViewedUserRef.current;
        const prevLoggedInUser = prevLoggedInUserRef.current;

        const isOnlyCounterOrViewBlockedChanged = prevViewedUser &&
            prevViewedUser.email === viewedUser.email &&
            JSON.stringify({
                ...prevViewedUser,
                isViewBlocked: undefined,
                amountOfFiles: undefined
            }) === JSON.stringify({
                ...viewedUser,
                isViewBlocked: undefined,
                amountOfFiles: undefined
            }) &&
            (prevViewedUser.isViewBlocked !== viewedUser.isViewBlocked ||
                prevViewedUser.amountOfFiles !== viewedUser.amountOfFiles);

        if (!isOnlyCounterOrViewBlockedChanged) {
            const isUserEditor = viewedUser.whoCanEdit.some(
                u => u.email === loggedInUser?.email
            );

            const isUserEqualsLoggedIn =
                viewedUser.email === loggedInUser?.email;

            const justLoggedOutFromOwnPage =
                !loggedInUser &&
                prevLoggedInUser &&
                prevLoggedInUser.email === viewedUser.email;

            const isBlockedForCurrentUser =
                viewedUser.isViewBlocked && !(isUserEditor || isUserEqualsLoggedIn);

            const shouldClearOnLogout =
                justLoggedOutFromOwnPage && viewedUser.isViewBlocked;

            if (isBlockedForCurrentUser || shouldClearOnLogout) {
                dispatch(clearServerFiles());
                dispatch(clearUiState());
            } else {
                dispatch(fetchFilesByEmail({
                    viewedUserEmail: viewedUser.email,
                    loggedInUserEmail: loggedInUser?.email
                }));
            }
        }

        prevViewedUserRef.current = viewedUser;
        prevLoggedInUserRef.current = loggedInUser || null;
    }, [viewedUser, loggedInUser, dispatch]);
};