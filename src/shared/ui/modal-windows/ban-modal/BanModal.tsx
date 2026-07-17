import React, {FC} from 'react';
import Modal from "../modal/Modal";
import modalStyles from '../modal/ModalContent.module.scss'
import styles from './BanModal.module.scss'
import {ReactComponent as SwitchModeSvg} from './images/ban-modal-switch-auth.svg';
import {useAppContext} from "../../../../context/app-context/hooks/useAppContext";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store";
import {BanMode} from "../../../lib/hooks/use-ban-user-handler/ban-user.types";

const BanModal: FC = () => {

    const {
        banHandler
    } = useAppContext();

    const viewedUser = useSelector(
        (state: RootState) => state.user.viewedUser
    );

    const messageClass =
        banHandler.state.message
            ? modalStyles.modal__message
            : banHandler.state.error
                ? modalStyles.modal__error
                : `${modalStyles.modal__message} 
                ${modalStyles.hidden}`;

    const isBanMode =
        banHandler.state.mode === BanMode.ban;

    const isButtonDisabled =
        isBanMode &&
        (banHandler.state.loading ||
            !banHandler.state.value.trim());

    return (

        <Modal
            isOpen={
                banHandler.state.isOpened
            }

            onClose={
                banHandler.actions.close
            }
        >
            <div
                className={`
                ${['modalStyles.modal__overlay']} 
                ${styles['ban-modal__overlay']}
                `}
            >
                <div
                    className={`
                    ${modalStyles['modal__form']} 
                    ${styles['ban-modal__form']}
                    `}
                >
                    <div
                        className={
                            modalStyles['modal__header']
                        }
                    >
                        <p
                            className={`
                            ${modalStyles['modal__title']} 
                            ${styles['ban-modal__title']}`
                            }
                        >
                            {
                                banHandler.state.mode ===
                                BanMode.ban
                                    ? 'Ban user'
                                    : 'Unban user'
                            }
                            {
                                ' '
                            }
                            <span
                                className={
                                    styles['ban-modal__user']
                                }
                            >
                                {
                                    viewedUser?.email
                                }
                            </span>
                        </p>
                        <p
                            className={
                                messageClass
                            }
                        >
                            {
                                banHandler.state.message ||
                                banHandler.state.error
                            }
                        </p>
                        <SwitchModeSvg
                            className={
                                styles['ban-modal__switch']
                            }

                            onClick={
                                banHandler.actions.switchMode
                            }
                        />
                    </div>
                    <div
                        className={
                            `${styles['ban-modal__body']}`
                        }
                    >
                        {
                            isBanMode &&
                            <input
                                ref={
                                    banHandler.state.inputRef
                                }

                                type='text'

                                className={`
                                ${modalStyles['modal__input']}
                                ${styles['ban-modal__input-input']}`
                                }

                                placeholder={
                                    "Enter a ban reason"
                                }

                                value={
                                    banHandler.state.value
                                }

                                disabled={
                                    banHandler.state.loading
                                }

                                onChange={
                                    (
                                        e
                                    ) => banHandler.actions.handleChangeValue(
                                        e
                                    )
                                }
                            />
                        }
                        <button
                            className={`
                            ${modalStyles['modal__button']} 
                            ${styles['ban-modal__button-button']}
                            `}

                            disabled={
                                isButtonDisabled
                            }

                            onClick={
                                banHandler.actions.toggleBan
                            }
                        >
                            {
                                banHandler.actions.getButtonText()
                            }
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default BanModal;