import React, {FC} from 'react';
import Modal from "../modal/Modal";
import styles from './ActionsModal.module.scss'
import modalStyles from '../modal/ModalContent.module.scss'
import {useAppContext} from "../../../../context/app-context/hooks/useAppContext";
import {ReactComponent as ArrowIcon} from './images/arrow.svg'
import {
    ActionType
} from "../../../lib/hooks/use-files-handler/hooks/use-file-actions-hanler/file-actions-handler.types";

const ActionsModal: FC = () => {
    const {filesHandler} = useAppContext();

    const {
        fileActionsHandler
    } = filesHandler;

    const {
        modalState
    } = fileActionsHandler.state;

    const errorClassName = `${modalStyles['modal__error']}
     ${styles['edit-modal__error']}
      ${!fileActionsHandler.state.error ? modalStyles['modal__hidden'] : ''}
`;

    const handleConfirm = () => {
        filesHandler.fileActionsHandler.actions.confirm(
            {
                title: fileActionsHandler.state.value,
                id: modalState.id,
                reason: modalState.reason as ActionType
            }
        );
    };

    return (
        <Modal
            isOpen={fileActionsHandler.state.isOpen}
            onClose={fileActionsHandler.actions.close}
        >
            <div className={modalStyles['modal__overlay']}>
                <div className={modalStyles['modal__form']}>

                    <div className={`${styles['edit-modal__title']} ${modalStyles['modal__title']}`}>
                        {modalState.title}
                    </div>

                    <p className={errorClassName}>
                        {fileActionsHandler.state.error || "placeholder"}
                    </p>

                    <div className={styles['edit-modal__input-wrapper']}>

                        <input
                            ref={fileActionsHandler.state.inputRef}
                            type="text"
                            className={styles['edit-modal__input']}
                            placeholder="Enter the title"
                            value={fileActionsHandler.state.value}
                            onChange={(e) => filesHandler.fileActionsHandler.actions.setValue(e.currentTarget.value)}
                            onKeyDown={(e) => {
                                if (e.key !== 'Enter') return;
                                e.preventDefault();
                                if (!fileActionsHandler.state.error) handleConfirm();
                            }}
                        />

                        <button
                            className={styles['edit-modal__submit']}
                            disabled={!fileActionsHandler.state.value.trim() || !!fileActionsHandler.state.error}
                            onClick={handleConfirm}
                        >
                            <ArrowIcon/>
                        </button>

                    </div>

                </div>
            </div>
        </Modal>
    );
};

export default ActionsModal;