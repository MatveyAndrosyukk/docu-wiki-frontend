import {ActionDispatch, useEffect} from "react";
import {User} from "../../../../../store/slices/userSlice";
import {UserHandlerAction} from "../user-handler.reducer";

type Props = {
    user: User | null;
    dispatch: ActionDispatch<[action: UserHandlerAction]>
};

export default function useEditedNameSync(
    {
        user,
        dispatch,
    }: Props) {

    useEffect(
        () => {

            dispatch({

                type: "SET_EDITED_NAME",

                payload: user?.name || ""

            });
        },
        [
            user?.name,
            dispatch,
        ]
    );

}