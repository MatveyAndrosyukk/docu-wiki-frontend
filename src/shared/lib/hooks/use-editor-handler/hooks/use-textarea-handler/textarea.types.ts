import {ChangeEvent, RefObject} from "react";

export type TextareaState = {

    textareaRef?: RefObject<HTMLTextAreaElement | null>;

    content: string;

};

export type TextareaActions = {

    handleChangeTextarea(
        e: ChangeEvent<HTMLTextAreaElement>
    ): void;

    setContent(
        value: string
    ): void;

    pasteTag(
        tag: string
    ): void;

    wrapSelection(
        start: string,
        end: string
    ): void;

    reset(
        content: string
    ): void;

    updateContent(
        updater: (
            previous: string
        ) => string
    ): void;

};

export type TextareaActionsState = {

    state: TextareaState;

    actions: TextareaActions;

};

export const initialState: TextareaState = {

    content: "",

};