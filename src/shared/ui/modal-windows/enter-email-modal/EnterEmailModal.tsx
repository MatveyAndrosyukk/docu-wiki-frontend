import React, {FC} from 'react';
import Modal from "../modal/Modal";
import modalStyles from '../modal/ModalContent.module.scss';
import styles from './EnterEmailModal.module.scss';
import {useAppContext} from "../../../../context/app-context/hooks/useAppContext";

const EnterEmailModal: FC = () => {
    const {authState} = useAppContext();

    const {changeEmailHandler} = authState;

    const closeModal = () => {
        changeEmailHandler.actions.reset();
    };

    const messageText = changeEmailHandler.state.message || changeEmailHandler.state.error;
    const messageClassName = changeEmailHandler.state.message
        ? modalStyles.modal__message
        : changeEmailHandler.state.error
            ? modalStyles.modal__error
            : `${modalStyles.modal__message} ${modalStyles.hidden}`;

    return (
        <Modal
            isOpen={changeEmailHandler.state.isModal}
            onClose={closeModal}
        >
            <div className={`${modalStyles.modal__overlay} ${styles.modal__overlay}`}>
                <div className={`${modalStyles['modal__form']} ${styles['enter-email-modal__form']}`}>

                    <div className={modalStyles['modal__header']}>
                        <p className={modalStyles['modal__title']}>Password recovery</p>
                        <p className={messageClassName}>{messageText}</p>
                    </div>

                    <div className={styles['enter-email-modal__body']}>
                        <input
                            ref={changeEmailHandler.state.inputRef}
                            type='text'
                            className={`${modalStyles['modal__input']} ${styles['enter-email-modal__input-input']}`}
                            placeholder="Enter your registered email"
                            value={changeEmailHandler.state.value}
                            disabled={changeEmailHandler.state.loading}
                            onChange={changeEmailHandler.actions.handleChangeEmail}
                        />

                        <button
                            className={`${modalStyles['modal__button']} ${styles['enter-email-modal__button-button']}`}
                            disabled={changeEmailHandler.state.loading || !changeEmailHandler.state.value.trim()}
                            onClick={changeEmailHandler.actions.sendChangePasswordLink}
                        >
                            {changeEmailHandler.state.loading ? 'Send...' : 'Send'}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default EnterEmailModal;