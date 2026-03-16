import React, {FC} from 'react';
import Modal from "../modal/Modal";
import modalStyles from '../modal/ModalContent.module.scss'
import styles from './BanModal.module.scss'
import {ReactComponent as SwitchModeSvg} from './images/ban-modal-switch-auth.svg';
import {BanMode} from "../../../lib/hooks/useEditorBan";
import {useAppContext} from "../../../lib/hooks/useAppContext";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store";

interface BanModalProps {

}

const BanModal: FC<BanModalProps> = () => {
    const {banState} = useAppContext();

    const viewedUser = useSelector((state: RootState) => state.user.viewedUser);

    const {
        isBanModalOpened,
        handleCloseBanModal,
        banModalMessage,
        banModalError,
        banModalInputRef,
        banModalValue,
        banModalLoading,
        banModalMode,
        handleChangeBanModalValue,
        handleSwitchBanMode,
        handleBanOrUnbanUser,
        getButtonText
    } = banState

    const messageClass =
        banModalMessage
            ? modalStyles.modal__message
            : banModalError
                ? modalStyles.modal__error
                : `${modalStyles.modal__message} ${modalStyles.hidden}`;

    const isBanMode = banModalMode === BanMode.ban;

    const isButtonDisabled =
        isBanMode && (banModalLoading || !banModalValue.trim());

    return (
        <Modal
            isOpen={isBanModalOpened}
            onClose={handleCloseBanModal}
        >
            <div className={`${['modalStyles.modal__overlay']} ${styles['ban-modal__overlay']}`}>
                <div className={`${modalStyles['modal__form']} ${styles['ban-modal__form']}`}>
                    <div className={modalStyles['modal__header']}>
                        <p className={`${modalStyles['modal__title']} ${styles['ban-modal__title']}`}>
                            {banModalMode === BanMode.ban ? 'Ban user' : 'Unban user'}{' '}
                            <span className={styles['ban-modal__user']}>{viewedUser?.email}</span>
                        </p>
                        <p className={messageClass}>
                            {banModalMessage || banModalError}
                        </p>
                        <SwitchModeSvg
                            className={styles['ban-modal__switch']}
                            onClick={handleSwitchBanMode}/>
                    </div>
                    <div className={`${styles['ban-modal__body']}`}>
                        {isBanMode &&
                            <input
                                ref={banModalInputRef}
                                type='text'
                                className={`${modalStyles['modal__input']} ${styles['ban-modal__input-input']}`}
                                placeholder={"Enter a ban reason"}
                                value={banModalValue}
                                disabled={banModalLoading}
                                onChange={(e) => handleChangeBanModalValue(e)}
                            />}
                        <button
                            className={`${modalStyles['modal__button']} ${styles['ban-modal__button-button']}`}
                            disabled={isButtonDisabled}
                            onClick={handleBanOrUnbanUser}>
                            {getButtonText()}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default BanModal;