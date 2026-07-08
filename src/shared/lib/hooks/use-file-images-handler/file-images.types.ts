import {ChangeEvent, RefObject} from "react";

export type FileImagesState = {

    inputRef?: RefObject<HTMLInputElement | null>;

    addedImages: string[];

};

export type FileImagesActions = {

    openDialog(): void;

    uploadImage(image: File): Promise<void>;

    changeFile(e: ChangeEvent<HTMLInputElement>): void;

    reset(images: string[]): void;

};

export type FileImagesActionsState = {

    state: FileImagesState;

    actions: FileImagesActions;

};

export const initialState: FileImagesState = {

    addedImages: [],

};