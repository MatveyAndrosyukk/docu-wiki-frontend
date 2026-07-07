import useRegisterActions from "./hooks/use-registration-actions/useRegisterActions";
import useLoginActions from "./hooks/use-login-actions/useLoginActions";
import useEmailActions from "./hooks/use-email-actions/useEmailActions";
import useResetActions from "./hooks/use-reset-actions/useResetActions";
import useAuthorizationActions from "./hooks/use-authorization-actions/useAuthorizationActions";
import {AuthorizationActionsState} from "./hooks/use-authorization-actions/authorization.types";
import {LoginActionsState} from "./hooks/use-login-actions/login.types";
import {RegisterActionsState} from "./hooks/use-registration-actions/registration.types";
import {EmailActionsState} from "./hooks/use-email-actions/email.types";
import {ResetActionsState} from "./hooks/use-reset-actions/reset.types";
import {GoogleActionsState} from "./hooks/use-google-actions/google.types";
import useGoogleActions from "./hooks/use-google-actions/useGoogleActions";

export type AuthState = {

    login: LoginActionsState;

    registration: RegisterActionsState;

    email: EmailActionsState;

    reset: ResetActionsState;

    google: GoogleActionsState;

    authorization: AuthorizationActionsState;
}

export default function useAuth(): AuthState {
    const registration = useRegisterActions();

    const login = useLoginActions();

    const email = useEmailActions();

    const reset = useResetActions(
        login,
        registration
    );

    const google = useGoogleActions(
        {
            closeLoginModal: login.actions.closeModal,
        }
    );

    const authorization = useAuthorizationActions({
        login,
        registration,
    })

    return {
        login,
        registration,
        email,
        reset,
        google,
        authorization,
    };
}