import {Dispatch} from "react";
import {AppDispatch} from "../../../../../store";
import {addUserWhoCanEdit} from "../../../../../store/thunks/user/addUserWhoCanEdit";
import {UserHandlerAction} from "../user-handler.reducer";

type Props = {
    dispatch: Dispatch<UserHandlerAction>;
    reduxDispatch: AppDispatch;
};

export function addEditorAction(
    {
        dispatch,
        reduxDispatch,
    }: Props) {

    return async (modalValue: string) => {

        if (!modalValue.trim()) {
            return;
        }

        const currentUserEmail = localStorage.getItem(
            "email"
        );

        dispatch(
            {
                type: "SET_ADDING_EDITOR",
                payload: true,
            }
        );

        try {

            await reduxDispatch(
                addUserWhoCanEdit(
                    {
                        userEmail: currentUserEmail as string,
                        whoCanEditEmail: modalValue,
                    }
                )
            ).unwrap();

            dispatch(
                {
                    type: "SET_ADD_EDITOR_ERROR",
                    payload: "",
                }
            );

            dispatch(
                {
                    type: "SET_MODAL_VALUE",
                    payload: "",
                }
            );

        } catch (
            e: any
            ) {

            dispatch(
                {
                    type: "SET_ADD_EDITOR_ERROR",
                    payload: e.message,
                }
            );

        } finally {

            dispatch(
                {
                    type: "SET_ADDING_EDITOR",
                    payload: false,
                }
            );

        }
    };

}