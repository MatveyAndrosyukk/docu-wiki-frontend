import {FileImagesState} from "./file-images.types";

export type FileImagesAction =
    | {
    type: "UPLOAD_STARTED";
    payload: string;
}
    | {
    type: "UPLOAD_SUCCEEDED";
    payload: {
        tempName: string;
        realName: string;
    };
}
    | {
    type: "UPLOAD_FAILED";
    payload: string;
}
    | {
    type: "RESET";
    payload: string[];
};

export function fileImagesReducer(
    state: FileImagesState,
    action: FileImagesAction
): FileImagesState {

    switch (action.type) {

        case "UPLOAD_STARTED":

            return {

                ...state,

                addedImages: [
                    ...state.addedImages,
                    action.payload,
                ],

            };

        case "UPLOAD_SUCCEEDED":

            return {

                ...state,

                addedImages: state.addedImages.map(image =>
                    image === action.payload.tempName
                        ? action.payload.realName
                        : image
                ),

            };

        case "UPLOAD_FAILED":

            return {

                ...state,

                addedImages: state.addedImages.filter(
                    image => image !== action.payload
                ),

            };

        case "RESET":

            return {

                ...state,

                addedImages: action.payload,

            };

        default:

            return state;

    }

}