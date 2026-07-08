import React, {FC, useCallback} from 'react';
import modalStyles from '../modal/ModalContent.module.scss'
import styles from './SwitchWhileEditModal.module.scss'
import Modal from "../modal/Modal";
import {useAppContext} from "../../../../context/app-context/hooks/useAppContext";

interface SwitchWhileEditModalProps {
    contentBeforeEdition: string;
    onCancelEditedFileChange: (
        addedImages: string[],
        contentBeforeEdition: string) => void;
    addedImagesWhileEditing: string[];
}

const SwitchWhileEditModal: FC<SwitchWhileEditModalProps> = (
    {
        onCancelEditedFileChange,
        addedImagesWhileEditing,
        contentBeforeEdition,
    }) => {
    const {fileState} = useAppContext();

    const {
        fileEditor
    } = fileState;

    const confirmSwitchHandler = useCallback(() => {
        fileEditor.actions.confirmSwitch()
        onCancelEditedFileChange(addedImagesWhileEditing, contentBeforeEdition)
    }, [addedImagesWhileEditing, contentBeforeEdition, fileEditor.actions, onCancelEditedFileChange])

    return (
        <Modal isOpen={fileEditor.state.isTryToSwitchWhileEditing}
               onClose={fileEditor.actions.rejectSwitch}>
            <div
                className={`${modalStyles['modal__overlay']} ${styles['switch-modal__overlay']}`}
            >
                <div className={modalStyles['modal__form']}>
                    <p
                        className={`${modalStyles['modal__title']} ${styles['switch-modal__title']}`}
                    >
                        <div>Are you sure that you want to open another file?</div>
                        <div>You will lose all your unsaved changes.</div>
                    </p>
                    <div className={modalStyles['modal__buttons']}>
                        <button
                            className={`${styles['switch-modal__buttons-confirm']} ${styles['switch-modal__button']}`}
                            onClick={confirmSwitchHandler}
                        >
                            Open
                        </button>
                        <button
                            className={`${styles['switch-modal__buttons-reject']} ${styles['switch-modal__button']}`}
                            onClick={fileEditor.actions.rejectSwitch}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default SwitchWhileEditModal;