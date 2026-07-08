import {ChangeEvent, RefObject} from "react";

export enum BanMode {
    ban = "ban",
    unban = "unban",
}

export type BanUserState = {

    inputRef?: RefObject<HTMLInputElement | null>;

    isOpened: boolean;

    value: string;

    loading: boolean;

    error: string;

    message: string;

    mode: BanMode;

};

export type BanUserActions = {

    open(): void;

    close(): void;

    switchMode(): void;

    handleChangeValue(
        e: ChangeEvent<HTMLInputElement>
    ): void;

    ban(): Promise<void>;

    unban(): Promise<void>;

    toggleBan(): void;

    getButtonText(): string;

};

export type BanUserActionsState = {

    state: BanUserState;

    actions: BanUserActions;

};

export const initialState: BanUserState = {

    isOpened: false,

    value: "",

    loading: false,

    error: "",

    message: "",

    mode: BanMode.ban,

};