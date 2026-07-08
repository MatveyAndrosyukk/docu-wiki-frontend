import {ChangeEvent, useCallback, useEffect, useReducer, useRef,} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store";
import {banUserByReasonAsync} from "../../services/banUserByReasonAsync";
import {unbanUserByReasonAsync} from "../../services/unbanUserAsync";
import {BanMode, initialState, BanUserActionsState,} from "./ban-user.types";
import {banUserReducer} from "./ban-user.reducer";

export default function useBanUserHandler(): BanUserActionsState {

    const inputRef = useRef<HTMLInputElement>(null);

    const viewedUser = useSelector(
        (state: RootState) => state.user.viewedUser
    );

    const [state, dispatch] = useReducer(
        banUserReducer,
        {
            ...initialState,
            inputRef,
        }
    );

    useEffect(() => {

            if (state.isOpened) {

                state.inputRef?.current?.focus();
            }

        },
        [
            state.inputRef,
            state.isOpened
        ]
    );

    const open = useCallback(
        () => {

            dispatch(
                {
                    type: "OPEN",
                }
            );
        },
        []
    );

    const close = useCallback(
        () => {

            dispatch(
                {
                    type: "CLOSE",
                }
            );
        },
        []
    );

    const switchMode = useCallback(
        () => {

            dispatch(
                {
                    type: "SWITCH_MODE",
                }
            );
        },
        []);

    const handleChangeValue = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {

            dispatch(
                {
                    type: "CHANGE_VALUE",
                    payload: e.target.value,
                }
            );
        },
        []
    );

    const ban = useCallback(
        async () => {

            const reason = state.value.trim();

            if (!reason) {

                dispatch(
                    {
                        type: "BAN_ERROR",
                        payload: "Ban reason is required",
                    }
                );

                return;
            }

            if (!viewedUser?.id) {

                return;
            }

            dispatch(
                {
                    type: "BAN_REQUEST",
                }
            );

            try {

                await banUserByReasonAsync(
                    {
                        email: viewedUser.email,
                        banReason: reason,
                    }
                );

                dispatch(
                    {
                        type: "BAN_SUCCESS",
                    }
                );

            } catch (error: any) {

                dispatch(
                    {
                        type: "BAN_ERROR",
                        payload: error.message,
                    }
                );

            }

        },
        [
            state.value,
            viewedUser,
        ]
    );

    const unban = useCallback(
        async () => {

            if (!viewedUser?.id) {

                return;
            }

            dispatch(
                {
                    type: "UNBAN_REQUEST",
                }
            );

            try {

                await unbanUserByReasonAsync(
                    viewedUser.email
                );

                dispatch(
                    {
                        type: "UNBAN_SUCCESS",
                    }
                );

            } catch (error: any) {

                dispatch(
                    {
                        type: "UNBAN_ERROR",
                        payload: error.message,
                    }
                );

            }

        }, [
            viewedUser,
        ]);

    const toggleBan = useCallback(
        () => {

            if (state.mode === BanMode.ban) {

                ban().catch(
                    console.error
                );
            } else {

                unban().catch(
                    console.error
                );
            }

        },
        [
            state.mode,
            ban,
            unban,
        ]
    );

    const getButtonText = useCallback(
        () => {

            if (state.mode === BanMode.ban) {
                return state.loading
                    ? "Ban..."
                    : "Ban";
            }

            return state.loading
                ? "Unban..."
                : "Unban";

        },
        [
            state.mode,
            state.loading,
        ]
    );

    return {

        state,

        actions: {

            open,

            close,

            switchMode,

            handleChangeValue,

            ban,

            unban,

            toggleBan,

            getButtonText,

        },

    };

}