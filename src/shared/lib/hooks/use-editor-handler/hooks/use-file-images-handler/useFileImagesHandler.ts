import {ChangeEvent, useCallback, useReducer, useRef,} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../../../../../store";
import {addPendingImage, markImageError, removePendingImage,} from "../../../../../../store/slices/fileUiSlice";
import {uploadImageAsync} from "../../../../services/uploadImageAsync";
import extractImagesName from "../../../../utils/extractImageNames";
import {FileImagesActionsState, initialState,} from "./file-images.types";
import {fileImagesReducer} from "./file-images.reducer";
import {selectOpenedFile} from "../../../../../../store/selectors/selectOpenedFile";

interface Params {
    pasteTag: (tag: string) => void;
    replaceImageTag: (temp: string, real: string) => void;
    contentError: string;
}

export default function useFileImagesHandler(
    {
        pasteTag,
        replaceImageTag,
        contentError,
    }: Params): FileImagesActionsState {

    const inputRef = useRef<HTMLInputElement>(null);

    const reduxDispatch = useDispatch<AppDispatch>();

    const openedFile = useSelector(selectOpenedFile);

    const [state, dispatch] = useReducer(
        fileImagesReducer,
        {
            ...initialState,
            inputRef,
            addedImages: extractImagesName(
                openedFile?.content ?? ""
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
                        fileId: openedFile?.id,
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
            reduxDispatch,
            openedFile?.id,
            pasteTag,
            replaceImageTag
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