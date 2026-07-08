import useRegistrationHandler from "./hooks/use-registration-handler/useRegistrationHandler";
import useLoginHandler from "./hooks/use-login-handler/useLoginHandler";
import useChangeEmailHandler from "./hooks/use-change-email-handler/useChangeEmailHandler";
import useResetPasswordHandler from "./hooks/use-reset-password-handler/useResetPasswordHandler";
import useAuthorizationHandler from "./hooks/use-authorization-handler/useAuthorizationHandler";
import {AuthorizationActionsState} from "./hooks/use-authorization-handler/authorization.types";
import {LoginActionsState} from "./hooks/use-login-handler/login.types";
import {RegisterActionsState} from "./hooks/use-registration-handler/registration.types";
import {ChangeEmailActionsState} from "./hooks/use-change-email-handler/change-email.types";
import {ResetPasswordActionsState} from "./hooks/use-reset-password-handler/reset-password.types";
import {GoogleActionsState} from "./hooks/use-google-handler/google.types";
import useGoogleHandler from "./hooks/use-google-handler/useGoogleHandler";

export type AuthState = {

    loginHandler: LoginActionsState;

    registrationHandler: RegisterActionsState;

    changeEmailHandler: ChangeEmailActionsState;

    resetPasswordHandler: ResetPasswordActionsState;

    googleHandler: GoogleActionsState;

    authorizationHandler: AuthorizationActionsState;
}

export default function useAuthHandler(): AuthState {
    const registrationHandler = useRegistrationHandler();

    const loginHandler = useLoginHandler();

    const changeEmailHandler = useChangeEmailHandler();

    const resetPasswordHandler = useResetPasswordHandler(
        loginHandler,
        registrationHandler
    );

    const googleHandler = useGoogleHandler(
        {
            closeLoginModal: loginHandler.actions.closeModal,
        }
    );

    const authorizationHandler = useAuthorizationHandler({
        login: loginHandler,
        registration: registrationHandler,
    })

    return {
        loginHandler,
        registrationHandler,
        changeEmailHandler,
        resetPasswordHandler,
        googleHandler,
        authorizationHandler,
    };
}