import {isUserAdminOrOwner} from "../../../../../utils/permissions-utils/isUserAdminOrOwner";
import {User} from "../../../../../../../store/slices/userSlice";

interface Params {
    viewedUser: User | null;

    totalFiles: number;

    filesToAdd: number;

    filesLimit: number;
}

export function isFilesLimitExceeded(
    {
        viewedUser,
        totalFiles,
        filesToAdd,
        filesLimit,
    }: Params
) {

    if (!viewedUser) {
        return true;
    }

    if (viewedUser.isPremium) {
        return false;
    }

    if (
        isUserAdminOrOwner(
            viewedUser
        )
    ) {
        return false;
    }

    return (
        totalFiles + filesToAdd > filesLimit
    );

}