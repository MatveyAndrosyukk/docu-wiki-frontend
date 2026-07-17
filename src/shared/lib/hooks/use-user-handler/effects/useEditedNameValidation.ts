import {ActionDispatch, useEffect} from "react";
import {UserHandlerAction} from "../user-handler.reducer";

type Props = {
    editedName: string;
    dispatch: ActionDispatch<[action: UserHandlerAction]>
};

export default function useEditedNameValidation(
    {
        editedName,
        dispatch,
    }: Props) {

    useEffect(() => {

            if (editedName.length > 25) {

                dispatch({

                    type: "SET_EDITED_NAME_ERROR",

                    payload: "Username is too long",

                });

            } else if (editedName.length < 4) {

                dispatch({

                    type: "SET_EDITED_NAME_ERROR",

                    payload: "Username is too short",

                });

            } else {

                dispatch({

                    type: "SET_EDITED_NAME_ERROR",

                    payload: "",

                });
            }

        },
        [
            editedName,
            dispatch,
        ]
    );

}