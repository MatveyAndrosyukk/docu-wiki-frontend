import {useCallback, useReducer} from "react";
import {useDispatch, useSelector} from "react-redux";

import {selectFileTree} from "../../../../store/selectors/selectFileTree";
import {openPathToNode} from "../../../../store/slices/fileUiSlice";

import {FileSearchActionsState, initialState,} from "./file-search.types";
import {fileSearchReducer} from "./file-search.reducer";
import {SearchType} from "../../../../types/searchType";

export default function useFileSearchHandler(): FileSearchActionsState {
    const reduxDispatch = useDispatch();

    const files = useSelector(selectFileTree);

    const [state, dispatch] = useReducer(
        fileSearchReducer,
        initialState
    );

    const setSearchType = useCallback(
        (value: SearchType) => {
            dispatch({
                type: "SET_SEARCH_TYPE",
                payload: value,
            });
        },
        []
    );

    const switchSearchType = useCallback(() => {
        dispatch({
            type: "SWITCH_SEARCH_TYPE",
        });
    }, []);

    const openPathToSelectedFile = useCallback(
        (id: number) => {
            reduxDispatch(openPathToNode({id, files}));
        },
        [reduxDispatch, files]
    );

    return {
        state,
        actions: {
            setSearchType,
            switchSearchType,
            openPathToSelectedFile,
        },
    };
}