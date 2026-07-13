import useRegistrationHandler from "./hooks/use-registration-handler/useRegistrationHandler";
import useLoginHandler from "./hooks/use-login-handler/useLoginHandler";
import useChangeEmailHandler from "./hooks/use-change-email-handler/useChangeEmailHandler";
import useResetPasswordHandler from "./hooks/use-reset-password-handler/useResetPasswordHandler";
import useAuthorizationHandler from "./hooks/use-authorization-handler/useAuthorizationHandler";
import useGoogleHandler from "./hooks/use-google-handler/useGoogleHandler";
import {AuthState} from "./auth-handler.types";

export default function useAuthHandler(): AuthState {

    const registrationHandler = useRegistrationHandler();

    const loginHandler = useLoginHandler();

    const changeEmailHandler = useChangeEmailHandler();

    const resetPasswordHandler = useResetPasswordHandler(
        {
            loginHandler,
            registrationHandler
        }
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