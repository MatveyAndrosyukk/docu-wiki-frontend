import React, {FC, useCallback} from 'react';
import styles from './LoginModal.module.scss';
import modalStyles from '../modal/ModalContent.module.scss';
import Modal from "../modal/Modal";
import GoogleButton from "../../google-button/GoogleButton";
import {ReactComponent as SwitchAuthSvg} from './images/login-modal-switch-auth.svg';
import {useAppContext} from "../../../../context/app-context/hooks/useAppContext";
import {useAuthContext} from "../../../../context/auth-context/hooks/useAuthContext";

const LoginModal: FC = () => {
    const {authState} = useAppContext();

    const {
        registration,
        authorization,
        login,
        reset,
    } = authState;

    const {
        authStatus
    } = useAuthContext();

    const handleOpenEnterEmailModal = useCallback(() => {
        login.actions.closeModal();
        reset.actions.openModal();
    }, [login.actions, reset.actions]);

    if (!login.state.isModalOpen) return null;

    const messageText = login.state.message
        || registration.state.message
        || login.state.error
        || registration.state.error;

    const messageClassName = login.state.message || registration.state.message
        ? modalStyles.modal__message
        : login.state.error || registration.state.error
            ? modalStyles.modal__error
            : `${modalStyles.modal__message} ${modalStyles.hidden}`;

    const emailValue = registration.state.isModal
        ? registration.state.value.email
        : login.state.value.login;

    const passwordValue = registration.state.isModal
        ? registration.state.value.password
        : login.state.value.password;

    return (
        <Modal
            isOpen={login.state.isModalOpen}
            onClose={login.actions.closeModal}
        >
            <div className={`${modalStyles['modal__overlay']} ${styles['login-modal__overlay']}`}>
                <div className={`${modalStyles['modal__form']} ${styles['login-modal__form']}`}>

                    <div className={styles['login-modal__header']}>
                        <p className={styles['login-modal__form-text']}>
                            {registration.state.isModal ? 'Register' : 'Login'}
                        </p>
                        <SwitchAuthSvg
                            className={styles['login-modal__switch']}
                            onClick={authorization.actions.switchAuthorization}
                        />
                    </div>

                    <p className={messageClassName}>{messageText}</p>

                    <input
                        ref={login.state.inputRef}
                        type='text'
                        className={modalStyles['modal__input']}
                        placeholder="Enter your email"
                        value={emailValue}
                        onChange={authorization.actions.handleChangeEmail}
                    />
                    {registration.state.isModal && (
                        <input
                            type='text'
                            className={modalStyles['modal__input']}
                            placeholder="Enter username"
                            value={registration.state.value.username}
                            onChange={authorization.actions.handleChangeUsername}
                        />
                    )}
                    <input
                        type='password'
                        className={modalStyles['modal__input']}
                        placeholder="Enter your password"
                        value={passwordValue}
                        onChange={authorization.actions.handleChangePassword}
                    />

                    {registration.state.isModal && (
                        <input
                            type='password'
                            className={modalStyles['modal__input']}
                            placeholder="Repeat your password"
                            value={registration.state.value.rePassword}
                            onChange={authorization.actions.handleChangeRePassword}
                        />
                    )}

                    <div className={styles['login-modal__footer']}>
                        <div className={styles['footer__left']}>
                            <p
                                className={styles['login-modal__forgot-password']}
                                onClick={handleOpenEnterEmailModal}
                            >
                                Forgot password?
                            </p>
                        </div>

                        <div className={styles['footer__center']}>
                            <button
                                className={modalStyles.modal__button}
                                disabled={login.state.loading || authStatus === 'loading'}
                                onClick={authorization.actions.authorize}
                            >
                                {(login.state.loading || registration.state.loading) ?
                                    <span className={styles['login-modal__loader']}/> :
                                    authorization.actions.getAuthorizationText()}
                            </button>
                        </div>

                        <div className={styles['footer__right']}>
                            <GoogleButton/>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default LoginModal;