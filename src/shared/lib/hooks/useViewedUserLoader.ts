import {AppDispatch} from "../../../store";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {clearLoggedInUser, clearViewedUser} from "../../../store/slices/userSlice";
import {fetchViewedUserByEmail} from "../../../store/thunks/user/fetchViewedUserByEmail";
import {clearServerFiles} from "../../../store/slices/fileServerSlice";
import {clearUiState} from "../../../store/slices/fileUiSlice";

export const useViewedUserLoader = (
    email: string | null,
) => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (email && email.trim() !== '') {
            dispatch(fetchViewedUserByEmail(email));
        } else {
            dispatch(clearServerFiles());
            dispatch(clearUiState())
            dispatch(clearViewedUser());
            dispatch(clearLoggedInUser());
        }
    }, [email, dispatch]);

};