import {ChangeEvent, useCallback} from "react";
import {LoginActionsState} from "../use-login-handler/login.types";
import {RegisterActionsState} from "../use-registration-handler/registration.types";
import {AuthorizationActionsState} from "./authorization.types";

interface Props {
    login: LoginActionsState;
    registration: RegisterActionsState
}

export default function useAuthorizationHandler(
    {
        login,
        registration,
    }: Props
): AuthorizationActionsState {

    const closeModal = useCallback(
        () => {

            login.actions.reset();

            registration.actions.reset();
        },
        [
            login.actions,
            registration
        ]
    );

    const handleChangeEmail = useCallback(
        (
            e: ChangeEvent<HTMLInputElement>
        ) => {
            if (registration.state.isModal) {

                registration.actions.setValue({
                    email: e.currentTarget.value
                })
            } else {

                login.actions.setValue({
                    login: e.currentTarget.value
                })
            }
        },
        [
            registration,
            login.actions
        ]
    );

    const handleChangePassword = useCallback(
        (
            e: ChangeEvent<HTMLInputElement>
        ) => {
            if (registration.state.isModal) {

                registration.actions.setValue({
                    password: e.currentTarget.value
                });

            } else {

                login.actions.setValue({
                    password: e.currentTarget.value
                });

            }
        },
        [
            registration,
            login.actions
        ]
    );

    const handleChangeRePassword = useCallback(
        (
            e: ChangeEvent<HTMLInputElement>
        ) => {
            if (registration.state.isModal) {

                registration.actions.setValue({
                    rePassword: e.currentTarget.value
                });

            }
        },
        [
            registration
        ]
    );

    const handleChangeUsername = useCallback(
        (
            e: ChangeEvent<HTMLInputElement>
        ) => {
            if (registration.state.isModal) {

                registration.actions.setValue({
                    username: e.currentTarget.value
                });

            }
        },
        [
            registration
        ]
    );

    const authorize = useCallback(
        () => {
            if (registration.state.isModal) {

                registration.actions.register()
                    .catch(
                        console.error
                    );

            } else {

                login.actions.login()
                    .then(
                        () => closeModal()
                    )
                    .catch(
                        (
                            error
                        ) => {

                            login.actions.setMessage(null);

                            if (error instanceof Error) {

                                login.actions.setError(error.message);

                            }
                        })
            }
        },
        [
            registration,
            login.actions,
            closeModal
        ]
    );

    const switchAuthorization = useCallback(
        () => {

            login.actions.setError(null);

            login.actions.setMessage(null);

            registration.actions.setError(null);

            registration.actions.setMessage(null);

            registration.actions.setIsModal(
                !registration.state.isModal
            );

        },
        [
            login.actions,
            registration
        ]
    );

    const getAuthorizationText =
        () => {

            if (registration.state.isModal) {

                return registration.state.loading
                    ? 'Register...'
                    : 'Register';

            } else {

                return login.state.loading
                    ? 'Login...'
                    : 'Login';

            }
        };

    return {
        state: {},
        actions: {
            closeModal,
            handleChangeEmail,
            handleChangePassword,
            handleChangeUsername,
            handleChangeRePassword,
            authorize,
            switchAuthorization,
            getAuthorizationText,
        }
    };
}