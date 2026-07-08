import React, {FC, useCallback, useEffect} from 'react';
import Modal from "../modal/Modal";
import styles from "./ResetPasswordModal.module.scss";
import modalStyles from "../modal/ModalContent.module.scss";
import {ReactComponent as CloseModalSvg} from "./images/reset-password-modal-close.svg";
import {useAppContext} from "../../../../context/app-context/hooks/useAppContext";

interface ResetPasswordModalProps {
    resetToken: string | undefined;
}

const ResetPasswordModal: FC<ResetPasswordModalProps> = ({resetToken}) => {
    const {authState} = useAppContext();

    const {resetPasswordHandler} = authState;

    const closeModal = useCallback(() => {
            resetPasswordHandler.actions.reset();
        },
        [
            resetPasswordHandler.actions
        ]
    );

    useEffect(() => {
        if (!resetPasswordHandler.state.isModal) return;
        const ref = resetPasswordHandler.state.newPasswordInputRef as React.RefObject<HTMLInputElement>;
        ref.current?.focus();
        resetPasswordHandler.actions.setError('');
    }, [resetPasswordHandler.actions, resetPasswordHandler.state.isModal, resetPasswordHandler.state.newPasswordInputRef]);

    const messageText = resetPasswordHandler.state.message || resetPasswordHandler.state.error;
    const messageClassName = resetPasswordHandler.state.message
        ? modalStyles.modal__message
        : resetPasswordHandler.state.error
            ? modalStyles.modal__error
            : `${modalStyles.modal__message} ${modalStyles.hidden}`;

    return (
        <Modal
            isOpen={resetPasswordHandler.state.isModal}
            onClose={closeModal}
        >
            <div className={modalStyles['modal__overlay']}>
                <div className={modalStyles['modal__form']}>
                    <div className={`${modalStyles['modal__header']} ${styles['reset-password-modal__header']}`}>
                        <p className={modalStyles['modal__title']}>
                            Password recovery
                        </p>
                        <CloseModalSvg
                            className={styles['reset-password-modal__close']}
                            onClick={closeModal}
                        />
                    </div>

                    <p className={messageClassName}>{messageText}</p>

                    <div className={styles['reset-password-modal__body']}>
                        <input
                            type='password'
                            className={modalStyles['modal__input']}
                            placeholder="Enter a new password"
                            value={resetPasswordHandler.state.value.newPassword}
                            ref={resetPasswordHandler.state.newPasswordInputRef}
                            onBlur={resetPasswordHandler.actions.blurNewPassword}
                            onChange={resetPasswordHandler.actions.handleChangeNewPassword}
                        />
                        <input
                            type='password'
                            className={modalStyles['modal__input']}
                            placeholder="Repeat a new password"
                            value={resetPasswordHandler.state.value.repeatPassword}
                            onBlur={resetPasswordHandler.actions.blurRepeatPassword}
                            onChange={resetPasswordHandler.actions.handleChangeRepeatPassword}
                        />
                        <button
                            className={`${modalStyles['modal__button']} ${styles['reset-password-modal__button-button']}`}
                            disabled={resetPasswordHandler.state.loading}
                            onClick={() => resetPasswordHandler.actions.resetPassword(resetToken)}
                        >
                            {resetPasswordHandler.state.loading ? 'Reset...' : 'Reset'}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ResetPasswordModal;