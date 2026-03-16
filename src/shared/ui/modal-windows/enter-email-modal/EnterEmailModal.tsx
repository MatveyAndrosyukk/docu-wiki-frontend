import React, { FC } from 'react';
import Modal from "../modal/Modal";
import modalStyles from '../modal/ModalContent.module.scss';
import styles from './EnterEmailModal.module.scss';
import { useAppContext } from "../../../lib/hooks/useAppContext";

const EnterEmailModal: FC = () => {
    const { authState } = useAppContext();

    const {
        isEnterEmailModalOpened,
        setIsEnterEmailModalOpened,
        emailModalMessage,
        setEmailModalMessage,
        emailModalError,
        setEmailModalError,
        emailModalInputRef,
        emailModalValue,
        setEmailModalValue,
        emailModalLoading,
        handleSendChangePasswordLink,
        handleChangeEmailModalValue
    } = authState;

    const handleCloseEnterEmailModal = () => {
        setIsEnterEmailModalOpened(false);
        setEmailModalMessage('');
        setEmailModalError('');
        setEmailModalValue('');
    };

    const messageText = emailModalMessage || emailModalError;
    const messageClassName = emailModalMessage
        ? modalStyles.modal__message
        : emailModalError
            ? modalStyles.modal__error
            : `${modalStyles.modal__message} ${modalStyles.hidden}`;

    return (
        <Modal
            isOpen={isEnterEmailModalOpened}
            onClose={handleCloseEnterEmailModal}
        >
            <div className={`${modalStyles.modal__overlay} ${styles.modal__overlay}`}>
                <div className={`${modalStyles['modal__form']} ${styles['enter-email-modal__form']}`}>

                    <div className={modalStyles['modal__header']}>
                        <p className={modalStyles['modal__title']}>Password recovery</p>
                        <p className={messageClassName}>{messageText}</p>
                    </div>

                    <div className={styles['enter-email-modal__body']}>
                        <input
                            ref={emailModalInputRef}
                            type='text'
                            className={`${modalStyles['modal__input']} ${styles['enter-email-modal__input-input']}`}
                            placeholder="Enter your registered email"
                            value={emailModalValue}
                            disabled={emailModalLoading}
                            onChange={(e) => handleChangeEmailModalValue(e)}
                        />

                        <button
                            className={`${modalStyles['modal__button']} ${styles['enter-email-modal__button-button']}`}
                            disabled={emailModalLoading || !emailModalValue.trim()}
                            onClick={handleSendChangePasswordLink}
                        >
                            {emailModalLoading ? 'Send...' : 'Send'}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default EnterEmailModal;