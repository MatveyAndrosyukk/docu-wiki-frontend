import {ChangeEvent} from "react";

export type AuthorizationState = {

}

export type AuthorizationActions = {
    authorize(): void;

    switchAuthorization(): void;

    closeModal(): void;

    getAuthorizationText(): string;

    handleChangeEmail(
        e: ChangeEvent<HTMLInputElement>
    ): void;

    handleChangePassword(
        e: ChangeEvent<HTMLInputElement>
    ): void;

    handleChangeUsername(
        e: ChangeEvent<HTMLInputElement>
    ): void;

    handleChangeRePassword(
        e: ChangeEvent<HTMLInputElement>
    ): void;
}

export type AuthorizationActionsState = {
    state: AuthorizationState;

    actions: AuthorizationActions;
};