import React, {FC} from 'react';
import Modal from "../modal/Modal";
import modalStyles from '../modal/ModalContent.module.scss'
import styles from './DeleteModal.module.scss'
import {FileType} from "../../../../types/file";
import {useAppContext} from "../../../../context/app-context/hooks/useAppContext";

const DeleteModal: FC = () => {
    const {fileState} = useAppContext();

    const {
        deleteModal
    } = fileState;

    const file = deleteModal.state.file;
    const isFolder = file?.type === FileType.Folder;

    const deleteText = isFolder
        ? 'Delete folder'
        : 'Delete file';

    const deleteEnding = isFolder
        ? 'and all its contents?'
        : '?';

    return (
        <Modal isOpen={deleteModal.state.open}
               onClose={deleteModal.actions.close}>
            <div
                className={`${modalStyles['modal__overlay']} ${styles['delete-modal__overlay']}`}
            >
                <div className={modalStyles['modal__form']}>
                    <p className={`${modalStyles['modal__text']} ${styles['delete-modal__text']}`}>
                        <p className={`${modalStyles['modal__text']} ${styles['delete-modal__text']}`}>
                            {deleteText}{' '}
                            <span className={styles['delete-modal__text-highlighted']}>
                            "{file?.name}"</span>{' '}
                            {deleteEnding}
                        </p>
                    </p>
                    <div className={modalStyles['modal__buttons']}>
                        <button
                            className={styles['delete-modal__buttons-delete']}
                            onClick={deleteModal.actions.confirm}
                        >
                            OK
                        </button>
                        <button
                            className={styles['delete-modal__buttons-cancel']}
                            onClick={deleteModal.actions.close}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </Modal>);
}

export default DeleteModal;