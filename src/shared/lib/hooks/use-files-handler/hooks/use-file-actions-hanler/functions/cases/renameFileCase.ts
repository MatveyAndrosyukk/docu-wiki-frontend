import {findFileById} from "../../../../../../../../store/utils/fileTreeActionUtils";
import {updateFileName} from "../../../../../../../../store/thunks/files/updateFileName";
import {checkNameConflictInFolder} from "../../../../../../utils/modalUtils";
import {FileActionsHandlerContext} from "../../file-actions-handler.types";

interface Params {
    context: FileActionsHandlerContext;

    fileId: number;

    title: string;
}

export function renameFileCase(
    {
        context,
        fileId,
        title,
    }: Params
) {
    const {
        files,

        dispatch,

        viewedUserEmail,

        loggedInUserEmail,

        closeModal,

        setModalError,
    } = context;

    const node = findFileById(
        files,
        fileId
    );

    const parentId = node?.parent ?? null;

    if (
        checkNameConflictInFolder(
            files,
            parentId,
            title
        )
    ) {

        if (node?.name !== title) {

            setModalError(
                'File with this name exists'
            );

            return;
        }
    }

    dispatch(
        updateFileName(
            {
                id: fileId,
                name: title,
                viewedUserEmail,
                loggedInUserEmail,
            }
        )
    );

    closeModal();
}