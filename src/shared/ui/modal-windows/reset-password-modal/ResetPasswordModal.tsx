import React, { FC, useCallback, useEffect } from 'react';
import Modal from "../modal/Modal";
import styles from "./ResetPasswordModal.module.scss";
import modalStyles from "../modal/ModalContent.module.scss";
import { ReactComponent as CloseModalSvg } from "./images/reset-password-modal-close.svg";
import { useAppContext } from "../../../lib/hooks/useAppContext";

interface ResetPasswordModalProps {
    resetToken: string | undefined;
}

const ResetPasswordModal: FC<ResetPasswordModalProps> = ({ resetToken }) => {
    const { authState } = useAppContext();

    const {
        isResetPasswordModalOpened,
        setIsResetPasswordModalOpened,
        resetPasswordError,
        setResetPasswordError,
        resetPasswordValue,
        setResetPasswordValue,
        resetPasswordLoading,
        newPasswordInputRef,
        resetPasswordMessage,
        handleChangeNewPassword,
        handleChangeRepeatPassword,
        handleClickResetPassword,
        handleBlurNewPassword,
        handleBlurRepeatPassword,
    } = authState;

    const handleCloseResetPasswordModal = useCallback(() => {
        setIsResetPasswordModalOpened(false);
        setResetPasswordValue({ newPassword: '', repeatPassword: '' });
        setResetPasswordError('');
    }, [setIsResetPasswordModalOpened, setResetPasswordValue, setResetPasswordError]);

    useEffect(() => {
        if (!isResetPasswordModalOpened) return;
        const ref = newPasswordInputRef as React.RefObject<HTMLInputElement>;
        ref.current?.focus();
        setResetPasswordError('');
    }, [isResetPasswordModalOpened, newPasswordInputRef, setResetPasswordError]);

    const messageText = resetPasswordMessage || resetPasswordError;
    const messageClassName = resetPasswordMessage
        ? modalStyles.modal__message
        : resetPasswordError
            ? modalStyles.modal__error
            : `${modalStyles.modal__message} ${modalStyles.hidden}`;

    return (
        <Modal
            isOpen={isResetPasswordModalOpened}
            onClose={handleCloseResetPasswordModal}
        >
            <div className={modalStyles['modal__overlay']}>
                <div className={modalStyles['modal__form']}>
                    <div className={`${modalStyles['modal__header']} ${styles['reset-password-modal__header']}`}>
                        <p className={modalStyles['modal__title']}>
                            Password recovery
                        </p>
                        <CloseModalSvg
                            className={styles['reset-password-modal__close']}
                            onClick={handleCloseResetPasswordModal}
                        />
                    </div>

                    <p className={messageClassName}>{messageText}</p>

                    <div className={styles['reset-password-modal__body']}>
                        <input
                            type='password'
                            className={modalStyles['modal__input']}
                            placeholder="Enter a new password"
                            value={resetPasswordValue.newPassword}
                            ref={newPasswordInputRef}
                            onBlur={handleBlurNewPassword}
                            onChange={handleChangeNewPassword}
                        />
                        <input
                            type='password'
                            className={modalStyles['modal__input']}
                            placeholder="Repeat a new password"
                            value={resetPasswordValue.repeatPassword}
                            onBlur={handleBlurRepeatPassword}
                            onChange={handleChangeRepeatPassword}
                        />
                        <button
                            className={`${modalStyles['modal__button']} ${styles['reset-password-modal__button-button']}`}
                            disabled={resetPasswordLoading}
                            onClick={() => handleClickResetPassword(resetToken)}
                        >
                            {resetPasswordLoading ? 'Reset...' : 'Reset'}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ResetPasswordModal;