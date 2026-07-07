import {checkNameConflictInFolder, createFilePayload} from "../../../../../../lib/utils/modalUtils";
import {addPendingFile, openFolder} from "../../../../../../../store/slices/fileUiSlice";
import {createFile} from "../../../../../../../store/thunks/files/createFile";
import {FileType} from "../../../../../../../types/file";
import {ModalActionContext} from "../types/ModalActionContext";

interface Params {
    context: ModalActionContext;
    parentId: number;
    title: string;
}

export function addFolderCase(
    {
        context,
        parentId,
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
        checkNameConflictInFolder(
            files,
            parentId,
            title
        )
    ) {
        setModalError(
            'Folder with this name exists'
        );
        return;
    }

    const tempId =
        Date.now();

    dispatch(
        openFolder(parentId)
    );

    dispatch(
        addPendingFile({
            tempId,
            parentId,
            name: title,
        })
    );

    dispatch(
        createFile({
            ...createFilePayload(
                title,
                FileType.Folder,
                parentId,
                viewedUserEmail
            ),
            tempId,
        })
    );

    closeModal();
}