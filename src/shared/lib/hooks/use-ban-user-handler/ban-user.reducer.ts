import {BanMode, initialState, BanUserState} from "./ban-user.types";

export type UserBanAction =
    | {
    type: "OPEN";
}
    | {
    type: "CLOSE";
}
    | {
    type: "CHANGE_VALUE";
    payload: string;
}
    | {
    type: "SWITCH_MODE";
}
    | {
    type: "BAN_REQUEST";
}
    | {
    type: "BAN_SUCCESS";
}
    | {
    type: "BAN_ERROR";
    payload: string;
}
    | {
    type: "UNBAN_REQUEST";
}
    | {
    type: "UNBAN_SUCCESS";
}
    | {
    type: "UNBAN_ERROR";
    payload: string;
};

export function banUserReducer(
    state: BanUserState,
    action: UserBanAction
): BanUserState {

    switch (action.type) {

        case "OPEN":
            return {
                ...state,
                isOpened: true,
            };

        case "CLOSE":
            return {
                ...initialState,
                inputRef: state.inputRef,
            };

        case "CHANGE_VALUE":
            return {
                ...state,
                value: action.payload,
                error: "",
            };

        case "SWITCH_MODE":
            return {
                ...state,
                mode:
                    state.mode === BanMode.ban
                        ? BanMode.unban
                        : BanMode.ban,
                error: "",
                message: "",
                value: "",
            };

        case "BAN_REQUEST":
        case "UNBAN_REQUEST":
            return {
                ...state,
                loading: true,
                error: "",
                message: "",
            };

        case "BAN_SUCCESS":
            return {
                ...state,
                loading: false,
                value: "",
                error: "",
                message: "User was successfully banned.",
            };

        case "UNBAN_SUCCESS":
            return {
                ...state,
                loading: false,
                value: "",
                error: "",
                message: "User was successfully unbanned.",
            };

        case "BAN_ERROR":
        case "UNBAN_ERROR":
            return {
                ...state,
                loading: false,
                message: "",
                error: action.payload,
            };

        default:
            return state;
    }

}