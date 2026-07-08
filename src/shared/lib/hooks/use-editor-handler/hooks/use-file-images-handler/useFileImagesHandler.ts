import {ChangeEvent, useCallback, useReducer, useRef,} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../../../../store";
import {addPendingImage, markImageError, removePendingImage,} from "../../../../../../store/slices/fileUiSlice";
import {uploadImageAsync} from "../../../../services/uploadImageAsync";
import extractImagesName from "../../../../utils/extractImageNames";
import {FileImagesActionsState, initialState,} from "./file-images.types";
import {fileImagesReducer} from "./file-images.reducer";

interface Params {
    fileId: number;
    pasteTag: (tag: string) => void;
    replaceImageTag: (temp: string, real: string) => void;
    contentError: string;
    initialContent: string;
}

export default function useFileImagesHandler(
    {
        fileId,
        pasteTag,
        replaceImageTag,
        contentError,
        initialContent,
    }: Params): FileImagesActionsState {

    const inputRef = useRef<HTMLInputElement>(null);

    const reduxDispatch = useDispatch<AppDispatch>();

    const [state, dispatch] = useReducer(
        fileImagesReducer,
        {
            ...initialState,
            inputRef,
            addedImages: extractImagesName(
                initialContent
            ),
        }
    );

    const openDialog = useCallback(
        () => {

            state.inputRef?.current?.click();

        },
        [
            state.inputRef
        ]
    );

    const reset = useCallback(
        (
            images: string[]
        ) => {

            dispatch(
                {
                    type: "RESET",
                    payload: images,
                }
            );

        },
        []
    );

    const uploadImage = useCallback(
        async (
            image: File,
        ) => {

            if (contentError.includes(
                "too many pictures"
            )) {

                return;
            }

            const tempName = `temp-${Date.now()}`;

            dispatch(
                {
                    type: "UPLOAD_STARTED",
                    payload: tempName,
                }
            );

            reduxDispatch(
                addPendingImage(
                    {
                        fileId,
                        imageName: tempName,
                    }
                )
            );

            pasteTag(
                `[image/${tempName}]`
            );

            try {

                const data = await uploadImageAsync(
                    image
                );

                replaceImageTag(
                    tempName,
                    data.fileName,
                );

                reduxDispatch(
                    removePendingImage(
                        tempName
                    )
                );

                dispatch(
                    {
                        type: "UPLOAD_SUCCEEDED",
                        payload: {
                            tempName,
                            realName: data.fileName,
                        },
                    }
                );
            } catch {

                reduxDispatch(markImageError(
                        tempName
                    )
                );

                dispatch(
                    {
                        type: "UPLOAD_FAILED",
                        payload: tempName,
                    }
                );

            }

        },
        [
            contentError,
            fileId,
            pasteTag,
            replaceImageTag,
            reduxDispatch,
        ]
    );

    const handleChangeFile = useCallback(
        (
            e: ChangeEvent<HTMLInputElement>,
        ) => {

            const file = e.target.files?.[0];

            if (!file) {

                return;
            }

            uploadImage(
                file
            ).finally(
                () => {

                    e.target.value = "";
                }
            );
        },
        [
            uploadImage,
        ]
    );

    return {

        state,

        actions: {

            openDialog,

            uploadImage,

            changeFile: handleChangeFile,

            reset,
        },

    };

}