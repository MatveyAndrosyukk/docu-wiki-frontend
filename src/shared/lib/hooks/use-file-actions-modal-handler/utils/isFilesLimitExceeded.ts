import {isUserAdminOrOwner} from "../../../utils/permissions-utils/isUserAdminOrOwner";
import {User} from "../../../../../store/slices/userSlice";

interface Params {
    loggedInUser: User | null;
    totalFiles: number;
    filesToAdd: number;
    filesLimit: number;
}

export function isFilesLimitExceeded(
    {
        loggedInUser,
        totalFiles,
        filesToAdd,
        filesLimit,
    }: Params
) {
    return (
        !isUserAdminOrOwner(loggedInUser) &&
        totalFiles + filesToAdd > filesLimit
    );
}