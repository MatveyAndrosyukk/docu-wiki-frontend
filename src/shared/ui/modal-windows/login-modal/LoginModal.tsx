import React, {FC, useCallback} from 'react';
import styles from './LoginModal.module.scss';
import modalStyles from '../modal/ModalContent.module.scss';
import Modal from "../modal/Modal";
import GoogleButton from "../../google-button/GoogleButton";
import {ReactComponent as SwitchAuthSvg} from './images/login-modal-switch-auth.svg';
import {useAppContext} from "../../../../context/app-context/hooks/useAppContext";
import {useAuthContext} from "../../../../context/auth-context/hooks/useAuthContext";

const LoginModal: FC = () => {
    const {
        authHandler
    } = useAppContext();

    const {
        registrationHandler,
        authorizationHandler,
        loginHandler,
        resetPasswordHandler,
    } = authHandler;

    const {
        authStatus
    } = useAuthContext();

    const openEnterEmailModal = useCallback(
        () => {

            loginHandler.actions.closeModal();

            resetPasswordHandler.actions.openModal();
        },
        [
            loginHandler.actions,
            resetPasswordHandler.actions
        ]
    );

    if (!loginHandler.state.isModalOpen)

        return null;

    const messageText = loginHandler.state.message
        || registrationHandler.state.message
        || loginHandler.state.error
        || registrationHandler.state.error;

    const messageClassName = (loginHandler.state.message ||
        registrationHandler.state.message)
        ? modalStyles.modal__message
        : (loginHandler.state.error ||
            registrationHandler.state.error)
            ? modalStyles.modal__error
            : `${modalStyles.modal__message} ${modalStyles.hidden}`;

    const emailValue = registrationHandler.state.isModal
        ? registrationHandler.state.value.email
        : loginHandler.state.value.login;

    const passwordValue = registrationHandler.state.isModal
        ? registrationHandler.state.value.password
        : loginHandler.state.value.password;

    return (
        <Modal
            isOpen={
                loginHandler.state.isModalOpen
            }

            onClose={
                loginHandler.actions.closeModal
            }
        >
            <div
                className={`
                ${modalStyles['modal__overlay']} 
                ${styles['login-modal__overlay']}
                `}
            >
                <div
                    className={`
                    ${modalStyles['modal__form']} 
                    ${styles['login-modal__form']}
                    `}
                >
                    <div
                        className={
                            styles['login-modal__header']
                        }
                    >
                        <p
                            className={
                                styles['login-modal__form-text']
                            }
                        >
                            {registrationHandler.state.isModal
                                ? 'Register'
                                : 'Login'
                            }
                        </p>
                        <SwitchAuthSvg
                            className={
                                styles['login-modal__switch']
                            }

                            onClick={
                                authorizationHandler.actions.switchAuthorization
                            }
                        />
                    </div>
                    <p
                        className={
                            messageClassName
                        }
                    >
                        {
                            messageText
                        }
                    </p>
                    <input
                        ref={
                            loginHandler.state.inputRef
                        }

                        type='text'

                        className={
                            modalStyles['modal__input']
                        }

                        placeholder="Enter your email"

                        value={
                            emailValue
                        }

                        onChange={
                            authorizationHandler.actions.handleChangeEmail
                        }
                    />
                    {
                        registrationHandler.state.isModal && (

                            <input
                                type='text'

                                className={
                                    modalStyles['modal__input']
                                }

                                placeholder="Enter username"

                                value={
                                    registrationHandler.state.value.username
                                }

                                onChange={
                                    authorizationHandler.actions.handleChangeUsername
                                }
                            />
                        )
                    }
                    <input
                        type='password'

                        className={
                            modalStyles['modal__input']
                        }

                        placeholder="Enter your password"

                        value={
                            passwordValue
                        }

                        onChange={
                            authorizationHandler.actions.handleChangePassword
                        }
                    />

                    {
                        registrationHandler.state.isModal && (

                            <input
                                type='password'

                                className={
                                    modalStyles['modal__input']
                                }

                                placeholder="Repeat your password"

                                value={
                                    registrationHandler.state.value.rePassword
                                }

                                onChange={
                                    authorizationHandler.actions.handleChangeRePassword
                                }
                            />
                        )
                    }
                    <div
                        className={
                            styles['login-modal__footer']
                        }
                    >
                        <div
                            className={
                                styles['footer__left']
                            }
                        >
                            <p
                                className={
                                    styles['login-modal__forgot-password']
                                }

                                onClick={
                                    openEnterEmailModal
                                }
                            >
                                Forgot password?
                            </p>
                        </div>
                        <div className={
                            styles['footer__center']
                        }
                        >
                            <button
                                className={
                                    modalStyles.modal__button
                                }

                                disabled={
                                    loginHandler.state.loading ||
                                    authStatus === 'loading'
                                }

                                onClick={
                                    authorizationHandler.actions.authorize
                                }
                            >
                                {
                                    (loginHandler.state.loading ||
                                        registrationHandler.state.loading)
                                        ?
                                        <span
                                            className={
                                                styles['login-modal__loader']
                                            }
                                        />
                                        :
                                        authorizationHandler.actions.getAuthorizationText()
                                }
                            </button>
                        </div>
                        <div
                            className={
                                styles['footer__right']
                            }
                        >
                            <GoogleButton/>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default LoginModal;