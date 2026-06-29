import {AppDispatch} from "../../../../../store";
import {updateUserFilesCount} from "../../../../../store/slices/userSlice";

interface RollbackFilesCountParams {
    dispatch: AppDispatch;
    viewedUserEmail: string;
    delta: number;
}

export function rollbackFilesCount(
    {
        dispatch,
        viewedUserEmail,
        delta,
    }: RollbackFilesCountParams
) {

    dispatch(
        updateUserFilesCount({
            email: viewedUserEmail,
            delta: -delta,
        })
    );
}