import React, {FC} from 'react';
import Modal from "../modal/Modal";
import styles from './EditModal.module.scss'
import modalStyles from '../modal/ModalContent.module.scss'
import {FileType} from "../../../../types/file";
import {useAppContext} from "../../../lib/hooks/useAppContext";
import {ReactComponent as ArrowIcon} from './images/arrow.svg'
import {ActionType} from "../../../lib/hooks/modal-actions/types/ActionType";

const EditModal: FC = () => {
    const {fileState} = useAppContext();

    const {
        modal,
        copyPaste,
        actions,
    } = fileState;

    const errorMessage = modal.error;

    const errorClassName = `${modalStyles['modal__error']}
     ${styles['edit-modal__error']}
      ${!errorMessage ? modalStyles['modal__hidden'] : ''}
`;

    const handleConfirm = () => {
        actions.confirm({
            title: modal.value,
            id: modal.openState.id,
            reason: modal.openState.reason as ActionType
        });
    };

    return (
        <Modal
            isOpen={modal.isOpen}
            onClose={actions.close}
        >
            <div className={modalStyles['modal__overlay']}>
                <div className={modalStyles['modal__form']}>

                    <div className={`${styles['edit-modal__title']} ${modalStyles['modal__title']}`}>
                        {modal.openState.title}
                    </div>

                    <p className={errorClassName}>
                        {errorMessage || "placeholder"}
                    </p>

                    <div className={styles['edit-modal__input-wrapper']}>

                        <input
                            ref={modal.inputRef}
                            type="text"
                            className={styles['edit-modal__input']}
                            placeholder="Enter the title"
                            value={modal.value}
                            onChange={(e) => actions.setValue(e.currentTarget.value)}
                            onKeyDown={(e) => {
                                if (e.key !== 'Enter') return;
                                e.preventDefault();
                                if (!modal.error) handleConfirm();
                            }}
                        />

                        <button
                            className={styles['edit-modal__submit']}
                            disabled={!modal.value.trim() || !!modal.error}
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

export default EditModal;