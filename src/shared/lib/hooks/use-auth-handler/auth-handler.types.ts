import {LoginActionsState} from "./hooks/use-login-handler/login.types";
import {RegisterActionsState} from "./hooks/use-registration-handler/registration.types";
import {ChangeEmailActionsState} from "./hooks/use-change-email-handler/change-email.types";
import {ResetPasswordActionsState} from "./hooks/use-reset-password-handler/reset-password.types";
import {GoogleActionsState} from "./hooks/use-google-handler/google.types";
import {AuthorizationActionsState} from "./hooks/use-authorization-handler/authorization.types";

export type AuthState = {

    loginHandler: LoginActionsState;

    registrationHandler: RegisterActionsState;

    changeEmailHandler: ChangeEmailActionsState;

    resetPasswordHandler: ResetPasswordActionsState;

    googleHandler: GoogleActionsState;

    authorizationHandler: AuthorizationActionsState;
}