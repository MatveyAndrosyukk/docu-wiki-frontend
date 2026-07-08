import {
    ChangeEvent,
    useCallback,
    useEffect,
    useReducer,
    useRef,
} from "react";
import {
    initialState,
    TextareaActionsState,
} from "./textarea.types";
import {textareaReducer} from "./textarea.reducer";

interface Params {

    initialContent: string;

    setIsFileContentChanged(
        value: boolean
    ): void;

}

export default function useTextareaHandler(
    {
        initialContent,
        setIsFileContentChanged,
    }: Params
): TextareaActionsState {

    const inputRef =
        useRef<HTMLTextAreaElement>(null);

    const [state, dispatch] = useReducer(
        textareaReducer,
        {
            ...initialState,
            textareaRef: inputRef,
            content: initialContent,
        }
    );

    useEffect(
        () => {

            dispatch(
                {
                    type: "RESET",
                    payload: initialContent,
                }
            );

            setIsFileContentChanged(false);

        },
        [
            initialContent,
            setIsFileContentChanged,
        ]
    );

    useEffect(
        () => {

            state.textareaRef?.current?.focus();

        },
        [
            state.textareaRef
        ]
    );

    const setContent = useCallback(
        (
            value: string,
        ) => {

            dispatch(
                {
                    type: "CHANGE_CONTENT",
                    payload: value,
                }
            );

            setIsFileContentChanged(true);

        },
        [
            setIsFileContentChanged,
        ]
    );

    const updateContent = useCallback(
        (
            updater: (
                previous: string
            ) => string,
        ) => {

            const value = updater(
                state.content
            );

            dispatch(
                {
                    type: "CHANGE_CONTENT",
                    payload: value,
                }
            );

            setIsFileContentChanged(true);

        },
        [
            state.content,
            setIsFileContentChanged,
        ]
    );

    const change = useCallback(
        (
            e: ChangeEvent<HTMLTextAreaElement>,
        ) => {

            setContent(
                e.target.value
            );

        },
        [
            setContent,
        ]
    );

    const pasteTag = useCallback(
        (
            tag: string,
        ) => {

            const textarea =
                state.textareaRef?.current;

            if (!textarea) {
                return;
            }

            const {
                selectionStart,
                selectionEnd,
                value,
            } = textarea;

            const newText = value.substring(
                    0,
                    selectionStart
                )
                + tag
                + value.substring(
                    selectionEnd
                );

            setContent(
                newText
            );

        },
        [
            state.textareaRef,
            setContent,
        ]
    );

    const wrapSelection = useCallback(
        (
            start: string,
            end: string,
        ) => {

            const textarea =
                state.textareaRef?.current;

            if (!textarea) {
                return;
            }

            const {
                selectionStart,
                selectionEnd,
                value,
            } = textarea;

            const newText =
                value.substring(
                    0,
                    selectionStart
                )
                + start
                + value.substring(
                    selectionStart,
                    selectionEnd
                )
                + end
                + value.substring(
                    selectionEnd
                );

            setContent(
                newText
            );

        },
        [
            state.textareaRef,
            setContent,
        ]
    );

    const reset = useCallback(
        (
            content: string,
        ) => {

            dispatch(
                {
                    type: "RESET",
                    payload: content,
                }
            );

            setIsFileContentChanged(false);

        },
        [
            setIsFileContentChanged,
        ]
    );

    return {

        state,

        actions: {

            handleChangeTextarea: change,

            setContent,

            pasteTag,

            wrapSelection,

            reset,

            updateContent,

        },

    };

}