import {AppDispatch} from "../../../../../store";
import {addPendingFile, openFolder} from "../../../../../store/slices/fileUiSlice";
import {updateUserFilesCount} from "../../../../../store/slices/userSlice";

interface CreateOptimisticFileParams {
    dispatch: AppDispatch;
    parentId: number;
    tempId: number;
    name: string;
    viewedUserEmail: string;
    filesCountDelta: number;
}

export function createOptimisticFile(
    {
        dispatch,
        parentId,
        tempId,
        name,
        viewedUserEmail,
        filesCountDelta,
    }: CreateOptimisticFileParams
) {
    dispatch(
        openFolder(parentId)
    );

    dispatch(
        addPendingFile({
            tempId,
            parentId,
            name,
        })
    );

    dispatch(
        updateUserFilesCount({
            email: viewedUserEmail,
            delta: filesCountDelta,
        })
    );
}