import {createFilePayload, isNameExistsInRoot} from "../../../../../../utils/modalUtils";
import {createFile} from "../../../../../../../../store/thunks/files/createFile";
import {FileType} from "../../../../../../../../types/file";
import {addPendingRootFolder} from "../../../../../../../../store/slices/fileUiSlice";
import {FileActionsHandlerContext} from "../../file-actions-handler.types";

interface Params {
    context: FileActionsHandlerContext;

    title: string;
}

export function addRootFolderCase(
    {
        context,
        title,
    }: Params
) {
    const {
        files,

        dispatch,

        viewedUserEmail,

        closeModal,

        setModalError,
    } = context;

    if (
        isNameExistsInRoot(
            files,
            title
        )
    ) {

        setModalError(
            'Folder with this name exists'
        );

        return;
    }

    const tempId = Date.now();

    dispatch(
        addPendingRootFolder(
            {
                tempId,
                name: title,
            }
        )
    );

    dispatch(
        createFile(
            {
                ...createFilePayload(
                    title,
                    FileType.Folder,
                    null,
                    viewedUserEmail
                ),
                tempId,
            }
        )
    );

    closeModal();
}