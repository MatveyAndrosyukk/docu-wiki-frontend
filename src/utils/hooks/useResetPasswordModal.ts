import {useEffect} from "react";

export const useResetPasswordModal = (
    resetToken: string | undefined,
    openModal: (v: boolean) => void
) => {

    useEffect(() => {
        if (resetToken) {
            openModal(true);
        }
    }, [resetToken, openModal]);

};