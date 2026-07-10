import {ActionModalState, FileActionsHandlerState, initialState} from "./file-actions-handler.types";

export type FileActionsHandlerAction =

    |

    {
        type: "OPEN";

        payload: ActionModalState;
    }

    |

    {
        type: "CLOSE";
    }

    |

    {
        type: "SET_VALUE";

        payload: string;
    }

    |

    {
        type: "SET_ERROR";

        payload: string;
    }

    |

    {
        type: "SET_LIMIT_ERROR";

        payload: boolean;
    }

    |

    {
        type: "SET_PENDING_PASTE";

        payload: number | null;
    }

    |

    {
        type: "RESET";
    };


export function fileActionsHandlerReducer(
    state: FileActionsHandlerState,
    action: FileActionsHandlerAction
): FileActionsHandlerState {


    switch (action.type) {


        case "OPEN":

            return {

                ...state,

                isOpen: true,

                modalState: action.payload,

            };


        case "CLOSE":

            return {

                ...state,

                isOpen: false,

                value: "",

                error: "",

                modalState:
                initialState.modalState,

            };


        case "SET_VALUE":

            return {

                ...state,

                value: action.payload,

            };


        case "SET_ERROR":

            return {

                ...state,

                error: action.payload,

            };


        case "SET_LIMIT_ERROR":

            return {

                ...state,

                isLimitError:
                action.payload,

            };


        case "SET_PENDING_PASTE":

            return {

                ...state,

                pendingPasteId:
                action.payload,

            };


        case "RESET":

            return {
                ...initialState,
            };


        default:

            return state;

    }

}