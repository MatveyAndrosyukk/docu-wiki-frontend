import React, { FC, useCallback } from 'react';
import styles from './LoginModal.module.scss';
import modalStyles from '../modal/ModalContent.module.scss';
import Modal from "../modal/Modal";
import GoogleButton from "../../google-button/GoogleButton";
import { ReactComponent as SwitchAuthSvg } from './images/login-modal-switch-auth.svg';
import { useAuth } from "../../../lib/hooks/useAuth";
import { useAppContext } from "../../../lib/hooks/useAppContext";

const LoginModal: FC = () => {
    const { authState } = useAppContext();
    const { authStatus } = useAuth();

    const {
        isLoginModalOpen,
        handleCloseAuthModal,
        isRegisterModal,
        registerError,
        loginError,
        loginModalInputRef,
        loginLoading,
        registerModalValue,
        loginModalValue,
        loginMessage,
        registerMessage,
        setIsEnterEmailModalOpened,
        handleChangeEmailInput,
        handleChangePasswordInput,
        handleChangeRePasswordInput,
        handleSwitchAuthorization,
        handleAuthorize,
        getAuthorizationText,
    } = authState;

    const handleOpenEnterEmailModal = useCallback(() => {
        handleCloseAuthModal();
        setIsEnterEmailModalOpened(true);
    }, [handleCloseAuthModal, setIsEnterEmailModalOpened]);

    if (!isLoginModalOpen) return null;

    const messageText = loginMessage || registerMessage || loginError || registerError;
    const messageClassName = loginMessage || registerMessage
        ? modalStyles.modal__message
        : loginError || registerError
            ? modalStyles.modal__error
            : `${modalStyles.modal__message} ${modalStyles.hidden}`;

    const emailValue = isRegisterModal ? registerModalValue.email : loginModalValue.login;
    const passwordValue = isRegisterModal ? registerModalValue.password : loginModalValue.password;

    return (
        <Modal
            isOpen={isLoginModalOpen}
            onClose={handleCloseAuthModal}
        >
            <div className={`${modalStyles['modal__overlay']} ${styles['login-modal__overlay']}`}>
                <div className={`${modalStyles['modal__form']} ${styles['login-modal__form']}`}>

                    <div className={styles['login-modal__header']}>
                        <p className={styles['login-modal__form-text']}>
                            {isRegisterModal ? 'Register' : 'Login'}
                        </p>
                        <SwitchAuthSvg
                            className={styles['login-modal__switch']}
                            onClick={handleSwitchAuthorization}
                        />
                    </div>

                    <p className={messageClassName}>{messageText}</p>

                    <input
                        ref={loginModalInputRef}
                        type='text'
                        className={modalStyles['modal__input']}
                        placeholder="Enter your email"
                        value={emailValue}
                        onChange={handleChangeEmailInput}
                    />
                    <input
                        type='password'
                        className={modalStyles['modal__input']}
                        placeholder="Enter your password"
                        value={passwordValue}
                        onChange={handleChangePasswordInput}
                    />

                    {isRegisterModal && (
                        <input
                            type='password'
                            className={modalStyles['modal__input']}
                            placeholder="Repeat your password"
                            value={registerModalValue.rePassword}
                            onChange={handleChangeRePasswordInput}
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
                                disabled={loginLoading || authStatus === 'loading'}
                                onClick={handleAuthorize}
                            >
                                {loginLoading ? <span className={styles['login-modal__loader']} /> : getAuthorizationText()}
                            </button>
                        </div>

                        <div className={styles['footer__right']}>
                            <GoogleButton />
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default LoginModal;