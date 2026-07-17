import React from "react";
import {AppDispatch} from "../../../../../store";
import {deleteUserWhoCanEdit} from "../../../../../store/thunks/user/deleteUserWhoCanEdit";

type Props = {
    reduxDispatch: AppDispatch;
};

export function deleteEditorAction(
    {
        reduxDispatch,
    }: Props) {

    return (
        targetEmail: string,
        event: React.MouseEvent<HTMLButtonElement>
    ) => {

        event.stopPropagation();

        const currentUserEmail = localStorage.getItem(
            "email"
        );

        reduxDispatch(
            deleteUserWhoCanEdit(
                {
                    userEmail: currentUserEmail as string,
                    whoCanEditEmail: targetEmail,
                }
            )
        );

    };

}