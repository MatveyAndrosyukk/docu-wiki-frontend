import {Dispatch} from "react";
import {UserHandlerAction} from "../user-handler.reducer";

type Props = {
    dispatch: Dispatch<UserHandlerAction>;
    authStatus: string;
    openLoginModal(): void;
};

export function modalActions(
    {
        dispatch,
        authStatus,
        openLoginModal,
    }: Props) {

    const closeModal = () => {
        dispatch(
            {
                type: "SET_MODAL_OPEN",
                payload: false,
            }
        );

        dispatch(
            {
                type: "SET_MODAL_VALUE",
                payload: "",
            }
        );

        dispatch(
            {
                type: "SET_ADD_EDITOR_ERROR",
                payload: "",
            }
        );

        dispatch(
            {
                type: "SET_CHANGE_NAME_ERROR",
                payload: "",
            }
        );
    };

    const openModal = () => {

        if (authStatus !== "authenticated") {

            openLoginModal();
            return;
        }

        dispatch(
            {
                type: "SET_MODAL_OPEN",
                payload: true,
            }
        );
    };

    return {
        openModal,
        closeModal,
    };
}