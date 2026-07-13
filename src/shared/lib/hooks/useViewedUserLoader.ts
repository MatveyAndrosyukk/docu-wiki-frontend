import {AppDispatch} from "../../../store";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {clearLoggedInUser, clearViewedUser} from "../../../store/slices/userSlice";
import {fetchViewedUserByEmail} from "../../../store/thunks/user/fetchViewedUserByEmail";
import {clearServerFiles} from "../../../store/slices/fileServerSlice";
import {clearUiState} from "../../../store/slices/fileUiSlice";

interface Props {
    email: string | null;
}

export const useViewedUserLoader = (
    {
        email,
    }: Props
) => {

    const reduxDispatch = useDispatch<AppDispatch>();

    useEffect(
        () => {

            if (email && email.trim() !== '') {

                reduxDispatch(fetchViewedUserByEmail(
                        email
                    )
                );
            } else {

                reduxDispatch(
                    clearServerFiles()
                );

                reduxDispatch(
                    clearUiState()
                );

                reduxDispatch(
                    clearViewedUser()
                );

                reduxDispatch(
                    clearLoggedInUser()
                );
            }
        },
        [
            email,
            reduxDispatch
        ]
    );

};