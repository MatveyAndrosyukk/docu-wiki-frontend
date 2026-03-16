import {ChangeEvent, useCallback, useRef, useState} from "react";
import {uploadImageAsync} from "../../../services/uploadImageAsync";
import {addPendingImage, markImageError, removePendingImage} from "../../../store/slices/fileUiSlice";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../store";
import extractImagesName from "../utils/extractImageNames";

interface Params {
    fileId: number
    pasteTag: (tag: string) => void
    replaceImageTag: (temp: string, real: string) => void
    contentError: string
    initialContent: string
}

export const useEditorImages = (
    {
        fileId,
        pasteTag,
        replaceImageTag,
        contentError,
        initialContent
    }: Params) => {
    const [addedImagesWhileEditing, setAddedImagesWhileEditing] =
        useState<string[]>(() => extractImagesName(initialContent));

    const dispatch = useDispatch<AppDispatch>();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleOpenFileDialog = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleSelectImage = useCallback(async (image: File) => {

        if (contentError.includes("too many pictures")) return;

        const tempName = `temp-${Date.now()}`;

        dispatch(addPendingImage({
            fileId,
            imageName: tempName
        }));

        pasteTag(`[image/${tempName}]`);

        setAddedImagesWhileEditing(prev => [...prev, tempName]);

        try {

            const data = await uploadImageAsync(image);

            replaceImageTag(tempName, data.fileName);

            dispatch(removePendingImage(tempName));

        } catch {

            dispatch(markImageError(tempName));

        }

    }, [contentError, dispatch, fileId, pasteTag, replaceImageTag]);

    const changeFileHandler = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {

            const files = e.target.files;

            if (files && files.length > 0) {

                const file = files[0];

                handleSelectImage(file).then(() => {
                    e.target.value = "";
                });

            }

        },
        [handleSelectImage]
    );

    return {
        fileInputRef,
        addedImagesWhileEditing,
        setAddedImagesWhileEditing,
        handleOpenFileDialog,
        changeFileHandler,
    };
};