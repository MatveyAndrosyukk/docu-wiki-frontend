import {useEffect} from "react";

export const useResetPasswordModal = (
    resetToken: string | undefined,
    openModal: () => void
) => {

    useEffect(() => {
            if (resetToken) {
                openModal();
            }
        },
        [
            resetToken,
            openModal
        ]
    );

};