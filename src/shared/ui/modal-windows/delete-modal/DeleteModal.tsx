import React, {FC} from 'react';
import Modal from "../modal/Modal";
import modalStyles from '../modal/ModalContent.module.scss'
import styles from './DeleteModal.module.scss'
import {FileType} from "../../../../types/file";
import {useAppContext} from "../../../lib/hooks/useAppContext";

const DeleteModal: FC = () => {
    const {fileState} = useAppContext();

    const {
        deleteModalState,
        handleCancelDeleteFile,
        handleConfirmDeleteFile,
    } = fileState;

    return (<Modal isOpen={deleteModalState.open}
                   onClose={handleCancelDeleteFile}>
        <div
            className={`${modalStyles['modal__overlay']} ${styles['delete-modal__overlay']}`}
        >
            <div className={modalStyles['modal__form']}>
                <p className={`${modalStyles['modal__text']} ${styles['delete-modal__text']}`}>
                    {deleteModalState.file?.type === FileType.Folder ? (
                        <>
                            Delete folder <span
                            className={styles['delete-modal__text-highlighted']}>"{deleteModalState.file.name}"
                            </span> and all its contents?
                        </>
                    ) : (
                        <>
                            Delete file{" "}
                            <span className={styles['delete-modal__text-highlighted']}>
                                "{deleteModalState.file?.name}"
                            </span>
                            ?
                        </>
                    )}
                </p>
                <div className={modalStyles['modal__buttons']}>
                    <button
                        className={styles['delete-modal__buttons-delete']}
                        onClick={handleConfirmDeleteFile}
                    >
                        OK
                    </button>
                    <button
                        className={styles['delete-modal__buttons-cancel']}
                        onClick={handleCancelDeleteFile}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </Modal>);
}

export default DeleteModal;