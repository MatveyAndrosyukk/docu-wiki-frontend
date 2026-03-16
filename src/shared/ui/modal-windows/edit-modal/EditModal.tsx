import React, {FC, useEffect} from 'react';
import Modal from "../modal/Modal";
import styles from './EditModal.module.scss'
import modalStyles from '../modal/ModalContent.module.scss'
import {FileType} from "../../../../types/file";
import {ActionType} from "../../../lib/hooks/useModalActions";
import {useAppContext} from "../../../lib/hooks/useAppContext";
import {ReactComponent as ArrowIcon} from './images/arrow.svg'

const EditModal: FC = () => {
    const {fileState} = useAppContext();

    const {
        modalValue,
        isModalOpen,
        modalOpenState,
        copiedFile,
        modalInputRef,
        modalError,
        setModalError,
        isNameConflictReason,
        setModalValue,
        handleCloseModal,
        handleConfirmModalByReason,
    } = fileState;

    const errorMessage = modalError
        ? modalError
        : isNameConflictReason()
            ? copiedFile?.type === FileType.Folder
                ? "Folder with this name exists"
                : "File with this name exists"
            : "";

    useEffect(() => {
        if (modalValue.length >= 20) {
            setModalError('Name is too long');
        } else {
            setModalError('')
        }
    }, [modalValue, setModalError]);

    const handleConfirm = () => {
        handleConfirmModalByReason({
            title: modalValue,
            id: modalOpenState.id,
            reason: modalOpenState.reason as ActionType
        });
    };

    return (
        <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
        >
            <div className={modalStyles['modal__overlay']}>
                <div className={modalStyles['modal__form']}>

                    <div className={`${styles['edit-modal__title']} ${modalStyles['modal__title']}`}>
                        {modalOpenState.title}
                    </div>

                    <p
                        className={`
                        ${modalStyles['modal__error']} 
                        ${styles['edit-modal__error']} 
                        ${!errorMessage ? modalStyles['modal__hidden'] : ''}
                    `}
                    >
                        {errorMessage || "placeholder"}
                    </p>

                    <div className={styles['edit-modal__input-wrapper']}>

                        <input
                            ref={modalInputRef}
                            type="text"
                            className={styles['edit-modal__input']}
                            placeholder="Enter the title"
                            value={modalValue}
                            onChange={(e) => setModalValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (modalError) return;
                                    handleConfirm();
                                }
                            }}
                        />

                        <button
                            className={styles['edit-modal__submit']}
                            disabled={!modalValue.trim() || !!modalError}
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