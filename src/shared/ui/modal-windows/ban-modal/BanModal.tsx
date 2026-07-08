import React, {FC} from 'react';
import Modal from "../modal/Modal";
import modalStyles from '../modal/ModalContent.module.scss'
import styles from './BanModal.module.scss'
import {ReactComponent as SwitchModeSvg} from './images/ban-modal-switch-auth.svg';
import {useAppContext} from "../../../../context/app-context/hooks/useAppContext";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store";
import {BanMode} from "../../../lib/hooks/use-ban-user-handler/ban-user.types";

interface BanModalProps {

}

const BanModal: FC<BanModalProps> = () => {
    const {userBan} = useAppContext();

    const viewedUser = useSelector((state: RootState) => state.user.viewedUser);

    const messageClass =
        userBan.state.message
            ? modalStyles.modal__message
            : userBan.state.error
                ? modalStyles.modal__error
                : `${modalStyles.modal__message} ${modalStyles.hidden}`;

    const isBanMode = userBan.state.mode === BanMode.ban;

    const isButtonDisabled =
        isBanMode && (userBan.state.loading || !userBan.state.value.trim());

    return (
        <Modal
            isOpen={userBan.state.isOpened}
            onClose={userBan.actions.close}
        >
            <div className={`${['modalStyles.modal__overlay']} ${styles['ban-modal__overlay']}`}>
                <div className={`${modalStyles['modal__form']} ${styles['ban-modal__form']}`}>
                    <div className={modalStyles['modal__header']}>
                        <p className={`${modalStyles['modal__title']} ${styles['ban-modal__title']}`}>
                            {userBan.state.mode === BanMode.ban ? 'Ban user' : 'Unban user'}{' '}
                            <span className={styles['ban-modal__user']}>{viewedUser?.email}</span>
                        </p>
                        <p className={messageClass}>
                            {userBan.state.message || userBan.state.error}
                        </p>
                        <SwitchModeSvg
                            className={styles['ban-modal__switch']}
                            onClick={userBan.actions.switchMode}/>
                    </div>
                    <div className={`${styles['ban-modal__body']}`}>
                        {isBanMode &&
                            <input
                                ref={userBan.state.inputRef}
                                type='text'
                                className={`${modalStyles['modal__input']} ${styles['ban-modal__input-input']}`}
                                placeholder={"Enter a ban reason"}
                                value={userBan.state.value}
                                disabled={userBan.state.loading}
                                onChange={(e) => userBan.actions.handleChangeValue(e)}
                            />}
                        <button
                            className={`${modalStyles['modal__button']} ${styles['ban-modal__button-button']}`}
                            disabled={isButtonDisabled}
                            onClick={userBan.actions.toggleBan}>
                            {userBan.actions.getButtonText()}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default BanModal;