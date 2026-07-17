import {ActionDispatch, useEffect} from "react";
import {User} from "../../../../../store/slices/userSlice";
import {UserHandlerAction} from "../user-handler.reducer";

type Props = {
    modalValue: string;

    user: User | null;

    dispatch: ActionDispatch<[action: UserHandlerAction]>
};

export default function useEditorsSync(
    {
        modalValue,
        user,
        dispatch,
    }: Props) {

    useEffect(() => {

        if (
            modalValue.trim() === "" &&
            user?.whoCanEdit
        ) {

            dispatch({

                type: "SET_EDITORS",

                payload: [...user.whoCanEdit].reverse()

            });
        }

    }, [
        modalValue,
        user?.whoCanEdit,
        dispatch,
    ]);

}