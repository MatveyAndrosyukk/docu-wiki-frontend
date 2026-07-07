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

    const {reset} = authState;

    const closeModal = useCallback(() => {
            reset.actions.reset();
        },
        [
            reset.actions
        ]
    );

    useEffect(() => {
        if (!reset.state.isModal) return;
        const ref = reset.state.newPasswordInputRef as React.RefObject<HTMLInputElement>;
        ref.current?.focus();
        reset.actions.setError('');
    }, [reset.actions, reset.state.isModal, reset.state.newPasswordInputRef]);

    const messageText = reset.state.message || reset.state.error;
    const messageClassName = reset.state.message
        ? modalStyles.modal__message
        : reset.state.error
            ? modalStyles.modal__error
            : `${modalStyles.modal__message} ${modalStyles.hidden}`;

    return (
        <Modal
            isOpen={reset.state.isModal}
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
                            value={reset.state.value.newPassword}
                            ref={reset.state.newPasswordInputRef}
                            onBlur={reset.actions.blurNewPassword}
                            onChange={reset.actions.handleChangeNewPassword}
                        />
                        <input
                            type='password'
                            className={modalStyles['modal__input']}
                            placeholder="Repeat a new password"
                            value={reset.state.value.repeatPassword}
                            onBlur={reset.actions.blurRepeatPassword}
                            onChange={reset.actions.handleChangeRepeatPassword}
                        />
                        <button
                            className={`${modalStyles['modal__button']} ${styles['reset-password-modal__button-button']}`}
                            disabled={reset.state.loading}
                            onClick={() => reset.actions.resetPassword(resetToken)}
                        >
                            {reset.state.loading ? 'Reset...' : 'Reset'}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ResetPasswordModal;